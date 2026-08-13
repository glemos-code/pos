import type { TicketService } from '../../services/ticketService.ts';
import type { GraphState } from '../graph.ts';
import { z } from 'zod/v3';

const AddInformationRequiredFieldsSchema = z.object({
  ticketId: z.string({ required_error: 'Ticket id is required' }),
  additionalInformation: z.string({ required_error: 'Information is required' })
})

export function createAddInformationNode(ticketService: TicketService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`📝 Adding information to ticket...`);

    try {
      const validation = AddInformationRequiredFieldsSchema.safeParse(state)
      if (!validation.success) {
        const errorMessages = validation.error.errors.map(e => e.message).join(', ')
        console.log(`⚠️  Validation failed: ${errorMessages}`);
        return {
          actionSuccess: false,
          actionError: errorMessages,
        }
      }

      const ticket = ticketService.addInformation(validation.data.ticketId, validation.data.additionalInformation);
      console.log(`✅ Information added to ticket ${ticket.id} successfully`);
      return {
        ...state,
        actionSuccess: true,
        actionError: '',
        ticketId: ticket.id,
        ticketData: ticket
      };
  } catch(error){
    console.log(`❌ Failed to add information to ticket: ${error}`);
    return {
      actionSuccess: false,
      actionError: String(error),
    };
  };
}
}

