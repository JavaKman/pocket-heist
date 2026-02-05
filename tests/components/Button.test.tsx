import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import userEvent from "@testing-library/user-event"
import Button from "@/components/Button"

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument()
  })

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={handleClick}>Click</Button>)

    await user.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("shows loading state and is disabled", () => {
    render(<Button loading>Submit</Button>)
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
  })

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Submit</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })
})
