import type { TicketService } from '../../services/ticketService.ts';
import type { GraphState } from '../graph.ts';
import { z } from 'zod/v3';

const ResolveTicketRequiredFieldsSchema = z.object({
  ticketId: z.string({ required_error: 'Ticket id is required' }),
  resolutionSummary: z.string({ required_error: 'Resolution summary is required' })
})

export function createResolveTicketNode(ticketService: TicketService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`📝 Resolving ticket...`);

    try {
      const validation = ResolveTicketRequiredFieldsSchema.safeParse(state)
      if (!validation.success) {
        const errorMessages = validation.error.errors.map(e => e.message).join(', ')
        console.log(`⚠️  Validation failed: ${errorMessages}`);
        return {
          actionSuccess: false,
          actionError: errorMessages,
        }
      }

      const ticket = ticketService.resolveTicket(validation.data.ticketId, validation.data.resolutionSummary);
      console.log(`✅ Ticket ${ticket.id} resolved successfully`);
      return {
        ...state,
        actionSuccess: true,
        actionError: '',
        ticketId: ticket.id,
        ticketData: ticket
      };
  } catch(error){
    console.log(`❌ Failed to resolve ticket: ${error}`);
    return {
      actionSuccess: false,
      actionError: String(error),
    };
  };
  };
}

