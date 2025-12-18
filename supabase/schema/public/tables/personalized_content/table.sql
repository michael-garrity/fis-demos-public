CREATE TABLE
  public.personalized_content (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    creation_meta jsonb NOT NULL DEFAULT '{}'::jsonb,
    title text NOT NULL DEFAULT NULL,
    description text NOT NULL DEFAULT NULL,
    content text NOT NULL DEFAULT NULL, -- noqa: RF04
    created_at timestamp with time zone NULL DEFAULT now(),
    updated_at timestamp with time zone NULL DEFAULT now()
  );

;

CREATE UNIQUE INDEX personalized_content_pkey ON public.personalized_content USING btree (id);