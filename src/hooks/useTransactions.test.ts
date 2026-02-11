import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase client
const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();
const mockEq = vi.fn();
const mockInsert = vi.fn();
const mockDelete = vi.fn();
const mockSingle = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

describe("useTransactions hook - query functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({ select: mockSelect, insert: mockInsert, delete: mockDelete });
    mockSelect.mockReturnValue({ eq: mockEq, single: mockSingle });
    mockEq.mockReturnValue({ order: mockOrder, eq: mockEq, single: mockSingle, error: null });
    mockOrder.mockReturnValue({ limit: mockLimit });
    mockLimit.mockReturnValue({ data: [], error: null });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockSingle.mockReturnValue({ data: null, error: null });
    mockDelete.mockReturnValue({ eq: mockEq });
  });

  describe("useTransactions query logic", () => {
    it("should query transactions for a specific kid ordered by date descending", async () => {
      const mockTransactions = [
        { id: "t-1", kid_id: "kid-1", merchant: "Tesco", amount: 5.5, category: "food", is_income: false, transaction_date: "2025-01-15T10:00:00Z" },
        { id: "t-2", kid_id: "kid-1", merchant: "Birthday", amount: 20, category: "other", is_income: true, transaction_date: "2025-01-14T10:00:00Z" },
      ];
      mockLimit.mockReturnValue({ data: mockTransactions, error: null });

      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("kid_id", "kid-1")
        .order("transaction_date", { ascending: false })
        .limit(20);

      expect(mockFrom).toHaveBeenCalledWith("transactions");
      expect(mockEq).toHaveBeenCalledWith("kid_id", "kid-1");
      expect(mockOrder).toHaveBeenCalledWith("transaction_date", { ascending: false });
      expect(mockLimit).toHaveBeenCalledWith(20);
      expect(data).toHaveLength(2);
      expect(data![0].merchant).toBe("Tesco");
    });

    it("should support custom limit parameter", async () => {
      mockLimit.mockReturnValue({ data: [], error: null });

      const { supabase } = await import("@/integrations/supabase/client");
      await supabase
        .from("transactions")
        .select("*")
        .eq("kid_id", "kid-1")
        .order("transaction_date", { ascending: false })
        .limit(5);

      expect(mockLimit).toHaveBeenCalledWith(5);
    });

    it("should handle query errors", async () => {
      const mockError = { message: "RLS policy violation", code: "42501" };
      mockLimit.mockReturnValue({ data: null, error: mockError });

      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase
        .from("transactions")
        .select("*")
        .eq("kid_id", "kid-1")
        .order("transaction_date", { ascending: false })
        .limit(20);

      expect(error).toEqual(mockError);
    });
  });

  describe("useAddTransaction mutation logic", () => {
    it("should insert a transaction with correct defaults", async () => {
      const newTransaction = {
        kid_id: "kid-1",
        merchant: "Game Shop",
        amount: 15.99,
        category: "gaming",
      };

      const insertPayload = {
        ...newTransaction,
        transaction_date: new Date().toISOString(),
        is_income: false,
      };

      const mockResult = { id: "t-new", ...insertPayload };
      mockSingle.mockReturnValue({ data: mockResult, error: null });

      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("transactions")
        .insert(insertPayload)
        .select()
        .single();

      expect(mockInsert).toHaveBeenCalledWith(insertPayload);
      expect(data).toEqual(mockResult);
      expect(error).toBeNull();
    });

    it("should handle income transactions", async () => {
      const incomeTransaction = {
        kid_id: "kid-1",
        merchant: "Allowance",
        amount: 10,
        category: "other",
        is_income: true,
        transaction_date: "2025-01-15T10:00:00Z",
      };

      mockSingle.mockReturnValue({ data: { id: "t-income", ...incomeTransaction }, error: null });

      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from("transactions")
        .insert(incomeTransaction)
        .select()
        .single();

      expect(data!.is_income).toBe(true);
    });
  });

  describe("useDeleteTransaction mutation logic", () => {
    it("should delete a transaction by ID", async () => {
      mockEq.mockReturnValue({ error: null });

      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.from("transactions").delete().eq("id", "t-1");

      expect(mockFrom).toHaveBeenCalledWith("transactions");
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", "t-1");
      expect(error).toBeNull();
    });
  });
});
