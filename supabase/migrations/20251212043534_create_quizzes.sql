create table quizzes (
    id uuid default gen_random_uuid() not null primary key,
    creation_meta jsonb not null default '{}',
    title text not null,
    description text not null,
    questions jsonb not null default '[]',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger handle_updated_at before update on quizzes
for each row execute procedure moddatetime(updated_at);
