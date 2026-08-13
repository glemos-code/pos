import { randomUUID } from 'node:crypto';
import { HumanMessage } from 'langchain';
import Fastify from 'fastify';
import { buildGraph } from './graph/factory.ts';

const graph = buildGraph();

export function createServer() {
  const app = Fastify();

  app.post('/chat', {
    schema: {
      body: {
        type: 'object',
        required: ['question'],
        properties: {
          question: { type: 'string', minLength: 10 },
          requestId: { type: 'string', minLength: 8 },
        },
      },
    },
  }, async (request) => {
    const body = request.body as { question: string; requestId?: string };
    return graph.invoke({
      requestId: body.requestId ?? randomUUID(),
      messages: [new HumanMessage(body.question)],
    });
  });

  return app;
}

