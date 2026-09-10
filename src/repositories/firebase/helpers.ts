import type { DocumentData } from "firebase/firestore"

/**
 * Firestore rejects `undefined` field values. Strip them before writing so
 * optional domain fields are simply omitted from documents.
 */
export function stripUndefined<T extends object>(value: T): DocumentData {
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(value)) {
    if (val !== undefined) result[key] = val
  }
  return result
}

/**
 * Rehydrate a Firestore snapshot into a domain object by attaching the
 * document id. Fields that were never written are undefined at runtime,
 * which matches the optional fields in the domain types.
 */
export function mapDoc<T>(data: DocumentData, id: string): T {
  return { ...data, id } as unknown as T
}