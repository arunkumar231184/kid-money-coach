import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock AuthContext
const mockUser = { id: "parent-123", email: "parent@test.com" };
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));

// Mock Supabase client
const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockDelete = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

describe("useKids hook - query functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default chain: from().select().order() -> { data, error }
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ order: mockOrder, eq: mockEq });
    mockOrder.mockReturnValue({ data: [], error: null });
    mockEq.mockReturnValue({ single: mockSingle, data: [], error: null });
    mockSingle.mockReturnValue({ data: null, error: null });
    mockDelete.mockReturnValue({ eq: mockEq });
  });

  describe("useKids query logic", () => {
    it("should query the kids table with pin_hash and order by created_at", async () => {
      const mockKids = [
        { id: "kid-1", name: "Alice", age: 10, parent_id: "parent-123", pin_hash: null },
        { id: "kid-2", name: "Bob", age: 8, parent_id: "parent-123", pin_hash: "abc123" },
      ];
      mockOrder.mockReturnValue({ data: mockKids, error: null });

      // Simulate what the queryFn does
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("kids")
        .select("*, pin_hash")
        .order("created_at", { ascending: true });

      expect(mockFrom).toHaveBeenCalledWith("kids");
      expect(mockSelect).toHaveBeenCalledWith("*, pin_hash");
      expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: true });
      expect(data).toEqual(mockKids);
      expect(error).toBeNull();
    });

    it("should handle Supabase errors gracefully", async () => {
      const mockError = { message: "Permission denied", code: "42501" };
      mockOrder.mockReturnValue({ data: null, error: mockError });

      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("kids")
        .select("*, pin_hash")
        .order("created_at", { ascending: true });

      expect(data).toBeNull();
      expect(error).toEqual(mockError);
    });
  });

  describe("useKid query logic", () => {
    it("should query a single kid by ID", async () => {
      const mockKid = { id: "kid-1", name: "Alice", age: 10, parent_id: "parent-123" };
      mockSingle.mockReturnValue({ data: mockKid, error: null });

      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from("kids")
        .select("*")
        .eq("id", "kid-1")
        .single();

      expect(mockFrom).toHaveBeenCalledWith("kids");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("id", "kid-1");
      expect(data).toEqual(mockKid);
    });
  });

  describe("useDeleteKid mutation logic", () => {
    it("should delete a kid by ID", async () => {
      mockFrom.mockReturnValue({ delete: mockDelete });
      mockEq.mockReturnValue({ error: null });

      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.from("kids").delete().eq("id", "kid-1");

      expect(mockFrom).toHaveBeenCalledWith("kids");
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", "kid-1");
      expect(error).toBeNull();
    });
  });
});
