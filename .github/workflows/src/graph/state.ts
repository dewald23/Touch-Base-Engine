import { Annotation } from '@langchain/langgraph';
import { BaseMessage } from '@langchain/core/messages';

/**
 * Master State Annotation for the Touch-Base Engine Multi-Agent Pipeline.
 * Manages omnichannel request payload propagation, agent conversation history,
 * RAG brand context, generated draft content, and HITL review status.
 */
export const AgencyStateAnnotation = Annotation.Root({
  // Unique database identifier for tracking in Supabase
  requestId: Annotation<string>({
    reducer: (left, right) => right ?? left,
    default: () => '',
  }),

  // Inbound/outbound communication channel (e.g., 'email', 'whatsapp', 'webhook')
  channel: Annotation<string>({
    reducer: (left, right) => right ?? left,
    default: () => 'email',
  }),

  // Recipient address or identifier
  recipient: Annotation<string>({
    reducer: (left, right) => right ?? left,
    default: () => '',
  }),

  // Raw inbound request payload data
  inputPayload: Annotation<Record<string, any>>({
    reducer: (left, right) => ({ ...left, ...right }),
    default: () => ({}),
  }),

  // Retrieved vector knowledge / brand guidelines context (RAG)
  brandContext: Annotation<string>({
    reducer: (left, right) => right ?? left,
    default: () => '',
  }),

  // Generated copy, proposal, or response draft
  draftContent: Annotation<string>({
    reducer: (left, right) => right ?? left,
    default: () => '',
  }),

  // Human-in-the-Loop (HITL) checkpoint approval state
  reviewStatus: Annotation<'received' | 'pending_approval' | 'approved' | 'rejected'>({
    reducer: (left, right) => right ?? left,
    default: () => 'received',
  }),

  // LangChain message history for multi-turn agent reasoning and critique
  messages: Annotation<BaseMessage[]>({
    reducer: (left, right) => left.concat(right),
    default: () => [],
  }),

  // Runtime error tracking for graceful worker failure recovery
  error: Annotation<string | null>({
    reducer: (left, right) => right ?? left,
    default: () => null,
  }),
});

export type AgencyStateType = typeof AgencyStateAnnotation.State;