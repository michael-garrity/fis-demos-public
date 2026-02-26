create table lessons (
    id uuid default gen_random_uuid() not null primary key,
    title text not null,
    content jsonb not null default '{}'::jsonb,
    creation_meta jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger handle_updated_at before update on lessons
for each row execute procedure moddatetime(updated_at);
