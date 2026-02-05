import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Skeleton from "@/components/Skeleton"

describe("Skeleton", () => {
  it("renders with default variant", () => {
    const { container } = render(<Skeleton />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveAttribute("aria-hidden", "true")
  })

  it("renders circular variant", () => {
    const { container } = render(<Skeleton variant="circular" />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toBeInTheDocument()
  })

  it("renders rectangular variant", () => {
    const { container } = render(<Skeleton variant="rectangular" />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toBeInTheDocument()
  })

  it("applies custom width and height", () => {
    const { container } = render(<Skeleton width="200px" height="50px" />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveStyle({ width: "200px", height: "50px" })
  })

  it("applies custom className", () => {
    const { container } = render(<Skeleton className="custom-class" />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveClass("custom-class")
  })
})
