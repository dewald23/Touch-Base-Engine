import { logger } from "@/lib/logger";

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitBreakerConfig {
  failureThreshold: number;
  cooldownMs: number;
}

export class BulkheadCircuitBreaker {
  private state: CircuitState = "CLOSED";
  private failures = 0;
  private lastStateChange = Date.now();

  constructor(private name: string, private config: CircuitBreakerConfig = { failureThreshold: 3, cooldownMs: 10000 }) {}

  public getState(): CircuitState {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastStateChange > this.config.cooldownMs) {
        this.state = "HALF_OPEN";
        logger.warn({ sector: "MCP Bulkhead", name: this.name }, "Circuit breaker transitioned to HALF_OPEN");
      }
    }
    return this.state;
  }

  public recordSuccess(): void {
    this.failures = 0;
    this.state = "CLOSED";
    this.lastStateChange = Date.now();
  }

  public recordFailure(): void {
    this.failures++;
    if (this.failures >= this.config.failureThreshold) {
      this.state = "OPEN";
      this.lastStateChange = Date.now();
      logger.error({ sector: "MCP Bulkhead", name: this.name, failures: this.failures }, "Circuit breaker tripped to OPEN");
    }
  }

  public async execute<T>(action: () => Promise<T>): Promise<T> {
    const currentState = this.getState();
    if (currentState === "OPEN") {
      throw new Error("Circuit breaker is OPEN for MCP server: " + this.name);
    }

    try {
      const result = await action();
      this.recordSuccess();
      return result;
    } catch (err) {
      this.recordFailure();
      throw err;
    }
  }
}

const NODE_TOOL_ALLOWLIST: Record<string, string[]> = {
  BrandStrategist: ["supabase.vector_search", "supabase.store_artifact"],
  GrowthHacker: ["serp.search_competitors", "supabase.store_artifact"],
  Architect: ["github.create_branch", "github.commit_files", "vercel.create_preview"],
  Auditor: ["audit.compute_hash"]
};

export function assertToolAuthorized(nodeName: string, toolName: string): void {
  const allowedTools = NODE_TOOL_ALLOWLIST[nodeName];
  if (!allowedTools || !allowedTools.includes(toolName)) {
    throw new Error("SECURITY_VIOLATION: Node '" + nodeName + "' is not authorized to execute tool '" + toolName + "'.");
  }
}

