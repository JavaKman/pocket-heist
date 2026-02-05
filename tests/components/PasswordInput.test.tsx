import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import userEvent from "@testing-library/user-event"
import PasswordInput from "@/components/PasswordInput"

describe("PasswordInput", () => {
  it("renders password input with hidden text by default", () => {
    render(
      <PasswordInput
        id="password"
        name="password"
        label="Password"
        value=""
        onChange={vi.fn()}
      />
    )

    const input = screen.getByLabelText("Password")
    expect(input).toHaveAttribute("type", "password")
  })

  it("toggles password visibility when button clicked", async () => {
    const user = userEvent.setup()

    render(
      <PasswordInput
        id="password"
        name="password"
        label="Password"
        value=""
        onChange={vi.fn()}
      />
    )

    const input = screen.getByLabelText("Password")
    const toggleButton = screen.getByRole("button", {
      name: /toggle password visibility/i,
    })

    expect(input).toHaveAttribute("type", "password")

    await user.click(toggleButton)
    expect(input).toHaveAttribute("type", "text")

    await user.click(toggleButton)
    expect(input).toHaveAttribute("type", "password")
  })

  it("displays error message", () => {
    render(
      <PasswordInput
        id="password"
        name="password"
        label="Password"
        value=""
        onChange={vi.fn()}
        error="Password is required"
      />
    )

    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })
})
