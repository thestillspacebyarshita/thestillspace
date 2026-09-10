import type { AttachmentRepository } from "@/repositories/AttachmentRepository"
import type { ClientRepository } from "@/repositories/ClientRepository"
import type { FollowUpRepository } from "@/repositories/FollowUpRepository"
import type { SessionRepository } from "@/repositories/SessionRepository"
import { FirestoreClientRepository } from "@/repositories/firebase/FirestoreClientRepository"
import { FirestoreSessionRepository } from "@/repositories/firebase/FirestoreSessionRepository"
import { FirestoreFollowUpRepository } from "@/repositories/firebase/FirestoreFollowUpRepository"
import { FirestoreAttachmentRepository } from "@/repositories/firebase/FirestoreAttachmentRepository"

export const clientRepository: ClientRepository = new FirestoreClientRepository()
export const sessionRepository: SessionRepository = new FirestoreSessionRepository()
export const followUpRepository: FollowUpRepository = new FirestoreFollowUpRepository()
export const attachmentRepository: AttachmentRepository = new FirestoreAttachmentRepository()