BEGIN;
SELECT plan(16);

-- Table
SELECT has_table(
    'fake_learner_profiles',
    'fake_learner_profiles table should exist'
);

-- Columns
SELECT col_type_is(
    'fake_learner_profiles', 'id', 'uuid',
    'id should be uuid'
);
SELECT col_type_is(
    'fake_learner_profiles', 'label', 'text',
    'label should be text'
);
SELECT col_type_is(
    'fake_learner_profiles', 'age', 'integer',
    'age should be integer'
);
SELECT col_type_is(
    'fake_learner_profiles', 'reading_level', 'integer',
    'reading_level should be integer'
);
SELECT col_type_is(
    'fake_learner_profiles', 'interests', 'text[]',
    'interests should be text array'
);
SELECT col_type_is(
    'fake_learner_profiles', 'created_at', 'timestamp with time zone',
    'created_at should be timestamptz'
);
SELECT col_type_is(
    'fake_learner_profiles', 'updated_at', 'timestamp with time zone',
    'updated_at should be timestamptz'
);

-- Primary key
SELECT col_is_pk(
    'fake_learner_profiles', 'id',
    'id should be primary key'
);

-- Constraints
SELECT col_not_null(
    'fake_learner_profiles', 'age',
    'age should not be null'
);
SELECT col_not_null(
    'fake_learner_profiles', 'reading_level',
    'reading_level should not be null'
);

-- Triggers
SELECT has_trigger(
    'fake_learner_profiles', 'handle_updated_at',
    'handle_updated_at trigger should exist'
);

-- (Setup: Insert a row to test defaults and trigger behavior)
INSERT INTO fake_learner_profiles (label, age, reading_level)
VALUES ('Sam Student', 10, 5);

-- Default column values
SELECT ok(
    (
        SELECT id IS NOT NULL FROM fake_learner_profiles
        WHERE age = 10
    ),
    'id should have default value'
);

SELECT ok(
    (
        SELECT interests = '{}' FROM fake_learner_profiles
        WHERE age = 10
    ),
    'interests should default to empty array'
);

SELECT ok(
    (
        SELECT created_at IS NOT NULL FROM fake_learner_profiles
        WHERE age = 10
    ),
    'created_at should have default value'
);

SELECT ok(
    (
        SELECT updated_at IS NOT NULL FROM fake_learner_profiles
        WHERE age = 10
    ),
    'updated_at should have default value'
);

SELECT * FROM finish(); -- noqa: AM04
ROLLBACK;
