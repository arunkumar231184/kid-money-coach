import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSpendingInsights } from "./useSpendingInsights";
import type { Transaction } from "./useTransactions";

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "t-" + Math.random().toString(36).slice(2, 6),
    kid_id: "kid-1",
    merchant: "Test Shop",
    amount: 10,
    category: "food",
    description: null,
    transaction_date: new Date().toISOString(),
    is_income: false,
    external_id: null,
    bank_connection_id: null,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

describe("useSpendingInsights", () => {
  it("should return empty data for no transactions", () => {
    const { result } = renderHook(() => useSpendingInsights([]));

    expect(result.current.categoryBreakdown).toEqual([]);
    expect(result.current.insights).toEqual([]);
    expect(result.current.topMerchants).toEqual([]);
    expect(result.current.weeklyStats.totalSpent).toBe(0);
    expect(result.current.monthlyStats.totalSpent).toBe(0);
  });

  it("should calculate monthly category breakdown correctly", () => {
    const transactions = [
      makeTransaction({ amount: 5, category: "food", merchant: "McDonalds" }),
      makeTransaction({ amount: 15, category: "gaming", merchant: "Steam" }),
      makeTransaction({ amount: 10, category: "food", merchant: "Tesco" }),
    ];

    const { result } = renderHook(() => useSpendingInsights(transactions));

    const snacksCategory = result.current.categoryBreakdown.find(c => c.category === "snacks");
    const gamingCategory = result.current.categoryBreakdown.find(c => c.category === "gaming");

    expect(snacksCategory).toBeDefined();
    expect(snacksCategory!.amount).toBe(15); // 5 + 10
    expect(snacksCategory!.count).toBe(2);

    expect(gamingCategory).toBeDefined();
    expect(gamingCategory!.amount).toBe(15);
    expect(gamingCategory!.count).toBe(1);
  });

  it("should calculate percentage breakdown correctly", () => {
    const transactions = [
      makeTransaction({ amount: 75, category: "gaming" }),
      makeTransaction({ amount: 25, category: "fashion" }),
    ];

    const { result } = renderHook(() => useSpendingInsights(transactions));

    const gaming = result.current.categoryBreakdown.find(c => c.category === "gaming");
    const fashion = result.current.categoryBreakdown.find(c => c.category === "fashion");

    expect(gaming!.percentage).toBe(75);
    expect(fashion!.percentage).toBe(25);
  });

  it("should sort category breakdown by amount descending", () => {
    const transactions = [
      makeTransaction({ amount: 5, category: "transport" }),
      makeTransaction({ amount: 20, category: "gaming" }),
      makeTransaction({ amount: 10, category: "fashion" }),
    ];

    const { result } = renderHook(() => useSpendingInsights(transactions));

    expect(result.current.categoryBreakdown[0].category).toBe("gaming");
    expect(result.current.categoryBreakdown[1].category).toBe("fashion");
    expect(result.current.categoryBreakdown[2].category).toBe("transport");
  });

  it("should exclude income from category breakdown", () => {
    const transactions = [
      makeTransaction({ amount: 50, category: "other", is_income: true }),
      makeTransaction({ amount: 10, category: "food" }),
    ];

    const { result } = renderHook(() => useSpendingInsights(transactions));

    // Only food/snacks should appear, income excluded
    expect(result.current.categoryBreakdown).toHaveLength(1);
    expect(result.current.categoryBreakdown[0].category).toBe("snacks");
  });

  it("should calculate weekly stats separating income and expenses", () => {
    const transactions = [
      makeTransaction({ amount: 30, is_income: false }),
      makeTransaction({ amount: 50, is_income: true }),
    ];

    const { result } = renderHook(() => useSpendingInsights(transactions));

    expect(result.current.weeklyStats.totalSpent).toBe(30);
    expect(result.current.weeklyStats.totalIncome).toBe(50);
    expect(result.current.weeklyStats.netFlow).toBe(20);
  });

  it("should calculate savings rate as percentage of income", () => {
    const transactions = [
      makeTransaction({ amount: 20, is_income: false }),
      makeTransaction({ amount: 100, is_income: true }),
    ];

    const { result } = renderHook(() => useSpendingInsights(transactions));

    expect(result.current.weeklyStats.savingsRate).toBe(80);
  });

  it("should identify top merchants sorted by spending", () => {
    const transactions = [
      makeTransaction({ amount: 5, merchant: "Tesco" }),
      makeTransaction({ amount: 20, merchant: "Steam" }),
      makeTransaction({ amount: 15, merchant: "Tesco" }),
      makeTransaction({ amount: 8, merchant: "H&M" }),
    ];

    const { result } = renderHook(() => useSpendingInsights(transactions));

    expect(result.current.topMerchants[0].merchant).toBe("Tesco");
    expect(result.current.topMerchants[0].amount).toBe(20); // 5 + 15
    expect(result.current.topMerchants[0].count).toBe(2);
    expect(result.current.topMerchants[1].merchant).toBe("Steam");
  });

  it("should limit top merchants to 5", () => {
    const merchants = ["A", "B", "C", "D", "E", "F", "G"];
    const transactions = merchants.map(m =>
      makeTransaction({ merchant: m, amount: 10 })
    );

    const { result } = renderHook(() => useSpendingInsights(transactions));
    expect(result.current.topMerchants).toHaveLength(5);
  });

  it("should map food category to snacks", () => {
    const transactions = [makeTransaction({ category: "food" })];
    const { result } = renderHook(() => useSpendingInsights(transactions));
    expect(result.current.categoryBreakdown[0].category).toBe("snacks");
    expect(result.current.categoryBreakdown[0].label).toBe("Snacks");
  });

  it("should map unknown categories to other", () => {
    const transactions = [makeTransaction({ category: "cryptocurrency" })];
    const { result } = renderHook(() => useSpendingInsights(transactions));
    expect(result.current.categoryBreakdown[0].category).toBe("other");
  });

  it("should generate top category insight when spending exists", () => {
    const transactions = [
      makeTransaction({ amount: 30, category: "gaming" }),
      makeTransaction({ amount: 10, category: "food" }),
    ];

    const { result } = renderHook(() => useSpendingInsights(transactions));

    const topCatInsight = result.current.insights.find(i => i.type === "top_category");
    expect(topCatInsight).toBeDefined();
    expect(topCatInsight!.title).toContain("Top Category");
    expect(topCatInsight!.message).toContain("Gaming");
    expect(topCatInsight!.message).toContain("75%");
  });

  it("should generate savings rate insight for super savers", () => {
    const transactions = [
      makeTransaction({ amount: 10, is_income: false }),
      makeTransaction({ amount: 100, is_income: true }),
    ];

    const { result } = renderHook(() => useSpendingInsights(transactions));

    const savingsInsight = result.current.insights.find(i => i.type === "savings_rate");
    expect(savingsInsight).toBeDefined();
    expect(savingsInsight!.title).toContain("Super Saver");
    expect(savingsInsight!.trend).toBe("up");
  });

  it("should handle zero average transaction when no spending", () => {
    const transactions = [
      makeTransaction({ amount: 50, is_income: true }),
    ];

    const { result } = renderHook(() => useSpendingInsights(transactions));
    expect(result.current.weeklyStats.averageTransaction).toBe(0);
  });
});
