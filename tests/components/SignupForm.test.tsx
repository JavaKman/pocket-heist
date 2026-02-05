import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import userEvent from "@testing-library/user-event"
import SignupForm from "@/components/SignupForm"

describe("SignupForm", () => {
  it("renders email and password fields", () => {
    render(<SignupForm />)

    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
  })

  it("renders submit button", () => {
    render(<SignupForm />)

    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument()
  })

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    const submitButton = screen.getByRole("button", { name: /sign up/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it("shows error for invalid email format", async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByLabelText("Email"), "invalid-email")
    await user.type(screen.getByLabelText("Password"), "password123")
    await user.click(screen.getByRole("button", { name: /sign up/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument()
    })
  })

  it("shows error for password less than 6 characters", async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "12345")
    await user.click(screen.getByRole("button", { name: /sign up/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 6 characters/i)
      ).toBeInTheDocument()
    })
  })

  it("submits form with valid data", async () => {
    const consoleSpy = vi.spyOn(console, "log")
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "password123")
    await user.click(screen.getByRole("button", { name: /sign up/i }))

    await waitFor(
      () => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Signup submitted:",
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
    render(<SignupForm />)

    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "password123")
    await user.click(screen.getByRole("button", { name: /sign up/i }))

    const submitButton = screen.getByRole("button", { name: /sign up/i })
    expect(submitButton).toBeDisabled()
  })

  it("renders link to login page", () => {
    render(<SignupForm />)

    const loginLink = screen.getByRole("link", { name: /log in/i })
    expect(loginLink).toBeInTheDocument()
    expect(loginLink).toHaveAttribute("href", "/login")
  })
})
