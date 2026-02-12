import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddTransactionDialog } from "./AddTransactionDialog";
import { Kid } from "@/hooks/useKids";

// Mock dependencies
const mockMutateAsync = vi.fn();
vi.mock("@/hooks/useTransactions", () => ({
  useAddTransaction: () => ({
    mutateAsync: mockMutateAsync,
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

describe("AddTransactionDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the default trigger button", () => {
    render(<AddTransactionDialog kid={mockKid} />);
    expect(screen.getByText("Add Transaction")).toBeInTheDocument();
  });

  it("renders a custom trigger when provided", () => {
    render(
      <AddTransactionDialog kid={mockKid} trigger={<button>Custom</button>} />
    );
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("opens dialog and shows kid name in title", async () => {
    render(<AddTransactionDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Add Transaction"));

    expect(screen.getByText("Add Transaction for Emma")).toBeInTheDocument();
  });

  it("renders all form fields", async () => {
    render(<AddTransactionDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Add Transaction"));

    expect(screen.getByLabelText(/Where\/What/)).toBeInTheDocument();
    expect(screen.getByLabelText("Amount (£) *")).toBeInTheDocument();
    expect(screen.getByText("Category *")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Notes (optional)")).toBeInTheDocument();
  });

  it("defaults to spending mode", async () => {
    render(<AddTransactionDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Add Transaction"));

    expect(screen.getByText("🛒 This is spending")).toBeInTheDocument();
    expect(screen.getByText("Money spent on something")).toBeInTheDocument();
  });

  it("toggles to income mode when switch is clicked", async () => {
    render(<AddTransactionDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Add Transaction"));

    const toggle = screen.getByRole("switch");
    fireEvent.click(toggle);

    expect(screen.getByText("💰 This is income")).toBeInTheDocument();
    expect(screen.getByText("Money received (allowance, gift, etc.)")).toBeInTheDocument();
    expect(screen.getByLabelText("Source *")).toBeInTheDocument();
  });

  it("shows submit button text matching mode", async () => {
    render(<AddTransactionDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Add Transaction"));

    // In spending mode
    expect(screen.getByRole("button", { name: /Add Transaction/i })).toBeInTheDocument();

    // Switch to income
    fireEvent.click(screen.getByRole("switch"));
    expect(screen.getByRole("button", { name: /Add Income/i })).toBeInTheDocument();
  });

  it("shows validation error for empty required fields", async () => {
    const { toast } = await import("sonner");
    render(<AddTransactionDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Add Transaction"));

    // The form uses native HTML required + custom validation via onSubmit
    // We need to fill merchant but leave category empty to trigger the custom check
    const merchantInput = screen.getByLabelText(/Where\/What/);
    await userEvent.type(merchantInput, "Test Store");
    const amountInput = screen.getByLabelText("Amount (£) *");
    await userEvent.type(amountInput, "5");

    // Submit without category
    const submitBtn = screen.getByRole("button", { name: /Add Transaction$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please fill in all required fields");
    });
  });

  it("sets today's date as default", async () => {
    render(<AddTransactionDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Add Transaction"));

    const dateInput = screen.getByLabelText("Date") as HTMLInputElement;
    const today = new Date().toISOString().split("T")[0];
    expect(dateInput.value).toBe(today);
  });

  it("renders all category options in the select", async () => {
    render(<AddTransactionDialog kid={mockKid} />);
    fireEvent.click(screen.getByText("Add Transaction"));

    // Open the category select
    fireEvent.click(screen.getByText("Select a category"));

    const expectedCategories = [
      "Food & Snacks", "Gaming", "Entertainment", "Shopping",
      "Transport", "Subscriptions", "Savings", "Allowance", "Gift", "Other",
    ];
    for (const cat of expectedCategories) {
      const matches = screen.getAllByText(cat);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    }
  });
});
