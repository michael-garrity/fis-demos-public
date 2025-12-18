CREATE TABLE
  public.lesson_plans (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    creation_meta jsonb NOT NULL DEFAULT '{}'::jsonb,
    introduction_markdown text NOT NULL DEFAULT NULL,
    context_markdown text NOT NULL DEFAULT NULL,
    example_markdown text NOT NULL DEFAULT NULL,
    practice_markdown text NOT NULL DEFAULT NULL,
    assessment_markdown text NOT NULL DEFAULT NULL,
    reflection_markdown text NOT NULL DEFAULT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
  );

;

CREATE UNIQUE INDEX lesson_plans_pkey ON public.lesson_plans USING btree (id);