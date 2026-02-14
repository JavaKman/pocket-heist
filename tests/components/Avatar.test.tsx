import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Avatar from "@/components/Avatar"

describe("Avatar", () => {
  describe("initials mode", () => {
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

  describe("image mode", () => {
    it("renders an image when src is provided", () => {
      render(<Avatar src="https://example.com/avatar.jpg" alt="John Doe" />)
      const image = screen.getByRole("img")
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute("src", "https://example.com/avatar.jpg")
      expect(image).toHaveAttribute("alt", "John Doe")
    })

    it("uses default alt text when alt is not provided", () => {
      render(<Avatar src="https://example.com/avatar.jpg" />)
      const image = screen.getByRole("img")
      expect(image).toHaveAttribute("alt", "Avatar")
    })

    it("prefers src over name when both are provided", () => {
      render(<Avatar src="https://example.com/avatar.jpg" name="John Doe" alt="John" />)
      const image = screen.getByRole("img")
      expect(image).toBeInTheDocument()
      expect(screen.queryByText("JD")).not.toBeInTheDocument()
    })
  })
})
