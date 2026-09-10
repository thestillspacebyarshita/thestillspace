import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { SearchPage } from "@/pages/SearchPage"
import { DataProvider } from "@/contexts/DataContext"

vi.mock("@/services/repositories", () => ({
  clientRepository: { getClients: vi.fn(async () => []) },
  sessionRepository: { getSessions: vi.fn(async () => []) },
  followUpRepository: { getFollowUps: vi.fn(async () => []) },
  attachmentRepository: { getAttachments: vi.fn(async () => []) },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

function renderSearchPage(initialEntry: string) {
  return render(
    <DataProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    </DataProvider>,
  )
}

describe("Routing behaviour", () => {
  it("renders a friendly not-found page for unknown routes", () => {
    render(
      <MemoryRouter initialEntries={["/does-not-exist"]}>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText("Page not found")).toBeInTheDocument()
  })

  it("boots the search page with an empty state", async () => {
    renderSearchPage("/search")
    expect(await screen.findByText("Enter a search term")).toBeInTheDocument()
  })

  it("reads an initial query parameter into the search page", async () => {
    renderSearchPage("/search?q=hello")
    expect(await screen.findByLabelText("Search")).toHaveValue("hello")
  })
})