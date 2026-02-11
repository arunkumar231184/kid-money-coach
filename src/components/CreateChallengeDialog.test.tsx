import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateChallengeDialog } from "./CreateChallengeDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Kid } from "@/hooks/useKids";

// Mock dependencies
const mockUser = { id: "parent-123" };
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));

const mockMutateAsync = vi.fn();
vi.mock("@/hooks/useChallenges", () => ({
  useCreateChallenge: () => ({
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

describe("CreateChallengeDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMutateAsync.mockResolvedValue({});
  });

  it("renders the default trigger button", () => {
    renderWithProviders(<CreateChallengeDialog kid={mockKid} />);
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("renders custom trigger when provided", () => {
    renderWithProviders(
      <CreateChallengeDialog kid={mockKid} trigger={<button>Custom Trigger</button>} />
    );
    expect(screen.getByText("Custom Trigger")).toBeInTheDocument();
  });

  it("opens dialog showing template selection step", async () => {
    renderWithProviders(<CreateChallengeDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Add"));

    expect(screen.getByText("Choose a Challenge")).toBeInTheDocument();
    expect(screen.getByText(`Pick a challenge template for ${mockKid.name}`)).toBeInTheDocument();
  });

  it("shows all 5 challenge templates", async () => {
    renderWithProviders(<CreateChallengeDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Add"));

    expect(screen.getByText("Snack Tracker")).toBeInTheDocument();
    expect(screen.getByText("Save 50%")).toBeInTheDocument();
    expect(screen.getByText("No Impulse Buys")).toBeInTheDocument();
    expect(screen.getByText("Round-Ups")).toBeInTheDocument();
    expect(screen.getByText("Savings Goal")).toBeInTheDocument();
  });

  it("shows XP rewards on templates", async () => {
    renderWithProviders(<CreateChallengeDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Add"));

    expect(screen.getByText("+50 XP")).toBeInTheDocument();
    expect(screen.getByText("+75 XP")).toBeInTheDocument();
    expect(screen.getByText("+60 XP")).toBeInTheDocument();
    expect(screen.getByText("+40 XP")).toBeInTheDocument();
    expect(screen.getByText("+100 XP")).toBeInTheDocument();
  });

  it("navigates to customize step when template is clicked", async () => {
    renderWithProviders(<CreateChallengeDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Snack Tracker"));

    expect(screen.getByText("Customize Challenge")).toBeInTheDocument();
    expect(screen.getByLabelText("Challenge Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description (optional)")).toBeInTheDocument();
  });

  it("pre-fills form with snack tracker template values", async () => {
    renderWithProviders(<CreateChallengeDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Snack Tracker"));

    const titleInput = screen.getByLabelText("Challenge Title") as HTMLInputElement;
    expect(titleInput.value).toBe("Snack Budget £10");
  });

  it("shows Cancel and Create Challenge buttons in customize step", async () => {
    renderWithProviders(<CreateChallengeDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Snack Tracker"));

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Create Challenge")).toBeInTheDocument();
  });

  it("shows back button in customize step", async () => {
    renderWithProviders(<CreateChallengeDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Snack Tracker"));

    // Back button exists (ArrowLeft icon button)
    const backButton = screen.getByRole("button", { name: "" });
    expect(backButton).toBeInTheDocument();
  });

  it("renders duration field with label", async () => {
    renderWithProviders(<CreateChallengeDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Snack Tracker"));

    expect(screen.getByLabelText("Duration (days)")).toBeInTheDocument();
  });
});
