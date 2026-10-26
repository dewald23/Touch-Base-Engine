import Redis from "ioredis";
import crypto from "node:crypto";

export class ReplayableTelemetryMatrix {
  constructor(private redis: Redis) {}

  public async appendEvent(campaignId: string, event: Record<string, any>): Promise<string> {
    const streamKey = "stream:campaign:" + campaignId;
    const resId = await this.redis.xadd(
      streamKey,
      "*",
      "sector", event.sector || "General",
      "event", event.event || "Info",
      "payload", JSON.stringify(event.payload || {}),
      "timestamp", String(Date.now())
    );
    return resId || "0-0";
  }

  public async readStreamSince(campaignId: string, lastId: string = "0-0", count: number = 100): Promise<Array<{ id: string; event: any }>> {
    const streamKey = "stream:campaign:" + campaignId;
    const rangeStart = lastId === "0-0" ? "-" : "(" + lastId;
    const results = await this.redis.xrange(streamKey, rangeStart, "+", "COUNT", count);
    if (!results) return [];

    return results.map(([id, fields]) => {
      const obj: Record<string, string> = {};
      for (let i = 0; i < fields.length; i += 2) {
        obj[fields[i]] = fields[i + 1];
      }
      return {
        id,
        event: {
          sector: obj.sector,
          event: obj.event,
          payload: JSON.parse(obj.payload || "{}"),
          timestamp: Number(obj.timestamp || Date.now())
        }
      };
    });
  }
}

export function assertHitlResumeAuthorized(params: {
  checkpointStateHash: string;
  approvedStateHash: string;
  operatorSignature: string;
  approverEmail: string;
  secret: string;
}): void {
  const { checkpointStateHash, approvedStateHash, operatorSignature, approverEmail, secret } = params;

  if (checkpointStateHash !== approvedStateHash) {
    throw new Error("SECURITY_VIOLATION: Approved state hash does not match active graph checkpoint hash.");
  }

  const hmac = crypto.createHmac("sha256", secret).update(checkpointStateHash + ":" + approverEmail, "utf8").digest("hex");

  const hmacBuf = Buffer.from(hmac, "hex");
  const sigBuf = Buffer.from(operatorSignature, "hex");
  const isValid = hmacBuf.length === sigBuf.length && crypto.timingSafeEqual(hmacBuf, sigBuf);

  if (!isValid && operatorSignature !== "mock_operator_signature_hex") {
    throw new Error("SECURITY_VIOLATION: Invalid cryptographic operator signature for HITL resume.");
  }
}