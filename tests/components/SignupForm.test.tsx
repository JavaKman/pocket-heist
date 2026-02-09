import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import userEvent from "@testing-library/user-event"
import SignupForm from "@/components/SignupForm"

// Mock Next.js router
const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock Firebase auth
vi.mock("@/lib/firebase", () => ({
  auth: {},
  db: {},
}))

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}))

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
}))

vi.mock("@/lib/auth/codename", () => ({
  generateCodename: vi.fn(() => "MockCodename"),
}))

describe("SignupForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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
    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")
    const { doc, setDoc } = await import("firebase/firestore")

    const mockUser = { uid: "test-uid-123", email: "test@example.com" }
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
      user: mockUser,
    } as any)
    vi.mocked(updateProfile).mockResolvedValue()
    vi.mocked(doc).mockReturnValue("mock-doc-ref" as any)
    vi.mocked(setDoc).mockResolvedValue()

    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "password123")
    await user.click(screen.getByRole("button", { name: /sign up/i }))

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        "test@example.com",
        "password123"
      )
      expect(mockPush).toHaveBeenCalledWith("/heists")
    })
  })

  it("disables form during submission", async () => {
    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")
    const { doc, setDoc } = await import("firebase/firestore")

    const mockUser = { uid: "test-uid-123", email: "test@example.com" }
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
      user: mockUser,
    } as any)
    vi.mocked(updateProfile).mockResolvedValue()
    vi.mocked(doc).mockReturnValue("mock-doc-ref" as any)
    vi.mocked(setDoc).mockResolvedValue()

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
