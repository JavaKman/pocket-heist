import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import userEvent from "@testing-library/user-event"
import Select from "@/components/Select"

describe("Select", () => {
  const mockOptions = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ]

  it("renders label and select element", () => {
    render(
      <Select
        id="test-select"
        name="test-select"
        label="Test Select"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
      />
    )

    expect(screen.getByLabelText(/test select/i)).toBeInTheDocument()
  })

  it("renders all options", () => {
    render(
      <Select
        id="test-select"
        name="test-select"
        label="Test Select"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
      />
    )

    expect(screen.getByText("Option 1")).toBeInTheDocument()
    expect(screen.getByText("Option 2")).toBeInTheDocument()
    expect(screen.getByText("Option 3")).toBeInTheDocument()
  })

  it("displays placeholder option", () => {
    render(
      <Select
        id="test-select"
        name="test-select"
        label="Test Select"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
        placeholder="Choose one"
      />
    )

    expect(screen.getByText("Choose one")).toBeInTheDocument()
  })

  it("displays error message when error prop provided", () => {
    render(
      <Select
        id="test-select"
        name="test-select"
        label="Test Select"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
        error="Selection is required"
      />
    )

    expect(screen.getByText(/selection is required/i)).toBeInTheDocument()
  })

  it("calls onChange when user selects an option", async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(
      <Select
        id="test-select"
        name="test-select"
        label="Test Select"
        value=""
        onChange={handleChange}
        options={mockOptions}
      />
    )

    await user.selectOptions(screen.getByLabelText(/test select/i), "2")
    expect(handleChange).toHaveBeenCalled()
  })

  it("respects disabled state", () => {
    render(
      <Select
        id="test-select"
        name="test-select"
        label="Test Select"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
        disabled
      />
    )

    expect(screen.getByLabelText(/test select/i)).toBeDisabled()
  })
})
