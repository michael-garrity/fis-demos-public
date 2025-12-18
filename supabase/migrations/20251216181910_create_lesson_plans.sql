create table lesson_plans (
    id uuid default gen_random_uuid() not null primary key,
    creation_meta jsonb not null default '{}',
    introduction_markdown text not null,
    context_markdown text not null,
    example_markdown text not null,
    practice_markdown text not null,
    assessment_markdown text not null,
    reflection_markdown text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger handle_updated_at before update on lesson_plans
for each row execute procedure moddatetime(updated_at);
