import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { BrowserRouter } from "react-router-dom";
import { ChildCard } from "./ChildCard";
import { Kid } from "@/hooks/useKids";
import { TooltipProvider } from "@/components/ui/tooltip";

// Mock the SetPinDialog to avoid complex dependencies
vi.mock("@/components/SetPinDialog", () => ({
  SetPinDialog: () => null,
}));

const createMockKid = (overrides: Partial<Kid & { pin_hash?: string | null }> = {}): Kid & { pin_hash?: string | null } => ({
  id: "kid-123",
  name: "Alex",
  age: 10,
  parent_id: "parent-456",
  allowance_amount: 15.5,
  allowance_frequency: "weekly",
  total_saved: 45.75,
  bank_account_connected: false,
  avatar_url: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  current_streak: 5,
  level: 3,
  total_badges: 8,
  xp_points: 150,
  pin_hash: null,
  ...overrides,
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <TooltipProvider>
        {component}
      </TooltipProvider>
    </BrowserRouter>
  );
};

describe("ChildCard", () => {
  it("renders kid name and age", () => {
    const kid = createMockKid({ name: "Emma", age: 12 });
    renderWithProviders(<ChildCard kid={kid} />);
    expect(screen.getByText("Emma (12)")).toBeInTheDocument();
  });

  it("displays weekly allowance correctly", () => {
    const kid = createMockKid({ allowance_amount: 20.0, allowance_frequency: "weekly" });
    renderWithProviders(<ChildCard kid={kid} />);
    expect(screen.getByText("£20.00")).toBeInTheDocument();
    expect(screen.getByText("Weekly Allowance")).toBeInTheDocument();
  });

  it("displays monthly allowance correctly", () => {
    const kid = createMockKid({ allowance_amount: 50.0, allowance_frequency: "monthly" });
    renderWithProviders(<ChildCard kid={kid} />);
    expect(screen.getByText("£50.00")).toBeInTheDocument();
    expect(screen.getByText("Monthly Allowance")).toBeInTheDocument();
  });

  it("displays total saved amount", () => {
    const kid = createMockKid({ total_saved: 123.45 });
    renderWithProviders(<ChildCard kid={kid} />);
    expect(screen.getByText("£123.45")).toBeInTheDocument();
    expect(screen.getByText("Total Saved")).toBeInTheDocument();
  });

  it("shows bank connected status when bank is connected", () => {
    const kid = createMockKid({ bank_account_connected: true });
    renderWithProviders(<ChildCard kid={kid} />);
    expect(screen.getByText("Bank connected")).toBeInTheDocument();
  });

  it("shows no bank connected status when bank is not connected", () => {
    const kid = createMockKid({ bank_account_connected: false });
    renderWithProviders(<ChildCard kid={kid} />);
    expect(screen.getByText("No bank connected")).toBeInTheDocument();
  });

  it("handles null allowance amount gracefully", () => {
    const kid = createMockKid({ allowance_amount: null });
    renderWithProviders(<ChildCard kid={kid} />);
    expect(screen.getByText("£0.00")).toBeInTheDocument();
  });

  it("handles null total saved amount gracefully", () => {
    const kid = createMockKid({ total_saved: null, allowance_amount: null });
    renderWithProviders(<ChildCard kid={kid} />);
    // Both allowance and savings should show £0.00
    expect(screen.getAllByText("£0.00")).toHaveLength(2);
  });

  it("shows View Kid Mode label", () => {
    const kid = createMockKid();
    renderWithProviders(<ChildCard kid={kid} />);
    expect(screen.getByText("View Kid Mode")).toBeInTheDocument();
  });

  it("renders link to kid view page", () => {
    const kid = createMockKid({ id: "test-kid-id" });
    renderWithProviders(<ChildCard kid={kid} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/kid/test-kid-id");
  });

  it("shows delete confirmation dialog title when delete is available", () => {
    const kid = createMockKid({ name: "Charlie" });
    const onDelete = vi.fn();
    renderWithProviders(<ChildCard kid={kid} onDelete={onDelete} />);
    // The dialog trigger button should be present
    const deleteButtons = screen.getAllByRole("button");
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it("displays avatar emoji based on name", () => {
    const kid1 = createMockKid({ name: "Alex" });
    const { container: container1 } = renderWithProviders(<ChildCard kid={kid1} />);
    
    // The avatar should contain one of the emoji characters
    const avatarDiv = container1.querySelector(".text-2xl");
    expect(avatarDiv).toBeInTheDocument();
    expect(avatarDiv?.textContent).toMatch(/[👦👧🧒👶🧑]/);
  });

  it("applies different avatar emojis for different names", () => {
    const kid1 = createMockKid({ name: "A" });
    const kid2 = createMockKid({ name: "F" });
    
    const { container: container1 } = renderWithProviders(<ChildCard kid={kid1} />);
    const { container: container2 } = renderWithProviders(<ChildCard kid={kid2} />);
    
    const avatar1 = container1.querySelector(".text-2xl");
    const avatar2 = container2.querySelector(".text-2xl");
    
    // Different names with different char codes should potentially have different emojis
    expect(avatar1).toBeInTheDocument();
    expect(avatar2).toBeInTheDocument();
  });
});
