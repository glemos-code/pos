import type { TicketService } from '../../services/ticketService.ts';
import type { GraphState } from '../graph.ts';
import { z } from 'zod/v3';

const OpenTicketRequiredFieldsSchema = z.object({
  customerName: z.string({ required_error: 'Customer name is required' }),
  title: z.string({ required_error: 'Ticket title is required' }),
  description: z.string({ required_error: 'Ticket description is required' }),
  affectedService: z.string({ required_error: 'Affected service is required' }),
  impact: z.enum(['one_user', 'many_users'], { required_error: 'Impact is required' }),
  urgency: z.enum(['normal', 'soon', 'immediate'], { required_error: 'Urgency is required' }),
})

export function createOpenTicketNode(ticketService: TicketService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`📝 Opening ticket...`);

    try{
      const validation = OpenTicketRequiredFieldsSchema.safeParse(state)
      if (!validation.success) {
        const errorMessages = validation.error.errors.map(e => e.message).join(', ')
        console.log(`⚠️  Validation failed: ${errorMessages}`);
        return {
          actionSuccess: false,
          actionError: errorMessages,
        }
      }

      const ticket = ticketService.openTicket(state.requestId, {
        customerName: validation.data.customerName,
        title: validation.data.title,
        description: validation.data.description,
        affectedService: validation.data.affectedService,
        impact: validation.data.impact,
        urgency: validation.data.urgency,
      });

      console.log(`✅ Ticket ${ticket.id} opened successfully with priority ${ticket.priority}`);

    return {
      ...state,
      actionSuccess: true,
      ticketId: ticket.id,
      ticketData: ticket
    };
    } catch(error){
      console.log(`❌ Failed to open ticket: ${error}`);
      return {
        actionSuccess: false,
        actionError: String(error),
      };
    }
  };
}

