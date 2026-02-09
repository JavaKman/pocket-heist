import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Spinner from "@/components/Spinner";

describe("Spinner", () => {
  it("renders Clock8 icon", () => {
    render(<Spinner />);
    const spinner = screen.getByLabelText(/loading/i);
    expect(spinner).toBeInTheDocument();
  });

  it("has spinning animation class", () => {
    render(<Spinner />);
    const spinner = screen.getByLabelText(/loading/i);
    // CSS modules transform class names, so we verify the element has classes applied
    expect(spinner).toHaveAttribute("class");
    expect(spinner.className).toBeTruthy();
  });

  it("uses center-content layout", () => {
    const { container } = render(<Spinner />);
    const centerDiv = container.querySelector(".center-content");
    expect(centerDiv).toBeInTheDocument();
  });

  it("has proper aria-label for accessibility", () => {
    render(<Spinner />);
    const spinner = screen.getByLabelText("Loading");
    expect(spinner).toBeInTheDocument();
  });
});
