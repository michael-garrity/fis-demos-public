import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { ZodType } from "zod";
import { AbstractLLMService, GenerateOptions } from "../LLMService";
import { ResponseInputItem } from "openai/resources/responses/responses.mjs";

export class OpenAIService extends AbstractLLMService {
  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  public async generateStructuredContent<T>(
    prompt: string,
    schema: ZodType<T>,
    options?: GenerateOptions
  ): Promise<T> {
    const response = await this.client.responses.parse({
      model: "gpt-4o-2024-08-06",
      input: this.buildInput(prompt, options),
      text: {
        format: zodTextFormat(schema, "result"),
      },
      temperature: options?.temperature,
      max_output_tokens: options?.max_output_tokens,
    });

    const parsedResponse = response.output_parsed;

    if (parsedResponse === null) {
      throw new Error(
        "OpenAI returned null for structured output. The response did not match the schema."
      );
    }

    return parsedResponse;
  }

  private buildInput(
    prompt: string,
    options?: GenerateOptions
  ): ResponseInputItem[] {
    const input: ResponseInputItem[] = [];

    if (options?.systemPrompt) {
      input.push({ role: "system", content: options.systemPrompt });
    }

    if (options?.developerPrompt) {
      input.push({ role: "developer", content: options.developerPrompt });
    }

    input.push({ role: "user", content: prompt });

    return input;
  }
}

export const openAIService = new OpenAIService();
