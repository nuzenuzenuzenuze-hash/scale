# SCALE — Content Operations CRM

Dashboard central de operaciones de contenido para escalar marcas personales.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Supabase (Auth + DB + Storage + Realtime)
- Docker

## Quick Start

```bash
cp .env.example .env
# Fill in your environment variables
docker-compose up -d --build
```

App runs at `http://localhost:3000`

## Production

Deployed to `https://scale.nuzelab.com` via Docker on Hetzner.

```bash
docker-compose up -d --build
```
