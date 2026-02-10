import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import userEvent from "@testing-library/user-event"
import CreateHeistForm from "@/components/CreateHeistForm"

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
})

// Mock Next.js router
const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock Firebase
vi.mock("@/lib/firebase", () => ({
  db: {},
}))

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => ({ _type: "collection" })),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(() => ({ _seconds: 0, _nanoseconds: 0 })),
  Timestamp: {
    fromMillis: vi.fn((ms) => ({ _seconds: ms / 1000, _nanoseconds: 0 })),
  },
}))

// Mock useUser hook
const mockUseUser = vi.fn()
vi.mock("@/lib/auth/useUser", () => ({
  useUser: () => mockUseUser(),
}))

describe("CreateHeistForm", () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    localStorage.clear()

    // Default mock implementation for useUser
    mockUseUser.mockReturnValue({
      user: {
        id: "user123",
        displayName: "TestUser",
        email: "test@example.com",
      },
      loading: false,
    })

    // Default mock implementation for getDocs (return some users)
    const { getDocs } = await import("firebase/firestore")
    vi.mocked(getDocs).mockResolvedValue({
      docs: [
        {
          data: () => ({ id: "user123", codename: "TestUser" }),
        },
        {
          data: () => ({ id: "user456", codename: "OtherUser" }),
        },
        {
          data: () => ({ id: "user789", codename: "ThirdUser" }),
        },
      ],
    } as any)
  })

  it("renders all form fields", async () => {
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/heist title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/assign to/i)).toBeInTheDocument()
    })
  })

  it("displays loading state initially", () => {
    mockUseUser.mockReturnValue({
      user: null,
      loading: true,
    })

    render(<CreateHeistForm />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it("fetches and displays users in dropdown (excluding current user)", async () => {
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(screen.getByText("OtherUser")).toBeInTheDocument()
      expect(screen.getByText("ThirdUser")).toBeInTheDocument()
      expect(screen.queryByText("TestUser")).not.toBeInTheDocument()
    })
  })

  it("shows message when no users available", async () => {
    const { getDocs } = await import("firebase/firestore")
    vi.mocked(getDocs).mockResolvedValue({
      docs: [
        {
          data: () => ({ id: "user123", codename: "TestUser" }),
        },
      ],
    } as any)

    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(
        screen.getByText(/no users available to assign/i)
      ).toBeInTheDocument()
    })
  })

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup()
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/heist title/i)).toBeInTheDocument()
    })

    const submitButton = screen.getByRole("button", { name: /create heist/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
      expect(screen.getByText(/description is required/i)).toBeInTheDocument()
      expect(
        screen.getByText(/please select a user to assign/i)
      ).toBeInTheDocument()
    })
  })

  it("shows validation error for title too short", async () => {
    const user = userEvent.setup()
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/heist title/i)).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/heist title/i), "ab")
    await user.click(screen.getByRole("button", { name: /create heist/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/title must be at least 3 characters/i)
      ).toBeInTheDocument()
    })
  })

  it("shows validation error for description too short", async () => {
    const user = userEvent.setup()
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/description/i), "short")
    await user.click(screen.getByRole("button", { name: /create heist/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/description must be at least 10 characters/i)
      ).toBeInTheDocument()
    })
  })

  it("disables form during submission", async () => {
    const { addDoc } = await import("firebase/firestore")
    vi.mocked(addDoc).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    )

    const user = userEvent.setup()
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/heist title/i)).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/heist title/i), "Test Heist")
    await user.type(
      screen.getByLabelText(/description/i),
      "This is a test description"
    )
    await user.selectOptions(screen.getByLabelText(/assign to/i), "user456")

    const submitButton = screen.getByRole("button", { name: /create heist/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/heist title/i)).toBeDisabled()
      expect(screen.getByLabelText(/description/i)).toBeDisabled()
      expect(screen.getByLabelText(/assign to/i)).toBeDisabled()
      expect(submitButton).toBeDisabled()
    })
  })

  it("submits form with correct data structure", async () => {
    const { addDoc } = await import("firebase/firestore")
    vi.mocked(addDoc).mockResolvedValue({ id: "heist123" } as any)

    const user = userEvent.setup()
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/heist title/i)).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/heist title/i), "Test Heist")
    await user.type(
      screen.getByLabelText(/description/i),
      "This is a test description"
    )
    await user.selectOptions(screen.getByLabelText(/assign to/i), "user456")
    await user.click(screen.getByRole("button", { name: /create heist/i }))

    await waitFor(async () => {
      const { addDoc } = await import("firebase/firestore")
      expect(addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          title: "Test Heist",
          description: "This is a test description",
          createdBy: "user123",
          createdByCodename: "TestUser",
          assignedTo: "user456",
          assignedToCodename: "OtherUser",
          finalStatus: null,
        })
      )
    })
  })

  it("redirects to /heists after successful submission", async () => {
    const { addDoc } = await import("firebase/firestore")
    vi.mocked(addDoc).mockResolvedValue({ id: "heist123" } as any)

    const user = userEvent.setup()
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/heist title/i)).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/heist title/i), "Test Heist")
    await user.type(
      screen.getByLabelText(/description/i),
      "This is a test description"
    )
    await user.selectOptions(screen.getByLabelText(/assign to/i), "user456")
    await user.click(screen.getByRole("button", { name: /create heist/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/heists")
    })
  })

  it("shows error message when Firestore write fails", async () => {
    const { addDoc } = await import("firebase/firestore")
    vi.mocked(addDoc).mockRejectedValue(new Error("Firestore error"))

    const user = userEvent.setup()
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/heist title/i)).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/heist title/i), "Test Heist")
    await user.type(
      screen.getByLabelText(/description/i),
      "This is a test description"
    )
    await user.selectOptions(screen.getByLabelText(/assign to/i), "user456")
    await user.click(screen.getByRole("button", { name: /create heist/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/failed to create heist/i)
      ).toBeInTheDocument()
    })
  })

  it("loads draft from localStorage on mount", async () => {
    const draft = {
      title: "Draft Title",
      description: "Draft Description",
      assignedTo: "user456",
      assignedToCodename: "OtherUser",
    }
    localStorage.setItem("heist-draft", JSON.stringify(draft))

    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/heist title/i)).toHaveValue("Draft Title")
      expect(screen.getByLabelText(/description/i)).toHaveValue(
        "Draft Description"
      )
    })
  })

  it("clears localStorage after successful submission", async () => {
    const { addDoc } = await import("firebase/firestore")
    vi.mocked(addDoc).mockResolvedValue({ id: "heist123" } as any)
    localStorage.setItem(
      "heist-draft",
      JSON.stringify({
        title: "Draft Title",
        description: "Draft Description",
        assignedTo: "",
        assignedToCodename: "",
      })
    )

    const user = userEvent.setup()
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/heist title/i)).toHaveValue("Draft Title")
    })

    // Complete the form
    await user.clear(screen.getByLabelText(/heist title/i))
    await user.type(screen.getByLabelText(/heist title/i), "Test Heist")
    await user.clear(screen.getByLabelText(/description/i))
    await user.type(
      screen.getByLabelText(/description/i),
      "This is a test description"
    )
    await user.type(
      screen.getByLabelText(/description/i),
      "This is a test description"
    )
    await user.selectOptions(screen.getByLabelText(/assign to/i), "user456")
    await user.click(screen.getByRole("button", { name: /create heist/i }))

    await waitFor(() => {
      expect(localStorage.getItem("heist-draft")).toBeNull()
    })
  })
})
