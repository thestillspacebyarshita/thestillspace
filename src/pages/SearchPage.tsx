import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useData } from "@/contexts/DataContext"
import { Input } from "@/components/ui/Field"
import { EmptyState } from "@/components/EmptyState"
import { formatDate } from "@/lib/format"
import type { Client } from "@/types/client"
import type { Session } from "@/types/session"

interface SearchResults {
  clients: Client[]
  sessions: Session[]
}

function searchAll(
  clients: Client[],
  sessions: Session[],
  clientName: (id: string) => string,
  query: string,
): SearchResults {
  const q = query.trim().toLowerCase()
  if (!q) return { clients: [], sessions: [] }

  const matchedClients = clients.filter(
    (c) =>
      c.fullName.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      (c.preferredName ?? "").toLowerCase().includes(q),
  )

  const matchedClientIds = new Set(matchedClients.map((c) => c.id))
  const matchedSessions = sessions.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.eventType.toLowerCase().includes(q) ||
      matchedClientIds.has(s.clientId) ||
      clientName(s.clientId).toLowerCase().includes(q),
  )

  return { clients: matchedClients, sessions: matchedSessions }
}

export function SearchPage() {
  const { clients, sessions } = useData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") ?? "")

  const queryParam = searchParams.get("q") ?? ""
  const clientName = (id: string) => clients.find((c) => c.id === id)?.fullName ?? "Unknown"

  useEffect(() => {
    setSearchParams(query.trim() ? { q: query.trim() } : {}, { replace: true })
  }, [query, setSearchParams])

  const results = searchAll(clients, sessions, clientName, queryParam)
  const total = results.clients.length + results.sessions.length

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Search</h1>
        <p className="mt-1 text-sm text-slate-500">
          Search across clients, client codes, and session titles
        </p>
      </div>

      <div className="max-w-xl">
        <Input
          placeholder="Search clients, codes, or sessions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          aria-label="Search"
        />
      </div>

      {!queryParam ? (
        <div className="rounded-lg border border-slate-200 bg-white">
          <EmptyState title="Enter a search term" description="Results will appear here." />
        </div>
      ) : total === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white">
          <EmptyState
            title="No results"
            description={`Nothing matched "${queryParam}". Try a different search.`}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {results.clients.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold text-slate-800">
                Clients ({results.clients.length})
              </h2>
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <ul className="divide-y divide-slate-100">
                  {results.clients.map((client) => (
                    <li key={client.id}>
                      <Link
                        to={`/clients/${client.id}`}
                        className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-slate-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800">{client.fullName}</p>
                          <p className="text-xs text-slate-500">{client.code}</p>
                        </div>
                        <span className="text-xs text-slate-400">
                          Added {formatDate(client.dateAdded)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {results.sessions.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold text-slate-800">
                Sessions ({results.sessions.length})
              </h2>
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <ul className="divide-y divide-slate-100">
                  {results.sessions.map((session) => (
                    <li key={session.id}>
                      <Link
                        to={`/sessions/${session.id}`}
                        className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-slate-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800">{session.title}</p>
                          <p className="text-xs text-slate-500">
                            {clientName(session.clientId)} · {session.eventType}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400">{formatDate(session.date)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}