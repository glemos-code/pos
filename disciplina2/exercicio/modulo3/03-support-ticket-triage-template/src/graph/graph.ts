import type { BaseMessage } from '@langchain/core/messages';
import {
  END,
  MessagesZodMeta,
  START,
  StateGraph,
} from '@langchain/langgraph';
import { withLangGraph } from '@langchain/langgraph/zod';
import { z } from 'zod';
import type { StructuredLLMClient } from '../contracts/llmClient.ts';
import type { Ticket, TicketService } from '../services/ticketService.ts';
import { createAddInformationNode } from './nodes/addInformationNode.ts';
import { createIdentifyRequestNode } from './nodes/identifyRequestNode.ts';
import { createMessageGeneratorNode } from './nodes/messageGeneratorNode.ts';
import { createOpenTicketNode } from './nodes/openTicketNode.ts';
import { createResolveTicketNode } from './nodes/resolveTicketNode.ts';

const ValidationIssueSchema = z.object({
  field: z.enum(['impact', 'urgency']),
  receivedValue: z.string(),
  reason: z.string(),
});

const TicketStateSchema = z.object({
  messages: withLangGraph(z.custom<BaseMessage[]>(), MessagesZodMeta),
  requestId: z.string(),
  intent: z.enum(['open', 'add_information', 'resolve', 'unknown']).optional(),
  confidence: z.number().optional(),
  ticketId: z.string().optional(),
  customerName: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  affectedService: z.string().optional(),
  impact: z.enum(['one_user', 'many_users']).optional(),
  urgency: z.enum(['normal', 'soon', 'immediate']).optional(),
  additionalInformation: z.string().optional(),
  resolutionSummary: z.string().optional(),
  missingFields: z.array(z.string()).optional(),
  promptInjectionDetected: z.boolean().optional(),
  actionSuccess: z.boolean().optional(),
  actionError: z.string().optional(),
  ticketData: z.custom<Ticket>().optional(),
  validationIssues: z.array(ValidationIssueSchema).optional(),
});

export type GraphState = z.infer<typeof TicketStateSchema>;

export function routeAfterIdentification(state: GraphState): string {

  if ((state.confidence !== undefined && state.confidence < 0.8) || 
      state.promptInjectionDetected || 
      (state.missingFields !== undefined && state.missingFields.length > 0) ||
      (state.intent === undefined || state.intent === 'unknown')) {
        return 'message';
  }
    return state.intent
  }


export function buildTicketGraph(
  llmClient: StructuredLLMClient,
  ticketService: TicketService,
) {
  const workflow = new StateGraph({ stateSchema: TicketStateSchema })
    .addNode('identify', createIdentifyRequestNode(llmClient))
    .addNode('open', createOpenTicketNode(ticketService))
    .addNode('add_information', createAddInformationNode(ticketService))
    .addNode('resolve', createResolveTicketNode(ticketService))
    .addNode('message', createMessageGeneratorNode(llmClient))
    .addEdge(START, 'identify')
    .addConditionalEdges(
      'identify',
      routeAfterIdentification,
      {
        open: 'open',
        add_information: 'add_information',
        resolve: 'resolve',
        message: 'message',
      },
    )
    .addEdge('open', 'message')
    .addEdge('add_information', 'message')
    .addEdge('resolve', 'message')
    .addEdge('message', END);

  return workflow.compile();
}
