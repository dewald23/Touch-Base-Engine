import { StateGraph, START, END } from "@langchain/langgraph";
import { TouchBaseGraphState } from "@/graph/state";
import { brandStrategistNode } from "./nodes/brandStrategist";
import { growthHackerNode } from "./nodes/growthHacker";

/**
 * Touch-Base Engine Multi-Agent Workflow State Graph.
 * Sequences execution from inbound brief -> Brand Strategist -> Growth Hacker -> Terminal.
 */
const workflow = new StateGraph(TouchBaseGraphState)
  .addNode("BrandStrategist", brandStrategistNode)
  .addNode("GrowthHacker", growthHackerNode)
  .addEdge(START, "BrandStrategist")
  .addEdge("BrandStrategist", "GrowthHacker")
  .addEdge("GrowthHacker", END);

export const compiledGraph = workflow.compile();