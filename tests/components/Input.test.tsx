import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import userEvent from "@testing-library/user-event"
import Input from "@/components/Input"

describe("Input", () => {
  it("renders label and input", () => {
    render(
      <Input
        id="email"
        name="email"
        label="Email"
        value=""
        onChange={vi.fn()}
      />
    )

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it("displays error message when error prop provided", () => {
    render(
      <Input
        id="email"
        name="email"
        label="Email"
        value=""
        onChange={vi.fn()}
        error="Email is required"
      />
    )

    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
  })

  it("calls onChange when user types", async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(
      <Input
        id="email"
        name="email"
        label="Email"
        value=""
        onChange={handleChange}
      />
    )

    await user.type(screen.getByLabelText(/email/i), "test@example.com")
    expect(handleChange).toHaveBeenCalled()
  })
})
