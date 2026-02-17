CREATE TABLE
  public.lessons (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    title text NOT NULL DEFAULT NULL,
    content text NOT NULL DEFAULT NULL,
    creation_meta jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
  );

;

CREATE UNIQUE INDEX lessons_pkey ON public.lessons USING btree (id);