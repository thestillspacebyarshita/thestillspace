import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import { ClientForm } from "@/components/clients/ClientForm"
import type { Client, ClientInput } from "@/types/client"

const existingClient: Client = {
  id: "c1",
  code: "C-2026-001",
  fullName: "Jane Doe",
  dateAdded: "2026-01-01",
  status: "ACTIVE",
}

function renderForm(client?: Client) {
  const onSubmit = vi.fn(async (_input: ClientInput) => {})
  const onCancel = vi.fn()
  render(
    <MemoryRouter>
      <ClientForm initialClient={client} onSubmit={onSubmit} onCancel={onCancel} />
    </MemoryRouter>,
  )
  return { onSubmit, onCancel }
}

describe("ClientForm validation", () => {
  it("shows validation errors when required fields are missing", async () => {
    const { onSubmit } = renderForm()
    fireEvent.click(screen.getByRole("button", { name: "Add Client" }))
    expect(await screen.findByText("Full name is required")).toBeInTheDocument()
    expect(screen.getByText("Client code is required")).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("rejects an invalid email address", async () => {
    renderForm()
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "John Smith" } })
    fireEvent.change(screen.getByLabelText("Client Code"), { target: { value: "C-2026-100" } })
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "not-an-email" } })
    fireEvent.click(screen.getByRole("button", { name: "Add Client" }))
    expect(await screen.findByText("Enter a valid email address")).toBeInTheDocument()
  })

  it("submits valid data and preserves entered values", async () => {
    const { onSubmit } = renderForm()
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "John Smith" } })
    fireEvent.change(screen.getByLabelText("Client Code"), { target: { value: "C-2026-200" } })
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "(555) 010-1111" } })
    fireEvent.click(screen.getByRole("button", { name: "Add Client" }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
    const input = onSubmit.mock.calls[0][0] as { fullName: string; code: string; phone: string }
    expect(input.fullName).toBe("John Smith")
    expect(input.code).toBe("C-2026-200")
    expect(input.phone).toBe("(555) 010-1111")
  })

  it("pre-fills existing client data for editing", () => {
    renderForm(existingClient)
    expect(screen.getByLabelText("Full Name")).toHaveValue("Jane Doe")
    expect(screen.getByLabelText("Client Code")).toHaveValue("C-2026-001")
    expect(screen.getByRole("button", { name: "Save Changes" })).toBeInTheDocument()
  })

  it("shows unsaved changes indicator after editing", () => {
    renderForm(existingClient)
    expect(screen.queryByText("Unsaved changes")).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Jane Smith" } })
    expect(screen.getByText("Unsaved changes")).toBeInTheDocument()
  })
})