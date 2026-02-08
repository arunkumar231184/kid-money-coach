import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { CategoryBadge } from "./CategoryBadge";

describe("CategoryBadge", () => {
  it("renders snacks category with correct icon and label", () => {
    render(<CategoryBadge category="snacks" />);
    expect(screen.getByText("Snacks")).toBeInTheDocument();
    expect(screen.getByText("🍿")).toBeInTheDocument();
  });

  it("renders gaming category with correct icon and label", () => {
    render(<CategoryBadge category="gaming" />);
    expect(screen.getByText("Gaming")).toBeInTheDocument();
    expect(screen.getByText("🎮")).toBeInTheDocument();
  });

  it("renders fashion category with correct icon and label", () => {
    render(<CategoryBadge category="fashion" />);
    expect(screen.getByText("Fashion")).toBeInTheDocument();
    expect(screen.getByText("👕")).toBeInTheDocument();
  });

  it("renders transport category with correct icon and label", () => {
    render(<CategoryBadge category="transport" />);
    expect(screen.getByText("Transport")).toBeInTheDocument();
    expect(screen.getByText("🚌")).toBeInTheDocument();
  });

  it("renders savings category with correct icon and label", () => {
    render(<CategoryBadge category="savings" />);
    expect(screen.getByText("Savings")).toBeInTheDocument();
    expect(screen.getByText("💰")).toBeInTheDocument();
  });

  it("renders other category with correct icon and label", () => {
    render(<CategoryBadge category="other" />);
    expect(screen.getByText("Other")).toBeInTheDocument();
    expect(screen.getByText("📦")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CategoryBadge category="snacks" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("has correct base styling classes", () => {
    const { container } = render(<CategoryBadge category="snacks" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass("inline-flex");
    expect(badge).toHaveClass("items-center");
    expect(badge).toHaveClass("rounded-full");
  });
});
