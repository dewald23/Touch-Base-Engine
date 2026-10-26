import { Annotation } from "@langchain/langgraph";

export interface ArtifactRef {
  key: string;
  uri: string;
  sha256: string;
  sizeBytes: number;
  updatedAt: number;
}

export interface AuditEntry {
  sector: string;
  action: string;
  timestamp: number;
}

export const TouchBaseGraphState = Annotation.Root({
  threadId: Annotation<string>({ reducer: (x, y) => y ?? x, default: () => "" }),
  clientId: Annotation<string>({ reducer: (x, y) => y ?? x, default: () => "" }),
  eventId: Annotation<string>({ reducer: (x, y) => y ?? x, default: () => "" }),
  taskType: Annotation<string>({ reducer: (x, y) => y ?? x, default: () => "full_audit" }),
  instructions: Annotation<string>({ reducer: (x, y) => y ?? x, default: () => "" }),
  currentSector: Annotation<string>({ reducer: (x, y) => y ?? x, default: () => "BrandStrategist" }),
  brandCopy: Annotation<string>({ reducer: (x, y) => y ?? x, default: () => "" }),
  seoMap: Annotation<Record<string, any>>({ reducer: (x, y) => y ?? x, default: () => ({}) }),
  architecturePlan: Annotation<Record<string, any>>({ reducer: (x, y) => y ?? x, default: () => ({}) }),
  stateHash: Annotation<string>({ reducer: (x, y) => y ?? x, default: () => "" }),
  requiresHitlApproval: Annotation<boolean>({ reducer: (x, y) => y ?? x, default: () => false }),
  error: Annotation<string | null>({ reducer: (x, y) => y ?? x, default: () => null }),
  artifactRefs: Annotation<Record<string, ArtifactRef>>({
    reducer: (curr, next) => ({ ...curr, ...next }),
    default: () => ({})
  }),
  auditTrail: Annotation<AuditEntry[]>({
    reducer: (curr, next) => [...curr, ...next],
    default: () => []
  })
});