import type { Database, Json } from "@/types/database";
import { LessonOutline } from "@demos/course-outline/_models"
import { faker } from '@faker-js/faker';
import { getClient } from "@/lib/supabase";
import { tableize, titleize, underscore } from 'inflection';
import { Answer, Question } from "@/types";

type Table = keyof Database["public"]["Tables"];
type TableRow<T extends Table> = Database["public"]["Tables"][T]["Row"];

type Factory = keyof typeof factories;
type FactoryOutput<F extends Factory> = ReturnType<typeof factories[F]>;

const factories = {
  courseOutline(): TableRow<"course_outlines"> {
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

  quiz(): TableRow<"quizzes"> {
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

  learnerProfile(): TableRow<"learner_profiles"> {
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      age: faker.number.int({ min: 8, max: 120 }),
      experience: faker.lorem.sentence(),
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

  question(): Question {
    return {
      question: faker.lorem.sentence(),
      answer: build("answer"),
      distractors: buildList("answer", 3),
    }
  },

  answer(): Answer {
    return {
      text: faker.lorem.sentence(),
      feedback: faker.lorem.sentence(),
    }
  }
};

function snakeCaseKeys(input: any): any { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (Array.isArray(input)) return input.map(snakeCaseKeys);
  if (input && typeof input === "object") {
    return Object.fromEntries(
      Object.entries(input).map(([k, v]) => [underscore(k), snakeCaseKeys(v)])
    );
  }
  return input;
}

export function build<F extends Factory> (
  name: F,
  overrides = {}
): FactoryOutput<F> {
  const factory = factories[name];
  if (!factory) throw new Error(`Unknown factory '${name}'`);

  return { ...factory(), ...(snakeCaseKeys(overrides)) } as FactoryOutput<F>
}

export function buildList<F extends Factory> (
  name: F,
  length: number,
  overrides = {}
): FactoryOutput<F>[] {
  return Array.from({ length }, () => build(name, overrides)) as FactoryOutput<F>[];
}

export async function create<F extends Factory> (
  name: F,
  overrides = {}
): Promise<FactoryOutput<F>> {
  const table = tableize(name) as Table;
  const entity = build(name, overrides) as TableRow<typeof table>;

  const supabase = getClient();

  const { data, error } = await supabase
    .from(table)
    .insert([entity])
    .select()
    .single();

  console.log(data, error);
  
  if (error) throw error;

  return data as FactoryOutput<F>;
}

export async function createList<F extends Factory> (
  name: F,
  length: number,
  overrides = {}
): Promise<FactoryOutput<F>[]> {
  return Promise.all(
    Array.from({ length }, () => create(name, overrides)) as FactoryOutput<F>[]
  );
}
