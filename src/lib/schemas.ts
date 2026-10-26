import { z } from "zod";
import crypto from "node:crypto";

export const IngestWebhookSchema = z.object({
  eventId: z.string().min(1),
  campaignId: z.string().optional(),
  threadId: z.string().optional(),
  clientId: z.string().min(1),
  taskType: z.enum(["full_audit", "landing_page", "seo_sprint", "brand_refresh"]).default("full_audit"),
  instructions: z.string().min(1)
}).strict();

export type IngestWebhookPayload = z.infer<typeof IngestWebhookSchema>;

export const HitlApprovalSchema = z.object({
  threadId: z.string().min(1),
  approverId: z.string().email(),
  expectedStateHash: z.string().length(64),
  action: z.enum(["approve", "reject"]),
  operatorSignature: z.string().min(1)
}).strict();

export type HitlApprovalPayload = z.infer<typeof HitlApprovalSchema>;

export function verifyWebhookHmac(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) return false;
  const receivedHex = signatureHeader.slice("sha256=".length);
  const expectedHex = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const a = Buffer.from(receivedHex, "hex");
  const b = Buffer.from(expectedHex, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}