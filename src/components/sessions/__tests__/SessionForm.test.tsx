import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import { SessionForm } from "@/components/sessions/SessionForm"
import type { SessionInput } from "@/types/session"

const clients = [
  { id: "c1", fullName: "Jane Doe", code: "C-001" },
  { id: "c2", fullName: "John Smith", code: "C-002" },
]

function renderSessionForm() {
  const onSubmit = vi.fn(async (_input: SessionInput) => {})
  const onCancel = vi.fn()
  render(
    <MemoryRouter>
      <SessionForm
        clients={clients as never}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </MemoryRouter>,
  )
  return { onSubmit, onCancel }
}

describe("SessionForm validation", () => {
  it("shows validation errors when required fields are missing", async () => {
    const { onSubmit } = renderSessionForm()
    fireEvent.click(screen.getByRole("button", { name: "Add Session" }))
    expect(await screen.findByText("Select a client")).toBeInTheDocument()
    expect(screen.getByText("Session title is required")).toBeInTheDocument()
    expect(screen.getByText("Select a date")).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("submits a valid session with correct data", async () => {
    const { onSubmit } = renderSessionForm()
    fireEvent.change(screen.getByLabelText("Client"), { target: { value: "c1" } })
    fireEvent.change(screen.getByLabelText("Session Title"), {
      target: { value: "Initial Assessment" },
    })
    fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2026-09-01" } })
    fireEvent.click(screen.getByRole("button", { name: "Add Session" }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    const input = onSubmit.mock.calls[0][0] as {
      clientId: string
      title: string
      date: string
      durationMinutes: number
    }
    expect(input.clientId).toBe("c1")
    expect(input.title).toBe("Initial Assessment")
    expect(input.date).toBe("2026-09-01")
    expect(input.durationMinutes).toBe(50)
  })

  it("uses custom duration when selected", async () => {
    const { onSubmit } = renderSessionForm()
    fireEvent.change(screen.getByLabelText("Client"), { target: { value: "c2" } })
    fireEvent.change(screen.getByLabelText("Session Title"), { target: { value: "Extended" } })
    fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2026-09-02" } })
    fireEvent.click(screen.getByRole("button", { name: "Custom" }))
    fireEvent.change(screen.getByLabelText(/Custom duration/), { target: { value: "120" } })
    fireEvent.click(screen.getByRole("button", { name: "Add Session" }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    const input = onSubmit.mock.calls[0][0] as { durationMinutes: number }
    expect(input.durationMinutes).toBe(120)
  })

  it("rejects an invalid custom duration", async () => {
    const { onSubmit } = renderSessionForm()
    fireEvent.change(screen.getByLabelText("Client"), { target: { value: "c1" } })
    fireEvent.change(screen.getByLabelText("Session Title"), { target: { value: "Invalid" } })
    fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2026-09-03" } })
    fireEvent.click(screen.getByRole("button", { name: "Custom" }))
    fireEvent.change(screen.getByLabelText(/Custom duration/), { target: { value: "-5" } })
    fireEvent.click(screen.getByRole("button", { name: "Add Session" }))
    expect(
      await screen.findByText("Enter a positive duration in minutes"),
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})