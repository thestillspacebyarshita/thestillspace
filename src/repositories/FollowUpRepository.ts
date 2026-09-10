import type { FollowUp, FollowUpInput } from "@/types/followup"

export interface FollowUpRepository {
  getFollowUps(): Promise<FollowUp[]>
  getFollowUpsByClient(clientId: string): Promise<FollowUp[]>
  getFollowUp(id: string): Promise<FollowUp | null>
  createFollowUp(input: FollowUpInput): Promise<FollowUp>
  updateFollowUp(id: string, input: FollowUpInput): Promise<FollowUp>
  deleteFollowUp(id: string): Promise<void>
}
