import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import { OpenAIService } from "./OpenAIService";

vi.mock("../LLMService", () => ({
  AbstractLLMService: class {},
}));

vi.mock("openai", () => {
  return {
    default: class MockOpenAI {
      responses = {
        parse: vi.fn(),
      };
    },
  };
});

vi.mock("openai/helpers/zod", () => ({
  zodTextFormat: vi.fn(),
}));

describe("OpenAIService", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...ORIGINAL_ENV, OPENAI_API_KEY: "test-key" };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  const getMocks = (service: OpenAIService) => {
    const client = (service as any).client;
    const parse = client.responses.parse;
    const zodHelper = zodTextFormat;

    return { parse, zodHelper };
  };

  describe("generateStructuredContent", () => {
    const testSchema = z.object({
      summary: z.string(),
      tags: z.array(z.string()),
    });

    const mockSuccessResponse = {
      summary: "Test Summary",
      tags: ["unit", "test"],
    };

    it("should successfully generate and return structured content", async () => {
      const service = new OpenAIService();
      const { parse, zodHelper } = getMocks(service);

      vi.mocked(zodHelper).mockReturnValue({
        type: "json_schema",
        json_schema: {},
      } as any);

      vi.mocked(parse).mockResolvedValue({
        output_parsed: mockSuccessResponse,
      });

      const result = await service.generateStructuredContent(
        "Analyze this code",
        testSchema
      );

      expect(result).toEqual(mockSuccessResponse);

      expect(parse).toHaveBeenCalledWith({
        model: "gpt-4o-2024-08-06",
        input: expect.arrayContaining([
          { role: "user", content: "Analyze this code" },
        ]),
        text: {
          format: { type: "json_schema", json_schema: {} },
        },
        temperature: undefined,
        max_output_tokens: undefined,
      });

      expect(zodHelper).toHaveBeenCalledWith(testSchema, "result");
    });

    it("should include system and developer prompts in the input when provided", async () => {
      const service = new OpenAIService();
      const { parse, zodHelper } = getMocks(service);

      vi.mocked(zodHelper).mockReturnValue({ type: "json_schema" } as any);
      vi.mocked(parse).mockResolvedValue({
        output_parsed: mockSuccessResponse,
      });

      await service.generateStructuredContent("User Prompt", testSchema, {
        systemPrompt: "System instruction",
        developerPrompt: "Developer context",
      });

      expect(parse).toHaveBeenCalledWith(
        expect.objectContaining({
          input: [
            { role: "system", content: "System instruction" },
            { role: "developer", content: "Developer context" },
            { role: "user", content: "User Prompt" },
          ],
        })
      );
    });

    it("should pass configuration options (temperature, max_tokens) to the client", async () => {
      const service = new OpenAIService();
      const { parse, zodHelper } = getMocks(service);

      vi.mocked(zodHelper).mockReturnValue({ type: "json_schema" } as any);
      vi.mocked(parse).mockResolvedValue({
        output_parsed: mockSuccessResponse,
      });

      await service.generateStructuredContent("Prompt", testSchema, {
        temperature: 0.7,
        max_output_tokens: 500,
      });

      expect(parse).toHaveBeenCalledWith(
        expect.objectContaining({
          temperature: 0.7,
          max_output_tokens: 500,
        })
      );
    });

    it("should throw a specific error if OpenAI returns null for output_parsed", async () => {
      const service = new OpenAIService();
      const { parse, zodHelper } = getMocks(service);

      vi.mocked(zodHelper).mockReturnValue({ type: "json_schema" } as any);

      vi.mocked(parse).mockResolvedValue({
        output_parsed: null,
      });

      await expect(
        service.generateStructuredContent("Prompt", testSchema)
      ).rejects.toThrow(
        "OpenAI returned null for structured output. The response did not match the schema."
      );
    });

    it("should propagate errors from the OpenAI client", async () => {
      const service = new OpenAIService();
      const { parse, zodHelper } = getMocks(service);
      const apiError = new Error("Rate limit exceeded");

      vi.mocked(zodHelper).mockReturnValue({ type: "json_schema" } as any);
      vi.mocked(parse).mockRejectedValue(apiError);

      await expect(
        service.generateStructuredContent("Prompt", testSchema)
      ).rejects.toThrow("Rate limit exceeded");
    });
  });
});
