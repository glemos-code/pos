import type { z } from 'zod';

export type StructuredResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface StructuredLLMClient {
  generateStructured<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodType<T>,
  ): Promise<StructuredResult<T>>;
}

