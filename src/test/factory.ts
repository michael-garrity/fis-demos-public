import type { Database, Json, Tables } from "@/types";
import { LessonOutline } from "@demos/course-outline/_models";
import { faker } from "@faker-js/faker";
import { getClient } from "@/lib/supabase";
import { tableize, titleize, underscore } from "inflection";
import { Answer, Question } from "@/types";

type Factory = keyof typeof factories;
type FactoryOutput<F extends Factory> = ReturnType<(typeof factories)[F]>;

const factories = {
  courseOutline(): Tables<"course_outlines"> {
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      creation_meta: {
        learner_profile: build("learnerProfile"),
      },
      description: faker.lorem.sentence(),
      lesson_outlines: buildList("lessonOutline", 2) as unknown as Json,
      title: titleize(faker.lorem.words(3)),
    };
  },

  quiz(): Tables<"quizzes"> {
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      creation_meta: {
        learner_profile: build("learnerProfile"),
      },
      description: faker.lorem.sentence(),
      questions: buildList("question", 2) as unknown as Json,
      title: titleize(faker.lorem.words(3)),
    };
  },

  learnerProfile(): Tables<"learner_profiles"> {
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      age: faker.number.int({ min: 8, max: 120 }),
      experience: faker.person.bio(),
      interests: faker.lorem.words().split(" "),
      label: faker.person.firstName(),
      reading_level: faker.number.int({ min: 0, max: 12 }),
    };
  },

  lessonOutline(): LessonOutline {
    return {
      title: faker.lorem.word(),
      outcome: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      minutes: faker.number.int({ min: 5, max: 90, multipleOf: 15 }),
    };
  },

  personalizedContent(): Tables<"personalized_contents"> {
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      creation_meta: {
        learner_profile: build("learnerProfile"),
      },
      description: faker.lorem.sentence(),
      title: titleize(faker.lorem.words(3)),
      content: faker.lorem.paragraphs(2),
    };
  },

  lessonPlan(): Tables<"lesson_plans"> {
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      creation_meta: {
        learner_profile: build("learnerProfile"),
        source_material: {
          title: faker.lorem.sentence(),
          content: faker.lorem.lines(1),
        },
      },
      introduction: faker.lorem.paragraph(),
      context: faker.lorem.paragraphs(2),
      example: faker.lorem.paragraphs(2),
      practice: faker.lorem.paragraphs(3),
      assessment: faker.lorem.paragraph(),
      reflection: faker.lorem.paragraph(),
    };
  },

  lesson(): Tables<"lessons"> {
    const now = new Date().toISOString();
    const sectionText = {
      introduction: faker.lorem.paragraph(),
      context: faker.lorem.paragraph(),
      example: faker.lorem.paragraph(),
      practice: faker.lorem.paragraph(),
      assessment: faker.lorem.paragraph(),
      reflection: faker.lorem.paragraph(),
    };
    return {
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      creation_meta: {
        learner_profile: build("learnerProfile"),
      },
      title: titleize(faker.lorem.words(3)),
      content: JSON.stringify({
        sections: {
          introduction: {
            title: "Introduction",
            markdown: sectionText.introduction,
          },
          context: {
            title: "Context",
            markdown: sectionText.context,
          },
          example: {
            title: "Example",
            markdown: sectionText.example,
          },
          practice: {
            title: "Practice",
            markdown: sectionText.practice,
          },
          assessment: {
            title: "Assessment",
            markdown: sectionText.assessment,
          },
          reflection: {
            title: "Reflection",
            markdown: sectionText.reflection,
          },
        },
      }),
    };
  },

  question(): Question {
    return {
      question: faker.lorem.sentence(),
      answers: buildList("answer", 4),
    };
  },

  answer(): Answer {
    return {
      text: faker.lorem.sentence(),
      feedback: faker.lorem.sentence(),
      correct: Math.random() < 0.5,
    };
  },

  sourceMaterial(): Tables<"source_materials"> {
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      title: titleize(faker.lorem.words(3)),
      markdown: `# ${faker.lorem.word()}\n${faker.lorem.paragraph()}`,
    };
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function snakeCaseKeys(input: any): any {
  if (Array.isArray(input)) return input.map(snakeCaseKeys);
  if (input && typeof input === "object") {
    return Object.fromEntries(
      Object.entries(input).map(([k, v]) => [underscore(k), snakeCaseKeys(v)]),
    );
  }
  return input;
}

export function build<F extends Factory>(
  name: F,
  overrides = {},
): FactoryOutput<F> {
  const factory = factories[name];
  if (!factory) throw new Error(`Unknown factory '${name}'`);

  return { ...factory(), ...snakeCaseKeys(overrides) } as FactoryOutput<F>;
}

export function buildList<F extends Factory>(
  name: F,
  length: number,
  overrides = {},
): FactoryOutput<F>[] {
  return Array.from({ length }, () =>
    build(name, overrides),
  ) as FactoryOutput<F>[];
}

export async function create<F extends Factory>(
  name: F,
  overrides = {},
): Promise<FactoryOutput<F>> {
  const table = tableize(name) as keyof Database["public"]["Tables"];
  const entity = build(name, overrides) as Tables<typeof table>;

  const supabase = getClient();

  const { data, error } = await supabase
    .from(table)
    .insert(entity)
    .select()
    .single();

  if (error) throw error;

  if (!data)
    throw new Error(`
    Factory failed to *create* record: ${name} with overrides ${JSON.stringify(overrides)}.
    Is the Supabase module being mocked elsewhere in your tests? If so, use
    *build* rather than *create*.
 `);

  return data as FactoryOutput<F>;
}

export async function createList<F extends Factory>(
  name: F,
  length: number,
  overrides = {},
): Promise<FactoryOutput<F>[]> {
  return await Promise.all(
    Array.from({ length }, () => create(name, overrides)) as FactoryOutput<F>[],
  );
}
