import type { Database } from "@/types/database";
import { faker } from '@faker-js/faker';
import { getClient } from "@/lib/supabase";
import { tableize, titleize, underscore } from 'inflection';

type Table = keyof Database["public"]["Tables"];
type TableInsert<T extends Table> = Database["public"]["Tables"][T]["Insert"];

type CourseOutlineRow =
  Database["public"]["Tables"]["course_outlines"]["Row"];

const factories = {
  courseOutline(overrides = {}): Partial<CourseOutlineRow> {
    return {
      creation_meta: {
        learner_profile: build("learnerProfile"),
      },
      description: faker.lorem.sentence(),
      lesson_outlines: buildList("lessonOutline", 2),
      title: titleize(faker.lorem.words(3)),
      ...overrides
    };
  },

  learnerProfile(overrides = {}) {
    return {
      age: faker.number.int({ min: 8, max: 120 }),
      interests: faker.lorem.words().split(" "),
      label: faker.person.firstName(),
      reading_level: faker.number.int({ min: 0, max: 12 }),
      ...overrides
    };
  },

  lessonOutline(overrides = {}) {
    return {
      title: faker.lorem.word(),
      outcome: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      minutes: faker.number.int({ min: 5, max: 90, multipleOf: 15 }),
      ...overrides
    };
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

export function build(
  name: keyof typeof factories,
  overrides = {}
) {
  if (!factories[name]) throw new Error(`Unknown factory '${name}'`);

  return factories[name](snakeCaseKeys(overrides));
}

export function buildList(
  name: keyof typeof factories,
  length: number,
  overrides = {}
) {
  return Array.from({ length }, () => build(name, overrides));
}

export async function create(
  name: keyof typeof factories,
  overrides = {}
) {
  const table = tableize(name) as Table;
  const entity = build(name, overrides) as TableInsert<typeof table>;

  const supabase = getClient();

  const { data, error } = await supabase
    .from(table)
    .insert([entity])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createList(
  name: keyof typeof factories,
  length: number,
  overrides = {}
) {
  return Promise.all(Array.from({ length }, () => create(name, overrides)));
}
