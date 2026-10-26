import { StateGraph, START, END } from "@langchain/langgraph";
import { TouchBaseGraphState } from "@/graph/state";
import { checkpointer } from "@/graph/checkpointer";
import { brandStrategistNode } from "@/graph/nodes/brandStrategist";
import { growthHackerNode } from "@/graph/nodes/growthHacker";
import { architectNode } from "@/graph/nodes/architect";
import { auditorNode } from "@/graph/nodes/auditor";
import { hitlNode } from "@/graph/nodes/hitl";

const workflow = new StateGraph(TouchBaseGraphState)
  .addNode("BrandStrategist", brandStrategistNode)
  .addNode("GrowthHacker", growthHackerNode)
  .addNode("Architect", architectNode)
  .addNode("Auditor", auditorNode)
  .addNode("HitlGate", hitlNode)
  .addEdge(START, "BrandStrategist")
  .addEdge("BrandStrategist", "GrowthHacker")
  .addEdge("GrowthHacker", "Architect")
  .addEdge("Architect", "Auditor")
  .addEdge("Auditor", "HitlGate")
  .addEdge("HitlGate", END);

export const agencyGraph = workflow.compile({
  checkpointer: checkpointer as any,
  interruptBefore: ["HitlGate"]
});