import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { HumanMessage } from 'langchain';
import type { z } from 'zod';
import type {
  StructuredLLMClient,
  StructuredResult,
} from '../src/contracts/llmClient.ts';
import { buildTicketGraph, routeAfterIdentification } from '../src/graph/graph.ts';
import { TicketService } from '../src/services/ticketService.ts';

class FakeLLMClient implements StructuredLLMClient {
  readonly calls: Array<{ systemPrompt: string; userPrompt: string }> = [];
  private readonly responses: unknown[];

  constructor(responses: unknown[]) {
    this.responses = responses;
  }

  async generateStructured<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodType<T>,
  ): Promise<StructuredResult<T>> {
    this.calls.push({ systemPrompt, userPrompt });
    const parsed = schema.safeParse(this.responses.shift());
    return parsed.success
      ? { success: true, data: parsed.data }
      : { success: false, error: parsed.error.message };
  }
}

describe('ticket graph', () => {
  it('routes valid open requests to the open node', () => {
    const route = routeAfterIdentification({
      requestId: 'request-001',
      messages: [new HumanMessage('Abra um ticket para o checkout.')],
      intent: 'open',
      confidence: 0.95,
      missingFields: [],
      promptInjectionDetected: false,
    });

    assert.equal(route, 'open');
  });

  it('opens a ticket and calls the LLM exactly twice', async () => {
    const llm = new FakeLLMClient([
      {
        intent: 'open',
        confidence: 0.98,
        customerName: 'Ana Costa',
        title: 'Checkout indisponivel',
        description: 'Clientes recebem HTTP 503 ao finalizar compras.',
        affectedService: 'checkout',
        impact: 'many_users',
        urgency: 'immediate',
        missingFields: [],
        promptInjectionDetected: false,
      },
      {
        message: 'Ticket INC-1001 aberto com prioridade critica.',
      },
    ]);
    const service = new TicketService();
    const graph = buildTicketGraph(llm, service);

    const result = await graph.invoke({
      requestId: 'request-001',
      messages: [
        new HumanMessage(
          'Sou Ana. O checkout esta fora do ar para todos. Abra um ticket urgente.',
        ),
      ],
    });

    assert.equal(result.actionSuccess, true);
    assert.equal(result.ticketData?.priority, 'critical');
    assert.equal(service.count(), 1);
    assert.equal(llm.calls.length, 2);
  });

  it('routes valid open requests with low confidence to the message node', () => {
    const route = routeAfterIdentification({
      requestId: 'request-001',
      messages: [new HumanMessage('Abra um ticket para o checkout.')],
      intent: 'open',
      confidence: 0.8,
      missingFields: [],
      promptInjectionDetected: false,
    });

    assert.equal(route, 'message');
  });

  it('routes unknown intent requests to the message node', () => {
    const route = routeAfterIdentification({
      requestId: 'request-001',
      messages: [new HumanMessage('Abra um ticket para o checkout.')],
      intent: 'unknown',
      confidence: 0.95,
      missingFields: [],
      promptInjectionDetected: false,
    });

    assert.equal(route, 'message');
  });

  it('routes unknown intent requests to the message node', () => {
    const route = routeAfterIdentification({
      requestId: 'request-001',
      messages: [new HumanMessage('Abra um ticket para o checkout.')],
      intent: 'open',
      confidence: 0.95,
      missingFields: [],
      promptInjectionDetected: true,
    });

    assert.equal(route, 'message');
  });
});
