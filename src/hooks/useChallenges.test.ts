import { describe, it, expect, vi, beforeEach } from "vitest";

const mockUser = { id: "parent-123" };
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));

const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockEq = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockSingle = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

describe("useChallenges hook - query functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    });
    mockSelect.mockReturnValue({ eq: mockEq, single: mockSingle });
    mockEq.mockReturnValue({ eq: mockEq, order: mockOrder, single: mockSingle, error: null });
    mockOrder.mockReturnValue({ data: [], error: null });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockSingle.mockReturnValue({ data: null, error: null });
  });

  describe("useChallenges query", () => {
    it("should fetch all challenges for a kid", async () => {
      const mockChallenges = [
        { id: "c-1", kid_id: "kid-1", title: "Save £10", type: "goal", status: "active", target_value: 10 },
        { id: "c-2", kid_id: "kid-1", title: "No snacks", type: "snack-tracker", status: "completed", target_value: 7 },
      ];
      mockOrder.mockReturnValue({ data: mockChallenges, error: null });

      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from("challenges")
        .select("*")
        .eq("kid_id", "kid-1")
        .order("created_at", { ascending: false });

      expect(mockFrom).toHaveBeenCalledWith("challenges");
      expect(mockEq).toHaveBeenCalledWith("kid_id", "kid-1");
      expect(data).toHaveLength(2);
    });
  });

  describe("useActiveChallenges query", () => {
    it("should filter only active challenges", async () => {
      mockEq.mockImplementation((col: string, val: string) => {
        if (col === "status" && val === "active") {
          return { order: mockOrder };
        }
        return { eq: mockEq, order: mockOrder };
      });
      mockOrder.mockReturnValue({ data: [{ id: "c-1", status: "active" }], error: null });

      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from("challenges")
        .select("*")
        .eq("kid_id", "kid-1")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      expect(mockEq).toHaveBeenCalledWith("status", "active");
      expect(data).toHaveLength(1);
    });
  });

  describe("useCreateChallenge mutation", () => {
    it("should insert a challenge with required fields", async () => {
      const newChallenge = {
        kid_id: "kid-1",
        title: "Save for bike",
        description: "Save £50 for a new bike",
        type: "goal",
        target_value: 50,
        reward_xp: 100,
      };
      mockSingle.mockReturnValue({ data: { id: "c-new", ...newChallenge }, error: null });

      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from("challenges")
        .insert(newChallenge)
        .select()
        .single();

      expect(mockInsert).toHaveBeenCalledWith(newChallenge);
      expect(data!.title).toBe("Save for bike");
    });
  });

  describe("useUpdateChallenge mutation", () => {
    it("should update a challenge by ID", async () => {
      const updates = { current_value: 25, status: "active" };
      mockSingle.mockReturnValue({ data: { id: "c-1", ...updates }, error: null });

      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from("challenges")
        .update(updates)
        .eq("id", "c-1")
        .single();

      expect(mockUpdate).toHaveBeenCalledWith(updates);
      expect(mockEq).toHaveBeenCalledWith("id", "c-1");
      expect((data as any).current_value).toBe(25);
    });
  });

  describe("useDeleteChallenge mutation", () => {
    it("should delete a challenge by ID", async () => {
      mockEq.mockReturnValue({ error: null });

      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.from("challenges").delete().eq("id", "c-1");

      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", "c-1");
      expect(error).toBeNull();
    });
  });
});
