CREATE TABLE
  public.personalized_contents (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    creation_meta jsonb NOT NULL DEFAULT '{}'::jsonb,
    title text NOT NULL DEFAULT NULL,
    description text NOT NULL DEFAULT NULL,
    content text NOT NULL DEFAULT NULL,
    created_at timestamp with time zone NULL DEFAULT now(),
    updated_at timestamp with time zone NULL DEFAULT now()
  );

;

CREATE UNIQUE INDEX personalized_content_pkey ON public.personalized_contents USING btree (id);