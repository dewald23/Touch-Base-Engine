export interface CampaignJobPayload {
  mode: "start" | "resume";
  threadId: string;
  payload: {
    eventId?: string;
    campaignId?: string;
    clientId?: string;
    taskType?: string;
    instructions?: string;
    approverId?: string;
    action?: string;
  };
}
