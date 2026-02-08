import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { AchievementBadge } from "./AchievementBadge";

describe("AchievementBadge", () => {
  it("renders saver badge with correct label", () => {
    render(<AchievementBadge type="saver" />);
    expect(screen.getByText("Super Saver")).toBeInTheDocument();
    expect(screen.getByText("Saved 50%+ of allowance")).toBeInTheDocument();
  });

  it("renders streak badge with correct label", () => {
    render(<AchievementBadge type="streak" />);
    expect(screen.getByText("On Fire")).toBeInTheDocument();
    expect(screen.getByText("3-day saving streak")).toBeInTheDocument();
  });

  it("renders goal badge with correct label", () => {
    render(<AchievementBadge type="goal" />);
    expect(screen.getByText("Goal Getter")).toBeInTheDocument();
    expect(screen.getByText("Reached a savings goal")).toBeInTheDocument();
  });

  it("renders first-week badge with correct label", () => {
    render(<AchievementBadge type="first-week" />);
    expect(screen.getByText("First Week")).toBeInTheDocument();
    expect(screen.getByText("Completed first week")).toBeInTheDocument();
  });

  it("renders challenge-master badge with correct label", () => {
    render(<AchievementBadge type="challenge-master" />);
    expect(screen.getByText("Champion")).toBeInTheDocument();
    expect(screen.getByText("Completed 5 challenges")).toBeInTheDocument();
  });

  it("shows earned state by default", () => {
    const { container } = render(<AchievementBadge type="saver" />);
    expect(container.firstChild).not.toHaveClass("opacity-40");
    expect(container.firstChild).not.toHaveClass("grayscale");
  });

  it("shows unearned state when earned is false", () => {
    const { container } = render(<AchievementBadge type="saver" earned={false} />);
    expect(container.firstChild).toHaveClass("opacity-40");
    expect(container.firstChild).toHaveClass("grayscale");
  });

  it("displays count badge when count is greater than 1", () => {
    render(<AchievementBadge type="saver" count={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("does not display count badge when count is 1", () => {
    render(<AchievementBadge type="saver" count={1} />);
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("does not display count badge when count is undefined", () => {
    const { container } = render(<AchievementBadge type="saver" />);
    const countBadge = container.querySelector(".absolute.-top-1.-right-1");
    expect(countBadge).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <AchievementBadge type="saver" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("has cursor-pointer when earned", () => {
    const { container } = render(<AchievementBadge type="saver" earned={true} />);
    expect(container.firstChild).toHaveClass("cursor-pointer");
  });

  it("does not have cursor-pointer when not earned", () => {
    const { container } = render(<AchievementBadge type="saver" earned={false} />);
    expect(container.firstChild).not.toHaveClass("cursor-pointer");
  });
});
