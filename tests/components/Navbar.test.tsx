import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import userEvent from "@testing-library/user-event"

// component imports
import Navbar from "@/components/Navbar"

// Mock the auth module
const mockSignOut = vi.fn()
const mockUseUser = vi.fn()

vi.mock("@/lib/auth", () => ({
  useUser: () => mockUseUser(),
  signOut: () => mockSignOut(),
}))

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default to no user
    mockUseUser.mockReturnValue({ user: null, loading: false })
  })

  it("renders the main heading", () => {
    render(<Navbar />)

    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it("renders the Create Heist link", () => {
    render(<Navbar />)

    const createLink = screen.getByRole("link", { name: /create new heist/i })
    expect(createLink).toBeInTheDocument()
    expect(createLink).toHaveAttribute("href", "/heists/create")
  })

  it("renders logout button when user is authenticated", () => {
    mockUseUser.mockReturnValue({
      user: { uid: "123", email: "test@example.com" },
      loading: false,
    })

    render(<Navbar />)

    const logoutButton = screen.getByRole("button", { name: /log out/i })
    expect(logoutButton).toBeInTheDocument()
  })

  it("does not render logout button when user is not authenticated", () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })

    render(<Navbar />)

    const logoutButton = screen.queryByRole("button", { name: /log out/i })
    expect(logoutButton).not.toBeInTheDocument()
  })

  it("calls signOut when logout button is clicked", async () => {
    mockUseUser.mockReturnValue({
      user: { uid: "123", email: "test@example.com" },
      loading: false,
    })
    mockSignOut.mockResolvedValue(undefined)

    const user = userEvent.setup()
    render(<Navbar />)

    const logoutButton = screen.getByRole("button", { name: /log out/i })
    await user.click(logoutButton)

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })
  })

  it("logout button has correct styling and text content", () => {
    mockUseUser.mockReturnValue({
      user: { uid: "123", email: "test@example.com" },
      loading: false,
    })

    render(<Navbar />)

    const logoutButton = screen.getByRole("button", { name: /log out/i })
    expect(logoutButton).toHaveTextContent("Log Out")
    // Check that button has the gradient button class
    expect(logoutButton.className).toContain("btn")
  })

  it("logout button appears left of create button", () => {
    mockUseUser.mockReturnValue({
      user: { uid: "123", email: "test@example.com" },
      loading: false,
    })

    render(<Navbar />)

    const buttons = screen.getAllByRole("button").concat(screen.getAllByRole("link"))
    const logoutButton = screen.getByRole("button", { name: /log out/i })
    const createLink = screen.getByRole("link", { name: /create new heist/i })

    const logoutIndex = buttons.indexOf(logoutButton)
    const createIndex = buttons.indexOf(createLink)

    expect(logoutIndex).toBeLessThan(createIndex)
  })
})
