BEGIN;
SELECT plan(9);

-- Table
SELECT has_table(
    'source_materials',
    'source_materials table should exist'
);

-- Columns
SELECT col_type_is(
    'source_materials', 'id', 'uuid',
    'id should be uuid'
);
SELECT col_type_is(
    'source_materials', 'title', 'text',
    'title should be text'
);
SELECT col_type_is(
    'source_materials', 'markdown', 'text',
    'markdown should be text'
);

-- Primary key
SELECT col_is_pk(
    'source_materials', 'id',
    'id should be primary key'
);

-- Constraints
SELECT col_not_null(
    'source_materials', 'title',
    'title should not be null'
);
SELECT col_not_null(
    'source_materials', 'markdown',
    'markdown should not be null'
);

-- Triggers
SELECT has_trigger(
    'source_materials', 'handle_updated_at',
    'handle_updated_at trigger should exist'
);

-- (Setup: Insert a row to test defaults)
INSERT INTO source_materials (title, markdown)
VALUES ('Hello World', 'Hello, world.');

-- Default column values
SELECT ok(
    (
        SELECT id IS NOT NULL FROM source_materials
        WHERE title = 'Hello World'
    ),
    'id should have default value'
);

SELECT * FROM finish(); -- noqa: AM04
ROLLBACK;
