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

/**
 * Master State Annotation for the Touch-Base Engine Multi-Agent Pipeline.
 * Manages thread IDs, task instructions, generated copy/reports, versioned 
 * artifact references, audit trails, and execution state.
 */
export const TouchBaseGraphState = Annotation.Root({
  threadId: Annotation<string>({
    reducer: (left, right) => right ?? left,
    default: () => "",
  }),
  taskType: Annotation<string>({
    reducer: (left, right) => right ?? left,
    default: () => "general",
  }),
  instructions: Annotation<string>({
    reducer: (left, right) => right ?? left,
    default: () => "",
  }),
  brandCopy: Annotation<string>({
    reducer: (left, right) => right ?? left,
    default: () => "",
  }),
  growthReport: Annotation<string>({
    reducer: (left, right) => right ?? left,
    default: () => "",
  }),
  currentSector: Annotation<string>({
    reducer: (left, right) => right ?? left,
    default: () => "BrandStrategist",
  }),
  artifactRefs: Annotation<Record<string, ArtifactRef>>({
    reducer: (left, right) => ({ ...left, ...right }),
    default: () => ({}),
  }),
  auditTrail: Annotation<AuditEntry[]>({
    reducer: (left, right) => [...left, ...right],
    default: () => [],
  }),
  error: Annotation<string | null>({
    reducer: (left, right) => right ?? left,
    default: () => null,
  }),
});

export type TouchBaseGraphStateType = typeof TouchBaseGraphState.State;