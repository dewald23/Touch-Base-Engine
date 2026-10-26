import { Resend } from "resend";
import { logger } from "@/lib/logger";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "alerts@touchbaseconsulting.co.za";
const resend = new Resend(resendApiKey || "re_placeholder");

export async function sendHitlApprovalNotification(options: {
  toEmail: string;
  threadId: string;
  stateHash: string;
  dashboardUrl: string;
}): Promise<void> {
  const { toEmail, threadId, stateHash, dashboardUrl } = options;
  try {
    if (!resendApiKey) {
      logger.info({ sector: "Resend", toEmail, threadId }, "[MOCK] HITL Approval email sent");
      return;
    }
    const htmlBody = [
      '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ededed; padding: 24px; border-radius: 12px;">',
      '  <h2 style="color: #f59e0b; margin-top: 0;">Touch-Base Engine - HITL Approval Required</h2>',
      '  <p>A campaign execution thread has reached the cryptographic approval gate and requires your sign-off to proceed.</p>',
      '  <div style="background: #171717; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #262626;">',
      '    <p style="margin: 0 0 8px 0;"><strong>Thread ID:</strong> <code>' + threadId + '</code></p>',
      '    <p style="margin: 0;"><strong>State Hash:</strong> <code style="word-break: break-all; color: #fcd34d;">' + stateHash + '</code></p>',
      '  </div>',
      '  <a href="' + dashboardUrl + '" style="display: inline-block; background: #f59e0b; color: #0a0a0a; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">Review & Approve in Dashboard</a>',
      '</div>'
    ].join("\n");

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: "Action Required: HITL Approval Gate for Campaign " + threadId,
      html: htmlBody
    });
    logger.info({ sector: "Resend", toEmail, threadId }, "HITL approval notification email sent successfully");
  } catch (err: any) {
    logger.error({ sector: "Resend", err: err.message }, "Failed to send HITL approval email");
    throw err;
  }
}