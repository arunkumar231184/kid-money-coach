import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddChildDialog } from "./AddChildDialog";

// Mock dependencies
const mockUser = { id: "parent-123", email: "parent@test.com" };
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({ error: null })),
    })),
  },
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("AddChildDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the trigger button with 'Add Child' text", () => {
    render(<AddChildDialog />);
    expect(screen.getByText("Add Child")).toBeInTheDocument();
  });

  it("opens the dialog when trigger button is clicked", async () => {
    render(<AddChildDialog />);
    fireEvent.click(screen.getByText("Add Child"));

    expect(screen.getByText("Add a Child")).toBeInTheDocument();
    expect(screen.getByText("Register your child to start tracking their spending and set up challenges.")).toBeInTheDocument();
  });

  it("renders all form fields when dialog is open", async () => {
    render(<AddChildDialog />);
    fireEvent.click(screen.getByText("Add Child"));

    expect(screen.getByLabelText("Child's Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Age")).toBeInTheDocument();
    expect(screen.getByLabelText("Allowance Amount (£)")).toBeInTheDocument();
    expect(screen.getByText("Allowance Frequency")).toBeInTheDocument();
  });

  it("has correct default values", async () => {
    render(<AddChildDialog />);
    fireEvent.click(screen.getByText("Add Child"));

    const ageInput = screen.getByLabelText("Age") as HTMLInputElement;
    const allowanceInput = screen.getByLabelText("Allowance Amount (£)") as HTMLInputElement;

    expect(ageInput.value).toBe("11");
    expect(allowanceInput.value).toBe("10");
  });

  it("renders Cancel and submit buttons", async () => {
    render(<AddChildDialog />);
    fireEvent.click(screen.getByText("Add Child"));

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    // The submit button also says "Add Child"
    const buttons = screen.getAllByText("Add Child");
    expect(buttons.length).toBeGreaterThanOrEqual(2); // trigger + submit
  });

  it("shows validation error for short name", async () => {
    render(<AddChildDialog />);
    fireEvent.click(screen.getByText("Add Child"));

    const nameInput = screen.getByLabelText("Child's Name");
    await userEvent.type(nameInput, "A");

    // Submit the form
    const submitButtons = screen.getAllByRole("button", { name: /add child/i });
    const submitBtn = submitButtons[submitButtons.length - 1];
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Name must be at least 2 characters")).toBeInTheDocument();
    });
  });

  it("closes dialog when Cancel is clicked", async () => {
    render(<AddChildDialog />);
    fireEvent.click(screen.getByText("Add Child"));

    expect(screen.getByText("Add a Child")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(screen.queryByText("Add a Child")).not.toBeInTheDocument();
    });
  });

  it("renders frequency select with Weekly as default", async () => {
    render(<AddChildDialog />);
    fireEvent.click(screen.getByText("Add Child"));

    const weeklyElements = screen.getAllByText("Weekly");
    expect(weeklyElements.length).toBeGreaterThanOrEqual(1);
  });
});
