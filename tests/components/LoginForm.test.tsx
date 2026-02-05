import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import userEvent from "@testing-library/user-event"
import LoginForm from "@/components/LoginForm"

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    render(<LoginForm />)

    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
  })

  it("renders submit button", () => {
    render(<LoginForm />)

    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument()
  })

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const submitButton = screen.getByRole("button", { name: /log in/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it("shows error for invalid email format", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "invalid-email")
    await user.type(screen.getByLabelText("Password"), "password123")
    await user.click(screen.getByRole("button", { name: /log in/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument()
    })
  })

  it("submits form with valid data", async () => {
    const consoleSpy = vi.spyOn(console, "log")
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "password123")
    await user.click(screen.getByRole("button", { name: /log in/i }))

    await waitFor(
      () => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Login submitted:",
          expect.objectContaining({
            email: "test@example.com",
            password: "password123",
          })
        )
      },
      { timeout: 2000 }
    )

    consoleSpy.mockRestore()
  })

  it("disables form during submission", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "password123")
    await user.click(screen.getByRole("button", { name: /log in/i }))

    const submitButton = screen.getByRole("button", { name: /log in/i })
    expect(submitButton).toBeDisabled()
  })

  it("renders link to signup page", () => {
    render(<LoginForm />)

    const signupLink = screen.getByRole("link", { name: /sign up/i })
    expect(signupLink).toBeInTheDocument()
    expect(signupLink).toHaveAttribute("href", "/signup")
  })
})
