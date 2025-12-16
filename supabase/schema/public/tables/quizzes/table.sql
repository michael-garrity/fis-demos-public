CREATE TABLE
  public.quizzes (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    creation_meta jsonb NOT NULL DEFAULT '{}'::jsonb,
    title text NOT NULL DEFAULT NULL,
    description text NOT NULL DEFAULT NULL,
    questions jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
  );

;

CREATE UNIQUE INDEX quizzes_pkey ON public.quizzes USING btree (id);