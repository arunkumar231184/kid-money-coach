import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateSavingsGoalDialog } from "./CreateSavingsGoalDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Kid } from "@/hooks/useKids";

const mockMutateAsync = vi.fn();
vi.mock("@/hooks/useSavingsGoals", () => ({
  useCreateSavingsGoal: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockKid: Kid = {
  id: "kid-1",
  parent_id: "parent-123",
  name: "Alice",
  age: 10,
  allowance_amount: 10,
  allowance_frequency: "weekly",
  avatar_url: null,
  bank_account_connected: false,
  total_saved: 0,
  current_streak: 0,
  total_badges: 0,
  xp_points: 0,
  level: 1,
  pin_hash: null,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("CreateSavingsGoalDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMutateAsync.mockResolvedValue({});
  });

  it("renders the default trigger button with 'Set Goal'", () => {
    renderWithProviders(<CreateSavingsGoalDialog kid={mockKid} />);
    expect(screen.getByText("Set Goal")).toBeInTheDocument();
  });

  it("renders custom trigger when provided", () => {
    renderWithProviders(
      <CreateSavingsGoalDialog kid={mockKid} trigger={<button>Custom</button>} />
    );
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("opens dialog with kid name in title", async () => {
    renderWithProviders(<CreateSavingsGoalDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Goal"));

    expect(screen.getByText(`Set Savings Goal for ${mockKid.name}`)).toBeInTheDocument();
  });

  it("shows icon selection grid with 10 options", async () => {
    renderWithProviders(<CreateSavingsGoalDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Goal"));

    expect(screen.getByText("Choose an Icon")).toBeInTheDocument();
    // Check some icons exist
    expect(screen.getByTitle("Gaming")).toBeInTheDocument();
    expect(screen.getByTitle("Trainers")).toBeInTheDocument();
    expect(screen.getByTitle("Tech")).toBeInTheDocument();
    expect(screen.getByTitle("Other")).toBeInTheDocument();
  });

  it("renders goal name and target amount fields", async () => {
    renderWithProviders(<CreateSavingsGoalDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Goal"));

    expect(screen.getByLabelText("What are they saving for?")).toBeInTheDocument();
    expect(screen.getByLabelText("Target Amount (£)")).toBeInTheDocument();
  });

  it("renders submit button", async () => {
    renderWithProviders(<CreateSavingsGoalDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Goal"));

    expect(screen.getByText("Create Savings Goal")).toBeInTheDocument();
  });

  it("shows validation error for empty name on submit", async () => {
    renderWithProviders(<CreateSavingsGoalDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Goal"));

    fireEvent.click(screen.getByText("Create Savings Goal"));

    await waitFor(() => {
      expect(screen.getByText("Goal name is required")).toBeInTheDocument();
    });
  });

  it("shows validation error for missing target amount", async () => {
    renderWithProviders(<CreateSavingsGoalDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Goal"));

    const nameInput = screen.getByLabelText("What are they saving for?");
    await userEvent.type(nameInput, "New Trainers");

    fireEvent.click(screen.getByText("Create Savings Goal"));

    await waitFor(() => {
      expect(screen.getByText("Target amount must be at least £0.01")).toBeInTheDocument();
    });
  });

  it("shows preview when name and amount are filled", async () => {
    renderWithProviders(<CreateSavingsGoalDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Goal"));

    const nameInput = screen.getByLabelText("What are they saving for?");
    const amountInput = screen.getByLabelText("Target Amount (£)");

    await userEvent.type(nameInput, "Nintendo Switch");
    await userEvent.type(amountInput, "299");

    expect(screen.getByText("Preview")).toBeInTheDocument();
    expect(screen.getByText("Nintendo Switch")).toBeInTheDocument();
    expect(screen.getByText("Goal: £299.00")).toBeInTheDocument();
  });

  it("allows selecting different icons", async () => {
    renderWithProviders(<CreateSavingsGoalDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Goal"));

    const gamingIcon = screen.getByTitle("Gaming");
    fireEvent.click(gamingIcon);

    // The gaming icon button should now have the selected border style
    expect(gamingIcon.className).toContain("border-primary");
  });

  it("calls mutateAsync with correct data on valid submit", async () => {
    renderWithProviders(<CreateSavingsGoalDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Goal"));

    await userEvent.type(screen.getByLabelText("What are they saving for?"), "Bike");
    await userEvent.type(screen.getByLabelText("Target Amount (£)"), "50");

    fireEvent.click(screen.getByText("Create Savings Goal"));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        kid_id: "kid-1",
        name: "Bike",
        target_amount: 50,
        icon: "🎯",
        current_amount: 0,
        is_active: true,
      });
    });
  });
});
