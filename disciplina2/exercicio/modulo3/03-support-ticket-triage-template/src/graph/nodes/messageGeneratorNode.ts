import { AIMessage } from 'langchain';
import type { StructuredLLMClient } from '../../contracts/llmClient.ts';
import {
  getMessageSystemPrompt,
  getMessageUserPrompt,
  ResponseMessageSchema,
} from '../../prompts/v1/messageGenerator.ts';
import type { GraphState } from '../graph.ts';

export function createMessageGeneratorNode(llmClient: StructuredLLMClient) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    try {
      const originalQuestion = state.messages.at(-1)?.text ?? '';
      const scenario =
        state.missingFields?.length
          ? 'missing_fields'
          : state.intent === 'unknown'
            ? 'unknown'
            : `${state.intent}_${state.actionSuccess ? 'success' : 'error'}`;

      const details: Record<string, unknown> = {
        ticket: state.ticketData,
        ticketId: state.ticketId,
        error: state.actionError,
        missingFields: state.missingFields,
        validationIssues: state.validationIssues,
        allowedValues: {
          impact: {
            one_user: 'Apenas um usuário',
            many_users: 'Vários usuários',
          },
          urgency: {
            normal: 'Pode aguardar',
            soon: 'Precisa ser tratado em breve',
            immediate: 'Precisa ser tratado agora',
          }
        }
      };

      const systemPrompt = getMessageSystemPrompt();
      const userPrompt = getMessageUserPrompt({
        originalQuestion,
        scenario,
        details,
      });

      const result = await llmClient.generateStructured(
        systemPrompt,
        userPrompt,
        ResponseMessageSchema,
      );

      if (!result.success) {
        console.error(`⚠️  Message generation failed: ${result.error}`);
        return {
          actionError: result.error,
          actionSuccess: false
        }
      }

      return {
        messages: [
          new AIMessage(result.data.message),
        ],
      };
    } catch (error) {
      console.error(`❌ Message generation failed: ${error}`);
      return {
        actionError: String(error),
        actionSuccess: false,
      };
    }
  };
}

