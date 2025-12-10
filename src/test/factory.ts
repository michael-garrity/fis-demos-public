import { faker } from '@faker-js/faker';
import { getClient } from "@/lib/supabase";
import { tableize, titleize, underscore } from 'inflection';

const factories = {
  courseOutline(overrides = {}) {
    return {
      creation_meta: {
        learner_profile: build("learnerProfile"),
      },
      description: faker.lorem.sentence(),
      lesson_outlines: buildList("lessonOutline", 2),
      title: titleize(faker.lorem.words(3)),
      ...overrides
    }
  },

  learnerProfile(overrides = {}) {
    return {
      age: faker.number.int({ min: 8, max: 120 }),
      interests: faker.lorem.words().split(" "),
      label: faker.person.firstName(),
      // TODO: replace this with Lexile level
      reading_level: faker.number.int({ min: 0, max: 12 }),
      ...overrides
    }
  },

  lessonOutline(overrides = {}) {
    return {
      title: faker.lorem.word(),
      outcome: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      minutes: faker.number.int({ min: 5, max: 90, multipleOf: 15 }),
      ...overrides
    }
  }
}

type FactoryName = keyof typeof factories;
type FactoryReturn<F extends FactoryName> = ReturnType<typeof factories[F]>;

function snakeCaseKeys<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map(item => snakeCaseKeys(item)) as T;
  }
  if (input !== null && typeof input === "object") {
    return Object.fromEntries(
      Object.entries(input).map(([k, v]) => [underscore(k), snakeCaseKeys(v)])
    ) as T;
  }
  return input;
}

export function build<F extends FactoryName>(
  name: F,
  overrides: Partial<FactoryReturn<F>> = {}
): FactoryReturn<F> {
  if (!factories[name]) throw new Error(`Unknown factory '${name}'`);
  return factories[name](snakeCaseKeys(overrides));
}

export function buildList<F extends FactoryName>(
  name: F,
  length: number,
  overrides: Partial<FactoryReturn<F>> = {}
) {
  return Array.from({ length }, () => build(name, overrides));
}

export async function create<F extends FactoryName>(
  name: F,
  overrides: Partial<FactoryReturn<F>> = {}
) {
  const entity = build(name, overrides);
  const table = tableize(name);
  const supabase = getClient();

  const { data, error } = await supabase
    .from(table)
    .insert([entity])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createList<F extends FactoryName>(
  name: F,
  length: number,
  overrides: Partial<FactoryReturn<F>> = {}
) {
  return Promise.all(
    Array.from({ length }, () => create(name, overrides))
  )
}
