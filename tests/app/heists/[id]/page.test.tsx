import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import HeistDetailsPage from "@/app/(dashboard)/heists/[id]/page"
import { Heist } from "@/types/firestore"

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
}))

// Mock the useHeist hook
vi.mock("@/lib/hooks", () => ({
  useHeist: vi.fn(),
}))

const { useParams } = await import("next/navigation")
const { useHeist } = await import("@/lib/hooks")

const mockHeist: Heist = {
  id: "test-heist-1",
  title: "Replace all pens with crayons",
  description:
    "Stealthily swap out all the pens in the marketing department with crayons.",
  createdBy: "user123",
  createdByCodename: "ShadowFox",
  assignedTo: "user456",
  assignedToCodename: "NinjaKitten",
  deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  createdAt: new Date(),
  finalStatus: null,
}

describe("HeistDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useParams).mockReturnValue({ id: "test-heist-1" })
  })

  it("shows loading state while fetching heist", () => {
    vi.mocked(useHeist).mockReturnValue({
      heist: null,
      loading: true,
      error: null,
    })

    render(<HeistDetailsPage />)

    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()
  })

  it("renders heist details when heist is loaded", () => {
    vi.mocked(useHeist).mockReturnValue({
      heist: mockHeist,
      loading: false,
      error: null,
    })

    render(<HeistDetailsPage />)

    expect(
      screen.getByRole("heading", { name: /replace all pens with crayons/i })
    ).toBeInTheDocument()
    expect(screen.getByText("NinjaKitten")).toBeInTheDocument()
    expect(screen.getByText("ShadowFox")).toBeInTheDocument()
    expect(screen.getByText(/assigned to:/i)).toBeInTheDocument()
    expect(screen.getByText(/created by:/i)).toBeInTheDocument()
    expect(screen.getByText(/mission details/i)).toBeInTheDocument()
  })

  it("displays the heist description", () => {
    vi.mocked(useHeist).mockReturnValue({
      heist: mockHeist,
      loading: false,
      error: null,
    })

    render(<HeistDetailsPage />)

    expect(
      screen.getByText(/stealthily swap out all the pens/i)
    ).toBeInTheDocument()
  })

  it("shows time remaining label", () => {
    vi.mocked(useHeist).mockReturnValue({
      heist: mockHeist,
      loading: false,
      error: null,
    })

    render(<HeistDetailsPage />)

    expect(screen.getByText(/time remaining:/i)).toBeInTheDocument()
  })

  it("displays deadline information", () => {
    vi.mocked(useHeist).mockReturnValue({
      heist: mockHeist,
      loading: false,
      error: null,
    })

    render(<HeistDetailsPage />)

    expect(screen.getByText(/deadline:/i)).toBeInTheDocument()
  })

  it("shows not found message when heist doesn't exist", () => {
    vi.mocked(useHeist).mockReturnValue({
      heist: null,
      loading: false,
      error: null,
    })

    render(<HeistDetailsPage />)

    expect(
      screen.getByRole("heading", { name: /heist not found/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/the heist you're looking for doesn't exist/i)
    ).toBeInTheDocument()
  })

  it("shows error message when there's an error loading the heist", () => {
    vi.mocked(useHeist).mockReturnValue({
      heist: null,
      loading: false,
      error: new Error("Firestore error"),
    })

    render(<HeistDetailsPage />)

    expect(
      screen.getByRole("heading", { name: /error loading heist/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/there was an error loading the heist details/i)
    ).toBeInTheDocument()
  })

  it("displays final status when heist has one", () => {
    const completedHeist: Heist = {
      ...mockHeist,
      finalStatus: "success",
    }

    vi.mocked(useHeist).mockReturnValue({
      heist: completedHeist,
      loading: false,
      error: null,
    })

    render(<HeistDetailsPage />)

    expect(screen.getByText(/final status:/i)).toBeInTheDocument()
    expect(screen.getByText(/success/i)).toBeInTheDocument()
  })

  it("displays failure status when heist failed", () => {
    const failedHeist: Heist = {
      ...mockHeist,
      finalStatus: "failure",
    }

    vi.mocked(useHeist).mockReturnValue({
      heist: failedHeist,
      loading: false,
      error: null,
    })

    render(<HeistDetailsPage />)

    expect(screen.getByText(/final status:/i)).toBeInTheDocument()
    expect(screen.getByText(/failure/i)).toBeInTheDocument()
  })
})
