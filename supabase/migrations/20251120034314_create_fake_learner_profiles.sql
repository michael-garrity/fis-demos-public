create table fake_learner_profiles (
    id uuid default gen_random_uuid() not null primary key,
    label text not null, -- noqa: RF04
    age integer not null,
    reading_level integer not null,
    interests text [] default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create trigger handle_updated_at before update on fake_learner_profiles
for each row execute procedure moddatetime(updated_at);
