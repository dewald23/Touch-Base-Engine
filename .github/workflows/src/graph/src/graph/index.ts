import { StateGraph, START, END } from "@langchain/langgraph";
import { TouchBaseGraphState } from "./state";
import { brandStrategistNode } from "./nodes/brandStrategist";
import { growthHackerNode } from "./nodes/growthHacker";

/**
 * Touch-Base Engine Multi-Agent Workflow State Graph.
 * Sequences execution from inbound brief -> Brand Strategist (copy & artifacts) 
 * -> Growth Hacker (SEO & CRO audit) -> Terminal Completion.
 */
const workflow = new StateGraph(TouchBaseGraphState)
  // 1. Register agent nodes
  .addNode("BrandStrategist", brandStrategistNode)
  .addNode("GrowthHacker", growthHackerNode)

  // 2. Define execution edges & routing logic
  .addEdge(START, "BrandStrategist")
  .addEdge("BrandStrategist", "GrowthHacker")
  .addEdge("GrowthHacker", END);

/**
 * Compiled executable graph instance ready for worker invocation and checkpointing.
 */
export const compiledGraph = workflow.compile();