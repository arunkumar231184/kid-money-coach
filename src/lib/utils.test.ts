import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional class names", () => {
    expect(cn("base", true && "active")).toBe("base active");
    expect(cn("base", false && "hidden")).toBe("base");
  });

  it("should merge tailwind classes correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("should handle arrays of class names", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("should handle undefined and null values", () => {
    expect(cn("base", undefined, null, "active")).toBe("base active");
  });

  it("should handle empty strings", () => {
    expect(cn("base", "", "active")).toBe("base active");
  });

  it("should handle objects with boolean values", () => {
    expect(cn({ active: true, disabled: false })).toBe("active");
  });
});
