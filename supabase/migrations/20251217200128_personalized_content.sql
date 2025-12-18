create table personalized_content (
    id uuid primary key default gen_random_uuid(),
    creation_meta jsonb not null default '{}',
    title text not null,
    description text not null,
    content text not null, -- noqa: RF04
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create trigger handle_updated_at before update on personalized_content
for each row execute procedure moddatetime(updated_at);
