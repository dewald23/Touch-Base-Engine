import Redis from "ioredis";
import { logger } from "@/lib/logger";

const LUA_CIRCUIT_CHECK_AND_FAIL = [
  'local key = KEYS[1]',
  'local threshold = tonumber(ARGV[1])',
  'local cooldown = tonumber(ARGV[2])',
  'local now = tonumber(ARGV[3])',
  '',
  'local state = redis.call("HGET", key, "state") or "CLOSED"',
  'local failures = tonumber(redis.call("HGET", key, "failures") or "0")',
  'local lastChange = tonumber(redis.call("HGET", key, "lastChange") or "0")',
  '',
  'if state == "OPEN" then',
  '  if (now - lastChange) > cooldown then',
  '    redis.call("HSET", key, "state", "HALF_OPEN", "lastChange", now)',
  '    return "HALF_OPEN"',
  '  end',
  '  return "OPEN"',
  'end',
  '',
  'if state == "HALF_OPEN" then',
  '  return "HALF_OPEN"',
  'end',
  '',
  'failures = failures + 1',
  'if failures >= threshold then',
  '  redis.call("HSET", key, "state", "OPEN", "failures", failures, "lastChange", now)',
  '  return "OPEN"',
  'else',
  '  redis.call("HSET", key, "state", "CLOSED", "failures", failures, "lastChange", now)',
  '  return "CLOSED"',
  'end'
].join("\n");

export class RedisClusterCircuitBreaker {
  constructor(private redis: Redis, private name: string, private failureThreshold = 3, private cooldownMs = 10000) {}

  public async evaluateFailure(): Promise<string> {
    const key = "circuit:" + this.name;
    const now = Date.now();
    try {
      const res = await this.redis.eval(
        LUA_CIRCUIT_CHECK_AND_FAIL,
        1,
        key,
        String(this.failureThreshold),
        String(this.cooldownMs),
        String(now)
      );
      return res as string;
    } catch (err) {
      logger.error({ sector: "Redis CircuitBreaker", err }, "Failed to execute Lua circuit breaker evaluation");
      return "OPEN";
    }
  }

  public async reset(): Promise<void> {
    const key = "circuit:" + this.name;
    await this.redis.hset(key, "state", "CLOSED", "failures", "0", "lastChange", String(Date.now()));
  }
}