import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HeistCard from "@/components/HeistCard";
import { Heist } from "@/types/firestore";

function createMockHeist(overrides?: Partial<Heist>): Heist {
  return {
    id: "test-id-123",
    createdAt: new Date(),
    title: "Test Heist",
    description: "Test description",
    createdBy: "user-123",
    createdByCodename: "MasterThief",
    assignedTo: "user-456",
    assignedToCodename: "ShadowNinja",
    deadline: new Date("2026-12-31"),
    finalStatus: null,
    ...overrides,
  };
}

describe("HeistCard", () => {
  it("renders heist title as a link with correct href", () => {
    const mockHeist = createMockHeist();
    render(<HeistCard heist={mockHeist} variant="active" />);

    const link = screen.getByRole("link", { name: mockHeist.title });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", `/heists/${mockHeist.id}`);
  });

  it("displays heist description", () => {
    const mockHeist = createMockHeist({ description: "Test description" });
    render(<HeistCard heist={mockHeist} variant="active" />);

    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("displays fallback when description is empty", () => {
    const mockHeist = createMockHeist({ description: "" });
    render(<HeistCard heist={mockHeist} variant="active" />);

    expect(screen.getByText("(No description)")).toBeInTheDocument();
  });

  it("renders creator codename", () => {
    const mockHeist = createMockHeist({ createdByCodename: "MasterThief" });
    render(<HeistCard heist={mockHeist} variant="active" />);

    expect(screen.getByText("MasterThief")).toBeInTheDocument();
    expect(screen.getByText("By:")).toBeInTheDocument();
  });

  it("renders assignee codename", () => {
    const mockHeist = createMockHeist({ assignedToCodename: "ShadowNinja" });
    render(<HeistCard heist={mockHeist} variant="active" />);

    expect(screen.getByText("ShadowNinja")).toBeInTheDocument();
    expect(screen.getByText("To:")).toBeInTheDocument();
  });

  it("displays hours left until deadline", () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 24); // 24 hours from now
    const mockHeist = createMockHeist({ deadline: futureDate });
    render(<HeistCard heist={mockHeist} variant="active" />);

    expect(screen.getByText(/h left/i)).toBeInTheDocument();
  });

  it("displays expired when deadline has passed", () => {
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 1); // 1 hour ago
    const mockHeist = createMockHeist({ deadline: pastDate });
    render(<HeistCard heist={mockHeist} variant="active" />);

    expect(screen.getByText("Expired")).toBeInTheDocument();
  });

  it("renders formatted deadline", () => {
    const deadline = new Date("2026-03-15");
    const mockHeist = createMockHeist({ deadline });
    render(<HeistCard heist={mockHeist} variant="active" />);

    expect(screen.getByText(/Mar 15, 2026/i)).toBeInTheDocument();
  });

  it("renders success badge when finalStatus is success", () => {
    const mockHeist = createMockHeist({ finalStatus: "success" });
    render(<HeistCard heist={mockHeist} variant="active" />);

    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });

  it("renders failure badge when finalStatus is failure", () => {
    const mockHeist = createMockHeist({ finalStatus: "failure" });
    render(<HeistCard heist={mockHeist} variant="active" />);

    expect(screen.getByText(/failure/i)).toBeInTheDocument();
  });

  it("does not render status badge when finalStatus is null", () => {
    const mockHeist = createMockHeist({ finalStatus: null });
    render(<HeistCard heist={mockHeist} variant="active" />);

    expect(screen.queryByText(/success/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/failure/i)).not.toBeInTheDocument();
  });

  it("uses article element for semantic HTML", () => {
    const mockHeist = createMockHeist();
    const { container } = render(
      <HeistCard heist={mockHeist} variant="active" />
    );

    expect(container.querySelector("article")).toBeInTheDocument();
  });

  it("link is keyboard accessible", () => {
    const mockHeist = createMockHeist();
    render(<HeistCard heist={mockHeist} variant="active" />);

    const link = screen.getByRole("link", { name: mockHeist.title });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
  });
});
