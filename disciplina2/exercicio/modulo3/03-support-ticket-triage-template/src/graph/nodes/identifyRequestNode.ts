import type { StructuredLLMClient } from '../../contracts/llmClient.ts';
import {
  getIdentifySystemPrompt,
  getIdentifyUserPrompt,
  RequestAnalysisSchema,
} from '../../prompts/v1/identifyRequest.ts';
import type { GraphState } from '../graph.ts';

export function createIdentifyRequestNode(llmClient: StructuredLLMClient) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    const latestMessage = state.messages.at(-1)?.text ?? '';

    try {
      const systemPrompt = getIdentifySystemPrompt();
      const userPrompt = getIdentifyUserPrompt({
        latestMessage,
        knownFields: {
          intent: state.intent,
          customerName: state.customerName,
          title: state.title,
          description: state.description,
          affectedService: state.affectedService,
          impact: state.impact,
          urgency: state.urgency,
          ticketId: state.ticketId,
          additionalInformation: state.additionalInformation,
          resolutionSummary: state.resolutionSummary,
        }
      }

      );
      const result = await llmClient.generateStructured(
        systemPrompt,
        userPrompt,
        RequestAnalysisSchema,
      );

      if (!result.success) {
        console.log(`⚠️  Request identification failed: ${result.error}`);
        return {
          intent: 'unknown',
          actionSuccess: false,
          actionError: result.error,
        };
      }

      const intentData = result.data!;
      console.log(`✅ Request identified: ${intentData.intent}`);

      return {
        ...intentData,
        actionSuccess: true,
      };
    } catch (error) {
      console.error('❌ Error in identifyRequest node:', error);
      return {
        ...state,
        intent: 'unknown',
        actionSuccess: false,
        actionError: error instanceof Error ? error.message : 'Request identification failed',
      };
    }
  }
}

