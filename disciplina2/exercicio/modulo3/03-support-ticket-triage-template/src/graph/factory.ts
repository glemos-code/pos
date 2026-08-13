import { config } from '../config.ts';
import { OpenRouterService } from '../services/openRouterService.ts';
import { TicketService } from '../services/ticketService.ts';
import { buildTicketGraph } from './graph.ts';

const ticketService = new TicketService();

export function buildGraph() {
  const llmClient = new OpenRouterService(config);
  return buildTicketGraph(llmClient, ticketService);
}

export const graph = async () => {
  return buildGraph();
};
