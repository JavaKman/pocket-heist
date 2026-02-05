import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Avatar from "@/components/Avatar"

describe("Avatar", () => {
  it("renders successfully", () => {
    render(<Avatar name="John Doe" />)
    const avatar = screen.getByText("JD")
    expect(avatar).toBeInTheDocument()
  })

  it("displays first letter for simple names", () => {
    render(<Avatar name="alice" />)
    expect(screen.getByText("A")).toBeInTheDocument()
  })

  it("displays first two uppercase letters for PascalCase names", () => {
    render(<Avatar name="JohnSmith" />)
    expect(screen.getByText("JS")).toBeInTheDocument()
  })

  it("handles names with multiple uppercase letters", () => {
    render(<Avatar name="Jane Doe" />)
    expect(screen.getByText("JD")).toBeInTheDocument()
  })
})
