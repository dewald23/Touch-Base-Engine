import { describe, it, expect } from "vitest";
import { IngestWebhookSchema, HitlApprovalSchema, verifyWebhookHmac } from "@/lib/schemas";
import crypto from "node:crypto";

describe("IngestWebhookSchema", () => {
  it("validates a valid payload", () => {
    const valid = {
      eventId: "evt_123",
      clientId: "client_456",
      taskType: "full_audit",
      instructions: "Generate brand strategy and audit"
    };
    const res = IngestWebhookSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("fails when required fields are missing", () => {
    const invalid = {
      clientId: "client_456"
    };
    const res = IngestWebhookSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });
});

describe("HitlApprovalSchema", () => {
  it("validates a valid approval payload", () => {
    const valid = {
      threadId: "thread_123",
      approverId: "operator@example.com",
      expectedStateHash: "a".repeat(64),
      action: "approve",
      operatorSignature: "sig_abc"
    };
    const res = HitlApprovalSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("fails on invalid email or wrong hash length", () => {
    const invalid = {
      threadId: "thread_123",
      approverId: "not-an-email",
      expectedStateHash: "short_hash",
      action: "approve",
      operatorSignature: "sig_abc"
    };
    const res = HitlApprovalSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });
});

describe("verifyWebhookHmac", () => {
  const secret = "test_secret_key_123";

  it("verifies matching HMAC signature", () => {
    const body = JSON.stringify({ test: "data" });
    const hmacHex = crypto.createHmac("sha256", secret).update(body, "utf8").digest("hex");
    const signatureHeader = `sha256=${hmacHex}`;

    expect(verifyWebhookHmac(body, signatureHeader, secret)).toBe(true);
  });

  it("rejects mismatched signature", () => {
    const body = JSON.stringify({ test: "data" });
    const wrongHmac = crypto.createHmac("sha256", "wrong_secret").update(body, "utf8").digest("hex");
    const signatureHeader = `sha256=${wrongHmac}`;

    expect(verifyWebhookHmac(body, signatureHeader, secret)).toBe(false);
  });

  it("rejects invalid signature header format", () => {
    const body = JSON.stringify({ test: "data" });
    expect(verifyWebhookHmac(body, "invalid_header", secret)).toBe(false);
    expect(verifyWebhookHmac(body, null, secret)).toBe(false);
  });
});

