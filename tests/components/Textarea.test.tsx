import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import userEvent from "@testing-library/user-event"
import Textarea from "@/components/Textarea"

describe("Textarea", () => {
  it("renders label and textarea", () => {
    render(
      <Textarea
        id="description"
        name="description"
        label="Description"
        value=""
        onChange={vi.fn()}
      />
    )

    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
  })

  it("displays error message when error prop provided", () => {
    render(
      <Textarea
        id="description"
        name="description"
        label="Description"
        value=""
        onChange={vi.fn()}
        error="Description is required"
      />
    )

    expect(screen.getByText(/description is required/i)).toBeInTheDocument()
  })

  it("calls onChange when user types", async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(
      <Textarea
        id="description"
        name="description"
        label="Description"
        value=""
        onChange={handleChange}
      />
    )

    await user.type(screen.getByLabelText(/description/i), "Test content")
    expect(handleChange).toHaveBeenCalled()
  })

  it("displays character counter when showCounter is true", () => {
    render(
      <Textarea
        id="description"
        name="description"
        label="Description"
        value="Hello"
        onChange={vi.fn()}
        maxLength={100}
        showCounter
      />
    )

    expect(screen.getByText("5/100")).toBeInTheDocument()
  })

  it("does not display counter when showCounter is false", () => {
    render(
      <Textarea
        id="description"
        name="description"
        label="Description"
        value="Hello"
        onChange={vi.fn()}
        maxLength={100}
        showCounter={false}
      />
    )

    expect(screen.queryByText("5/100")).not.toBeInTheDocument()
  })

  it("respects disabled state", () => {
    render(
      <Textarea
        id="description"
        name="description"
        label="Description"
        value=""
        onChange={vi.fn()}
        disabled
      />
    )

    expect(screen.getByLabelText(/description/i)).toBeDisabled()
  })

  it("enforces maxLength", () => {
    render(
      <Textarea
        id="description"
        name="description"
        label="Description"
        value=""
        onChange={vi.fn()}
        maxLength={10}
      />
    )

    const textarea = screen.getByLabelText(/description/i)
    expect(textarea).toHaveAttribute("maxLength", "10")
  })
})
