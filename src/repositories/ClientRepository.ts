import type { Client, ClientInput } from "@/types/client"

export interface ClientRepository {
  getClients(): Promise<Client[]>
  getClient(id: string): Promise<Client | null>
  createClient(input: ClientInput): Promise<Client>
  updateClient(id: string, input: ClientInput): Promise<Client>
  deleteClient(id: string): Promise<void>
}
