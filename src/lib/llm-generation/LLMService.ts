import { ZodType } from "zod";

export interface GenerateOptions {
  systemPrompt?: string;
  developerPrompt?: string;
  temperature?: number;
  max_output_tokens?: number;
}

export abstract class AbstractLLMService {
  public abstract generateStructuredContent<T>(
    prompt: string,
    schema: ZodType<T>,
    options?: GenerateOptions
  ): Promise<T>;
}
