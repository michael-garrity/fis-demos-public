import { describe, it, expect, vi, beforeEach } from "vitest";

import { POST } from "./route";
import { getClient } from "@/lib/supabase";
import { openAIService } from "@/lib/llm-generation/openai/OpenAIService";

vi.mock("@/lib/llm-generation/openai/OpenAIService", () => ({
  openAIService: {
    generateStructuredContent: vi.fn(),
  },
}));

vi.mock("@/lib/supabase", () => {
  const mockSingle = vi.fn();
  const mockSelect = vi.fn(() => ({
    single: mockSingle,
  }));
  const mockInsert = vi.fn(() => ({
    select: mockSelect,
  }));
  const mockFrom = vi.fn(() => ({
    insert: mockInsert,
  }));

  return {
    getClient: vi.fn(() => ({
      from: mockFrom,
    })),
  };
});

describe("API Route Handlers: /api/lessons/generate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getMocks = () => {
    const client = getClient();
    const from = client.from;
    const chain = client.from("lessons" as any);
    const insert = chain.insert;
    const select = insert({}).select;
    const single = select("*").single;
    vi.clearAllMocks();
    return { from, insert, single };
  };

  const validPayload = {
    title: "Introduction to Atoms",
    customization: "Use concise language.",
    creation_meta: {
      learner_profile: {
        label: "7th grader",
        age: 12,
        reading_level: 5,
        experience: "Has completed introductory STEM activities.",
        interests: ["Robotics", "Graphic novels"],
      },
      source_material: {
        title: "What is an Atom?",
        content: "Atoms are the building blocks of matter.",
      },
    },
  };

  const generatedLesson = {
    introduction: "Intro section",
    context: "Context section",
    example: "Example section",
    practice: "Practice section",
    assessment: "Assessment section",
    reflection: "Reflection section",
  };

  it("returns 201 and persists generated lesson", async () => {
    const { from, insert, single } = getMocks();

    vi.mocked(openAIService.generateStructuredContent).mockResolvedValueOnce(
      generatedLesson,
    );
    vi.mocked(single).mockResolvedValueOnce({
      data: {
        id: "lesson-id",
        title: validPayload.title,
      },
      error: null,
      count: null,
      status: 201,
      statusText: "Created",
    } as any);

    const response = await POST(
      new Request("http://localhost/api/lessons/generate", {
        method: "POST",
        body: JSON.stringify(validPayload),
      }) as any,
    );
    const body = await response.json();

    expect(from).toHaveBeenCalledWith("lessons");
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: validPayload.title,
        creation_meta: validPayload.creation_meta,
      }),
    );
    expect(openAIService.generateStructuredContent).toHaveBeenCalledOnce();
    expect(response.status).toBe(201);
    expect(body).toEqual({
      id: "lesson-id",
      title: validPayload.title,
    });
  });

  it("returns 400 for invalid request payload", async () => {
    const response = await POST(
      new Request("http://localhost/api/lessons/generate", {
        method: "POST",
        body: JSON.stringify({
          creation_meta: validPayload.creation_meta,
        }),
      }) as any,
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toHaveProperty("error");
    expect(openAIService.generateStructuredContent).not.toHaveBeenCalled();
  });

  it("returns 500 when insert fails", async () => {
    const { single } = getMocks();
    vi.mocked(openAIService.generateStructuredContent).mockResolvedValueOnce(
      generatedLesson,
    );
    vi.mocked(single).mockResolvedValueOnce({
      data: null,
      error: { message: "DB insert failed" },
      count: null,
      status: 500,
      statusText: "Internal Server Error",
    } as any);

    const response = await POST(
      new Request("http://localhost/api/lessons/generate", {
        method: "POST",
        body: JSON.stringify(validPayload),
      }) as any,
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "DB insert failed" });
  });
});
