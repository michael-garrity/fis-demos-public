create table source_materials (
    id uuid default gen_random_uuid() not null primary key,
    title text not null,
    markdown text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger handle_updated_at before update on source_materials
for each row execute procedure moddatetime(updated_at);
