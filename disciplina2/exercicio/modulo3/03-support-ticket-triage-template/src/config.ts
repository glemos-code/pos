export type ModelConfig = {
  apiKey: string;
  model: string;
  temperature: number;
};

export const config: ModelConfig = {
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
  model: process.env.OPENROUTER_MODEL ?? 'upstage/solar-pro4',
  temperature: 0.2,
};
