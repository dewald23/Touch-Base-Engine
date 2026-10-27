"use client";

import React, { useState } from "react";

interface HitlApprovalCardProps {
  threadId: string;
  stateHash: string;
  approverEmail: string;
  onDecided?: (action: "approve" | "reject") => void;
}

export function HitlApprovalCard({ threadId, stateHash, approverEmail, onDecided }: HitlApprovalCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);

  async function handleAction(action: "approve" | "reject") {
    setLoading(true);
    setError(null);

    try {
      // In production, operator signature is generated via secure hardware or auth token
      const operatorSignature = "mock_operator_signature_hex";

      const res = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId,
          approverId: approverEmail,
          expectedStateHash: stateHash,
          action,
          operatorSignature
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Approval submission failed");
      }

      setSuccessStatus(action === "approve" ? "Campaign approved and resuming..." : "Campaign rejected.");
      onDecided?.(action);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-100 shadow-2xl">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <h3 className="text-lg font-semibold tracking-tight text-amber-500">🛡️ HITL Security Approval Gate</h3>
        <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">Action Required</span>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <span className="text-neutral-400">Thread ID:</span>
          <code className="ml-2 rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">{threadId}</code>
        </div>
        <div>
          <span className="text-neutral-400">Cryptographic State Hash (SHA-256):</span>
          <code className="mt-1 block break-all rounded bg-neutral-800 p-2 font-mono text-xs text-amber-300">{stateHash}</code>
        </div>
        <div>
          <span className="text-neutral-400">Designated Approver:</span>
          <span className="ml-2 font-medium text-neutral-200">{approverEmail}</span>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
          ⚠️ {error}
        </div>
      )}

      {successStatus && (
        <div className="mt-4 rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-400 border border-emerald-500/20">
          ✅ {successStatus}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => handleAction("approve")}
          disabled={loading || !!successStatus}
          className="flex-1 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Approve & Resume"}
        </button>
        <button
          onClick={() => handleAction("reject")}
          disabled={loading || !!successStatus}
          className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm font-semibold text-neutral-200 transition hover:bg-neutral-700 disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
