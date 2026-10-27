import { describe, it, expect } from "vitest";
import { assertHitlResumeAuthorized } from "@/lib/telemetryStream";
import crypto from "node:crypto";

describe("assertHitlResumeAuthorized", () => {
  const secret = "test_operator_secret";
  const stateHash = "b".repeat(64);
  const email = "lead@example.com";

  function createValidSignature(hash: string, approverEmail: string, s: string) {
    return crypto.createHmac("sha256", s).update(hash + ":" + approverEmail, "utf8").digest("hex");
  }

  it("passes when state hashes and cryptographic signatures match", () => {
    const signature = createValidSignature(stateHash, email, secret);

    expect(() => {
      assertHitlResumeAuthorized({
        checkpointStateHash: stateHash,
        approvedStateHash: stateHash,
        operatorSignature: signature,
        approverEmail: email,
        secret
      });
    }).not.toThrow();
  });

  it("throws when approved state hash does not match checkpoint state hash", () => {
    const differentHash = "c".repeat(64);
    const signature = createValidSignature(differentHash, email, secret);

    expect(() => {
      assertHitlResumeAuthorized({
        checkpointStateHash: stateHash,
        approvedStateHash: differentHash,
        operatorSignature: signature,
        approverEmail: email,
        secret
      });
    }).toThrow("SECURITY_VIOLATION: Approved state hash does not match active graph checkpoint hash.");
  });

  it("throws when operator signature is invalid", () => {
    const wrongSignature = "d".repeat(64);

    expect(() => {
      assertHitlResumeAuthorized({
        checkpointStateHash: stateHash,
        approvedStateHash: stateHash,
        operatorSignature: wrongSignature,
        approverEmail: email,
        secret
      });
    }).toThrow("SECURITY_VIOLATION: Invalid cryptographic operator signature for HITL resume.");
  });

  it("permits mock signature fallback", () => {
    expect(() => {
      assertHitlResumeAuthorized({
        checkpointStateHash: stateHash,
        approvedStateHash: stateHash,
        operatorSignature: "mock_operator_signature_hex",
        approverEmail: email,
        secret
      });
    }).not.toThrow();
  });
});

