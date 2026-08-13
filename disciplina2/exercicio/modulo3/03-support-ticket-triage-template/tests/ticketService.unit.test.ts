import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { TicketService } from '../src/services/ticketService.ts';

const ticketInput = {
  customerName: 'Ana Costa',
  title: 'Checkout indisponivel',
  description: 'Clientes recebem HTTP 503 ao finalizar compras.',
  affectedService: 'checkout',
  impact: 'many_users' as const,
  urgency: 'immediate' as const,
};

describe('TicketService', () => {
  it('opens a critical ticket', () => {
    const service = new TicketService();
    const ticket = service.openTicket('request-001', ticketInput);

    assert.equal(ticket.id, 'INC-1001');
    assert.equal(ticket.priority, 'critical');
    assert.equal(ticket.status, 'open');
  });

  it('is idempotent for the same requestId', () => {
    const service = new TicketService();
    const first = service.openTicket('request-001', ticketInput);
    const second = service.openTicket('request-001', ticketInput);

    assert.equal(second.id, first.id);
    assert.equal(service.count(), 1);
  });

  it('does not resolve a ticket twice', () => {
    const service = new TicketService();
    const ticket = service.openTicket('request-001', ticketInput);
    service.resolveTicket(ticket.id, 'Rollback executado e checkout normalizado.');

    assert.throws(
      () => service.resolveTicket(ticket.id, 'Segunda tentativa indevida.'),
      /resolved|resolvido/i,
    );
  });
});

