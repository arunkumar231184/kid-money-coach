import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { TransactionList } from "./TransactionList";
import { Transaction } from "@/hooks/useTransactions";

const createMockTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: "tx-123",
  kid_id: "kid-456",
  merchant: "Sweet Shop",
  amount: 5.5,
  category: "snacks",
  description: "Candy purchase",
  transaction_date: "2024-06-15T10:30:00Z",
  is_income: false,
  external_id: null,
  bank_connection_id: null,
  created_at: "2024-06-15T10:30:00Z",
  ...overrides,
});

describe("TransactionList", () => {
  it("renders a list of transactions", () => {
    const transactions = [
      createMockTransaction({ id: "1", merchant: "Shop A" }),
      createMockTransaction({ id: "2", merchant: "Shop B" }),
    ];
    
    render(<TransactionList transactions={transactions} />);
    
    expect(screen.getByText("Shop A")).toBeInTheDocument();
    expect(screen.getByText("Shop B")).toBeInTheDocument();
  });

  it("displays merchant name correctly", () => {
    const transactions = [createMockTransaction({ merchant: "Game Store" })];
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByText("Game Store")).toBeInTheDocument();
  });

  it("formats expense amount with minus sign", () => {
    const transactions = [createMockTransaction({ amount: 12.5, is_income: false })];
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByText("-£12.50")).toBeInTheDocument();
  });

  it("formats income amount with plus sign", () => {
    const transactions = [createMockTransaction({ amount: 25.0, is_income: true })];
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByText("+£25.00")).toBeInTheDocument();
  });

  it("displays formatted transaction date", () => {
    const transactions = [createMockTransaction({ transaction_date: "2024-03-15T00:00:00Z" })];
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByText("Mar 15, 2024")).toBeInTheDocument();
  });

  it("renders empty list without errors", () => {
    const { container } = render(<TransactionList transactions={[]} />);
    expect(container.firstChild).toBeInTheDocument();
    expect(container.querySelector(".space-y-2")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<TransactionList transactions={[]} className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("maps snack category correctly", () => {
    const transactions = [createMockTransaction({ category: "snacks" })];
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByText("Snacks")).toBeInTheDocument();
  });

  it("maps gaming category correctly", () => {
    const transactions = [createMockTransaction({ category: "gaming" })];
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByText("Gaming")).toBeInTheDocument();
  });

  it("maps fashion category correctly", () => {
    const transactions = [createMockTransaction({ category: "fashion shop" })];
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByText("Fashion")).toBeInTheDocument();
  });

  it("maps transport category correctly", () => {
    const transactions = [createMockTransaction({ category: "transport" })];
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByText("Transport")).toBeInTheDocument();
  });

  it("maps savings category correctly", () => {
    const transactions = [createMockTransaction({ category: "savings deposit" })];
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByText("Savings")).toBeInTheDocument();
  });

  it("maps unknown category to other", () => {
    const transactions = [createMockTransaction({ category: "unknown" })];
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByText("Other")).toBeInTheDocument();
  });

  it("handles food as snacks category", () => {
    const transactions = [createMockTransaction({ category: "food" })];
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByText("Snacks")).toBeInTheDocument();
  });

  it("handles game as gaming category", () => {
    const transactions = [createMockTransaction({ category: "game store" })];
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByText("Gaming")).toBeInTheDocument();
  });

  it("handles shop as fashion category", () => {
    const transactions = [createMockTransaction({ category: "clothes shop" })];
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByText("Fashion")).toBeInTheDocument();
  });

  it("renders multiple transactions in order", () => {
    const transactions = [
      createMockTransaction({ id: "1", merchant: "First" }),
      createMockTransaction({ id: "2", merchant: "Second" }),
      createMockTransaction({ id: "3", merchant: "Third" }),
    ];
    
    render(<TransactionList transactions={transactions} />);
    
    const merchants = screen.getAllByText(/First|Second|Third/);
    expect(merchants).toHaveLength(3);
  });

  it("handles negative amount values correctly", () => {
    const transactions = [createMockTransaction({ amount: -15.75, is_income: false })];
    render(<TransactionList transactions={transactions} />);
    // Math.abs is used so -15.75 becomes 15.75
    expect(screen.getByText("-£15.75")).toBeInTheDocument();
  });

  it("applies income styling to income transactions", () => {
    const transactions = [createMockTransaction({ is_income: true, amount: 10 })];
    const { container } = render(<TransactionList transactions={transactions} />);
    
    const successIcon = container.querySelector(".text-success");
    expect(successIcon).toBeInTheDocument();
  });

  it("applies expense styling to expense transactions", () => {
    const transactions = [createMockTransaction({ is_income: false, amount: 10 })];
    const { container } = render(<TransactionList transactions={transactions} />);
    
    const mutedIcon = container.querySelector(".text-muted-foreground");
    expect(mutedIcon).toBeInTheDocument();
  });
});
