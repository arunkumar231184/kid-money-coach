import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SpendingLimitsDialog } from "./SpendingLimitsDialog";
import { Kid } from "@/hooks/useKids";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock data
const mockLimits = [
  {
    id: "limit-1",
    kid_id: "kid-1",
    category: "snacks",
    limit_amount: 15,
    period: "weekly",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockCreateMutateAsync = vi.fn();
const mockDeleteMutateAsync = vi.fn();

vi.mock("@/hooks/useSpendingLimits", () => ({
  useSpendingLimits: () => ({
    data: mockLimits,
    isLoading: false,
  }),
  useCreateSpendingLimit: () => ({
    mutateAsync: mockCreateMutateAsync,
    isPending: false,
  }),
  useDeleteSpendingLimit: () => ({
    mutateAsync: mockDeleteMutateAsync,
    isPending: false,
  }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockKid: Kid = {
  id: "kid-1",
  name: "Emma",
  age: 10,
  parent_id: "parent-1",
  allowance_amount: 10,
  allowance_frequency: "weekly",
  avatar_url: null,
  bank_account_connected: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  current_streak: 0,
  level: 1,
  total_badges: 0,
  total_saved: 0,
  xp_points: 0,
  pin_hash: null,
};

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("SpendingLimitsDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the default trigger button", () => {
    renderWithProviders(<SpendingLimitsDialog kid={mockKid} />);
    expect(screen.getByText("Set Limits")).toBeInTheDocument();
  });

  it("renders a custom trigger when provided", () => {
    renderWithProviders(
      <SpendingLimitsDialog kid={mockKid} trigger={<button>Custom Trigger</button>} />
    );
    expect(screen.getByText("Custom Trigger")).toBeInTheDocument();
  });

  it("opens dialog and shows kid name in title", async () => {
    renderWithProviders(<SpendingLimitsDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Limits"));

    expect(screen.getByText("Spending Limits for Emma")).toBeInTheDocument();
  });

  it("shows description text", async () => {
    renderWithProviders(<SpendingLimitsDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Limits"));

    expect(screen.getByText(/Set category limits to get alerts/)).toBeInTheDocument();
  });

  it("renders the add limit form with category, period, and amount", async () => {
    renderWithProviders(<SpendingLimitsDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Limits"));

    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Period")).toBeInTheDocument();
    expect(screen.getByText("Limit Amount (£)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add/i })).toBeInTheDocument();
  });

  it("displays existing limits", async () => {
    renderWithProviders(<SpendingLimitsDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Limits"));

    expect(screen.getByText("Active Limits")).toBeInTheDocument();
    expect(screen.getByText("£15.00")).toBeInTheDocument();
    expect(screen.getByText("/ weekly")).toBeInTheDocument();
    expect(screen.getByText("🍿 Snacks")).toBeInTheDocument();
  });

  it("shows validation error when adding without category or amount", async () => {
    const { toast } = await import("sonner");
    renderWithProviders(<SpendingLimitsDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Limits"));

    fireEvent.click(screen.getByRole("button", { name: /Add/i }));

    expect(toast.error).toHaveBeenCalledWith(
      "Please select a category and enter a valid amount"
    );
  });

  it("calls delete mutation when trash icon is clicked", async () => {
    renderWithProviders(<SpendingLimitsDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Limits"));

    // Find and click the delete button (trash icon)
    const deleteButtons = screen.getAllByRole("button").filter(
      (btn) => btn.querySelector(".lucide-trash-2") || btn.classList.contains("text-destructive")
    );
    expect(deleteButtons.length).toBeGreaterThan(0);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteMutateAsync).toHaveBeenCalledWith("limit-1");
    });
  });

  it("renders all category options in select", async () => {
    renderWithProviders(<SpendingLimitsDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Limits"));

    // Open the category select
    const selects = screen.getAllByText("Select...");
    fireEvent.click(selects[0]);

    const expectedCategories = [
      "🍿 Snacks", "🎮 Gaming", "👕 Fashion",
      "🚌 Transport", "🎬 Entertainment", "📦 Other",
    ];
    for (const cat of expectedCategories) {
      const matches = screen.getAllByText(cat);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders period options in select", async () => {
    renderWithProviders(<SpendingLimitsDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Set Limits"));

    // The default period "Weekly" should be visible
    expect(screen.getByText("Weekly")).toBeInTheDocument();
  });
});
