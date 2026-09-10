import { mockClients } from "@/mock/clients"
import type { ClientRepository } from "@/repositories/ClientRepository"
import type { Client, ClientInput } from "@/types/client"

let store: Client[] = [...mockClients]

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function toStoredClient(id: string, input: ClientInput): Client {
  return {
    ...input,
    id,
    dateAdded: new Date().toISOString().slice(0, 10),
  }
}

export const mockClientRepository: ClientRepository = {
  async getClients() {
    return [...store]
  },

  async getClient(id) {
    const found = store.find((c) => c.id === id)
    return found ? { ...found } : null
  },

  async createClient(input) {
    const client = toStoredClient(makeId("c"), input)
    store = [client, ...store]
    return { ...client }
  },

  async updateClient(id, input) {
    const existing = store.find((c) => c.id === id)
    if (!existing) throw new Error("Client not found")
    const updated: Client = { ...existing, ...input }
    store = store.map((c) => (c.id === id ? updated : c))
    return { ...updated }
  },

  async deleteClient(id) {
    store = store.filter((c) => c.id !== id)
  },
}