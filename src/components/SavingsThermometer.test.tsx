import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { SavingsThermometer } from "./SavingsThermometer";

describe("SavingsThermometer", () => {
  it("renders label correctly", () => {
    render(<SavingsThermometer current={50} goal={100} label="Test Goal" />);
    expect(screen.getByText("Test Goal")).toBeInTheDocument();
  });

  it("displays current and goal amounts", () => {
    render(<SavingsThermometer current={25.5} goal={100} label="Goal" />);
    expect(screen.getByText("£25.50 / £100.00")).toBeInTheDocument();
  });

  it("calculates percentage correctly", () => {
    render(<SavingsThermometer current={50} goal={100} label="Goal" />);
    expect(screen.getByText("50% complete")).toBeInTheDocument();
  });

  it("shows 0% when current is 0", () => {
    render(<SavingsThermometer current={0} goal={100} label="Goal" />);
    expect(screen.getByText("0% complete")).toBeInTheDocument();
  });

  it("caps percentage at 100%", () => {
    render(<SavingsThermometer current={150} goal={100} label="Goal" />);
    expect(screen.getByText("100% complete")).toBeInTheDocument();
  });

  it("shows goal reached message when at 100%", () => {
    render(<SavingsThermometer current={100} goal={100} label="Goal" />);
    expect(screen.getByText("🎉 Goal reached!")).toBeInTheDocument();
  });

  it("shows goal reached message when exceeding 100%", () => {
    render(<SavingsThermometer current={150} goal={100} label="Goal" />);
    expect(screen.getByText("🎉 Goal reached!")).toBeInTheDocument();
  });

  it("does not show goal reached message when under 100%", () => {
    render(<SavingsThermometer current={99} goal={100} label="Goal" />);
    expect(screen.queryByText("🎉 Goal reached!")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <SavingsThermometer
        current={50}
        goal={100}
        label="Goal"
        className="custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("handles decimal percentages", () => {
    render(<SavingsThermometer current={33.33} goal={100} label="Goal" />);
    expect(screen.getByText("33% complete")).toBeInTheDocument();
  });

  it("formats currency with two decimal places", () => {
    render(<SavingsThermometer current={10} goal={50} label="Goal" />);
    expect(screen.getByText("£10.00 / £50.00")).toBeInTheDocument();
  });
});
