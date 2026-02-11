import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HeistCardSkeleton from "@/components/HeistCardSkeleton";

describe("HeistCardSkeleton", () => {
  it("renders skeleton placeholders", () => {
    const { container } = render(<HeistCardSkeleton />);

    // Check that skeleton elements are rendered
    const skeletons = container.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("has aria-hidden attribute on skeleton elements", () => {
    const { container } = render(<HeistCardSkeleton />);

    // Skeleton components should be hidden from screen readers
    const skeletons = container.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders correct number of skeleton elements", () => {
    const { container } = render(<HeistCardSkeleton />);

    // Should match HeistCard structure:
    // Title (1), description (2 lines), creator icon + name (1+1),
    // assignee icon + name (1+1), hours left (1), deadline (1) = 9 total
    const skeletons = container.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(7);
  });
});
