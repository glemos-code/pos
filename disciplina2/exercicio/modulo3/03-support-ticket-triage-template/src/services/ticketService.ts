export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'open' | 'resolved';

export type Ticket = {
  id: string;
  customerName: string;
  title: string;
  description: string;
  affectedService: string;
  impact: 'one_user' | 'many_users';
  urgency: 'normal' | 'soon' | 'immediate';
  priority: TicketPriority;
  status: TicketStatus;
  notes: string[];
  resolutionSummary?: string;
};

export type OpenTicketInput = Omit<
  Ticket,
  'id' | 'priority' | 'status' | 'notes' | 'resolutionSummary'
>;

export class TicketService {
  private readonly tickets = new Map<string, Ticket>();
  private readonly requestResults = new Map<string, string>();
  private nextId = 1001;

  openTicket(requestId: string, input: OpenTicketInput): Ticket {
    const existingTicket = this.requestResults.get(requestId);
    if (existingTicket) {
      return this.findById(existingTicket)!;
    }

    const newTicket = {
      id: `INC-${this.nextId++}`,
      status: 'open' as const,
      priority: this.calculatePriority(input.impact, input.urgency),
      customerName: input.customerName,
      title: input.title,
      description: input.description,
      affectedService: input.affectedService,
      impact: input.impact,
      urgency: input.urgency,
      notes: []
    }
    this.tickets.set(newTicket.id, newTicket);
    this.requestResults.set(requestId, newTicket.id);
    return newTicket;
  }

  addInformation(ticketId: string, information: string): Ticket {
    const ticket = this.findById(ticketId);
    if (!ticket) {
      throw new Error(`Ticket ${ticketId} não encontrado`)
    }

    if (ticket.status === 'resolved') {
      throw new Error(`Ticket ${ticketId} já está resolvido`)
    }

    const updatedTicket = {
      ...ticket,
      notes: [...ticket.notes, information],
    };
    this.tickets.set(updatedTicket.id, updatedTicket);
    return updatedTicket;
  }

  resolveTicket(ticketId: string, resolutionSummary: string): Ticket {
    const ticket = this.findById(ticketId);
    if (!ticket) {
      throw new Error(`Ticket ${ticketId} não encontrado`)
    }

    if (ticket.status === 'resolved') {
      throw new Error(`Ticket ${ticketId} já está resolvido`)
    }
    
    const resolvedTicket ={ 
      ...ticket,
      status: 'resolved' as const,
      resolutionSummary: resolutionSummary
    };
    this.tickets.set(resolvedTicket.id, resolvedTicket);
    return resolvedTicket;
  }

  findById(ticketId: string): Ticket | undefined {
    return this.tickets.get(ticketId);
  }

  count(): number {
    return this.tickets.size;
  }

  private calculatePriority(
    impact: OpenTicketInput['impact'],
    urgency: OpenTicketInput['urgency'],
  ): TicketPriority {
    if(impact === 'many_users' ) {
      if(urgency === 'immediate') {
        return 'critical';
      }
      if(urgency === 'soon') {
        return 'high';
      }
      if(urgency === 'normal') {
        return 'medium';
      }
    }
    if (impact === 'one_user') {
      if(urgency === 'immediate') {
        return 'high';
      }
      if(urgency === 'soon') {
        return 'medium';
      }
      if(urgency === 'normal') {
        return 'low';
      }
    }
    return 'low'
  }
}

