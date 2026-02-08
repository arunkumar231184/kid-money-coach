import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import { ChallengeCard, ChallengeType, ChallengeStatus } from "./ChallengeCard";

// Mock the confetti function
vi.mock("@/lib/confetti", () => ({
  celebrateChallengeComplete: vi.fn(),
}));

describe("ChallengeCard", () => {
  const defaultProps = {
    type: "snack-tracker" as ChallengeType,
    title: "Track Snacks",
    description: "Track your snack spending for a week",
    progress: 3,
    target: 7,
    status: "active" as ChallengeStatus,
    daysLeft: 4,
  };

  it("renders title correctly", () => {
    render(<ChallengeCard {...defaultProps} />);
    expect(screen.getByText("Track Snacks")).toBeInTheDocument();
  });

  it("renders description correctly", () => {
    render(<ChallengeCard {...defaultProps} />);
    expect(screen.getByText("Track your snack spending for a week")).toBeInTheDocument();
  });

  it("displays progress correctly", () => {
    render(<ChallengeCard {...defaultProps} progress={5} target={10} />);
    expect(screen.getByText("5/10")).toBeInTheDocument();
  });

  it("shows days left for active challenges", () => {
    render(<ChallengeCard {...defaultProps} status="active" daysLeft={3} />);
    expect(screen.getByText("3d left")).toBeInTheDocument();
  });

  it("does not show days left for completed challenges", () => {
    render(<ChallengeCard {...defaultProps} status="completed" daysLeft={0} />);
    expect(screen.queryByText(/d left/)).not.toBeInTheDocument();
  });

  it("shows trophy emoji for completed challenges", () => {
    render(<ChallengeCard {...defaultProps} status="completed" />);
    expect(screen.getByText("🏆")).toBeInTheDocument();
  });

  it("does not show trophy emoji for active challenges", () => {
    render(<ChallengeCard {...defaultProps} status="active" />);
    expect(screen.queryByText("🏆")).not.toBeInTheDocument();
  });

  it("shows Mark Complete button for active challenges with onMarkComplete", () => {
    const onMarkComplete = vi.fn();
    render(<ChallengeCard {...defaultProps} status="active" onMarkComplete={onMarkComplete} />);
    expect(screen.getByText("Mark Complete")).toBeInTheDocument();
  });

  it("does not show Mark Complete button for completed challenges", () => {
    const onMarkComplete = vi.fn();
    render(<ChallengeCard {...defaultProps} status="completed" onMarkComplete={onMarkComplete} />);
    expect(screen.queryByText("Mark Complete")).not.toBeInTheDocument();
  });

  it("does not show Mark Complete button without onMarkComplete callback", () => {
    render(<ChallengeCard {...defaultProps} status="active" />);
    expect(screen.queryByText("Mark Complete")).not.toBeInTheDocument();
  });

  it("calls onMarkComplete when Mark Complete button is clicked", async () => {
    const onMarkComplete = vi.fn();
    render(<ChallengeCard {...defaultProps} status="active" onMarkComplete={onMarkComplete} />);
    
    const button = screen.getByText("Mark Complete");
    fireEvent.click(button);
    
    expect(onMarkComplete).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = render(<ChallengeCard {...defaultProps} className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("calculates percentage correctly", () => {
    const { container } = render(<ChallengeCard {...defaultProps} progress={50} target={100} />);
    const progressBar = container.querySelector('[style*="width: 50%"]');
    expect(progressBar).toBeInTheDocument();
  });

  it("caps percentage at 100%", () => {
    const { container } = render(<ChallengeCard {...defaultProps} progress={150} target={100} />);
    const progressBar = container.querySelector('[style*="width: 100%"]');
    expect(progressBar).toBeInTheDocument();
  });

  it("renders snack-tracker type correctly", () => {
    const { container } = render(<ChallengeCard {...defaultProps} type="snack-tracker" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders save-allowance type correctly", () => {
    const { container } = render(<ChallengeCard {...defaultProps} type="save-allowance" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders no-impulse type correctly", () => {
    const { container } = render(<ChallengeCard {...defaultProps} type="no-impulse" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders round-ups type correctly", () => {
    const { container } = render(<ChallengeCard {...defaultProps} type="round-ups" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders goal type correctly", () => {
    const { container } = render(<ChallengeCard {...defaultProps} type="goal" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("applies active status styling", () => {
    const { container } = render(<ChallengeCard {...defaultProps} status="active" />);
    expect(container.firstChild).toHaveClass("border-primary/20");
  });

  it("applies completed status styling", () => {
    const { container } = render(<ChallengeCard {...defaultProps} status="completed" />);
    expect(container.firstChild).toHaveClass("border-success/30");
  });

  it("applies upcoming status styling", () => {
    const { container } = render(<ChallengeCard {...defaultProps} status="upcoming" />);
    expect(container.firstChild).toHaveClass("opacity-70");
  });

  it("shows Progress label", () => {
    render(<ChallengeCard {...defaultProps} />);
    expect(screen.getByText("Progress")).toBeInTheDocument();
  });
});
