# Smart SOPs

Internal tool for generating AI-powered Standard Operating Procedures.

## Local Setup

Install dependencies and start the dev server:

```bash
npm install --prefix smart-sops
npm run dev --prefix smart-sops
```

## Environment Variables

Fill in `env.example` at the repo root and `smart-sops/.env.example` for the frontend:

```bash
cp env.example .env
cp smart-sops/.env.example smart-sops/.env
```
Then edit the new files with your Supabase and OpenAI keys.

## Notice
For internal use only. Do not distribute this repository or generated content.
