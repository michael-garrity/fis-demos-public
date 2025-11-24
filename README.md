# Demo Applications

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase

[Supabase](https://supabase.com/docs) is a Postgres-based backend as a service. The backend for this project is in the [fis-demos-backend project](https://supabase.com/dashboard/project/xinjcpftgvjwpiunyixq).

While the `./supabase` directory in this repo could be elsewhere (e.g. it's own repo), we've opted to keep it together until we have a case for moving it.

### Migrations

Generate migrations using the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started):

```bash
npx supabase migration new [name_of_migration]
```

Open the file generated and write the migration, considering best practices for data (constraints, indexes, unique indexes, timestamps, etc). When your migration is ready, lint and format it with `npm run lint:sql`, then perform the migration locally:

```bash
npx supabase migration up
```

When merged to `main`, the migration will run automatically in the Supabase production environment.

### DB lint & test

The Supabase CLI includes [tools to test and lint the DB](https://supabase.com/docs/guides/local-development/cli/testing-and-linting).

## Development

### Prerequisites

- [Node](https://nodejs.org/en) with [NPM](https://www.npmjs.com/)

#### Recommended

Configure your text editor with the following linters:
- [ActionLint](https://github.com/rhysd/actionlint) NOTE: this is not included as a direct dependency of the project. You can install it with [Homebrew](https://formulae.brew.sh/formula/actionlint).
- [ESLint](https://eslint.org/)
- [SQLFluff](https://www.sqlfluff.com/) NOTE: this is not included as a direct dependency of the project. You can install it with [Homebrew](https://formulae.brew.sh/formula/sqlfluff).
- [YAMLLint](https://github.com/adrienverge/yamllint) NOTE: this is not included as a direct dependency of the project. You can install it with [Homebrew](https://formulae.brew.sh/formula/yamllint).

### Pre-commit

We use [Husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/lint-staged/lint-staged) to run checks on changed files before committing.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js)
