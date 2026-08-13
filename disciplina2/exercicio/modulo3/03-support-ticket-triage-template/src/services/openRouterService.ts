import { ChatOpenAI } from '@langchain/openai';
import { createAgent, HumanMessage, providerStrategy, SystemMessage } from 'langchain';
import type { z } from 'zod';
import type { StructuredLLMClient, StructuredResult } from '../contracts/llmClient.ts';
import type { ModelConfig } from '../config.ts';

export class OpenRouterService implements StructuredLLMClient {
  private readonly client: ChatOpenAI;

  constructor(config: ModelConfig) {
    this.client = new ChatOpenAI({
      apiKey: config.apiKey,
      modelName: config.model,
      temperature: config.temperature,
      configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
      },
    });
  }

  async generateStructured<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodType<T>,
  ): Promise<StructuredResult<T>> {
    try {
      const agent = createAgent({
        model: this.client,
        tools: [],
        responseFormat: providerStrategy(schema),
      });
      const result = await agent.invoke({
        messages: [
          new SystemMessage(systemPrompt),
          new HumanMessage(userPrompt),
        ],
      });

      return { success: true, data: result.structuredResponse as T };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

