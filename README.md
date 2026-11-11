# chadinasser.dev

Personal portfolio of Chadi Nasser, a backend, DevOps, and AI engineer based in Tripoli, Lebanon.

The site is a fully static Astro build with no tracking and no client-side framework JavaScript. The only scripts are a small header scroll behavior and a print handler on the CV page. It uses a Carbon-inspired design system: IBM Plex Sans and Mono, an 8px spacing grid, 0px radii, and a single blue accent.

## Stack

- Astro 7 (static output)
- TypeScript
- Plain CSS with Carbon-style tokens
- IBM Plex Sans and IBM Plex Mono, self-hosted through Fontsource
- Bun for installs, scripts, and local development
- Docker multi-stage build served by nginx

## Commands

```sh
bun install
bun dev
bun run build
bun run preview
```

`bun run build` runs `astro check` before generating the static site into `dist/`.

## Content

- Profile, experience, education, certifications, projects, and contact data live in `src/data/site.json`.
- The CV at `/cv` is generated from the same data and is print-friendly.

## Deployment

The included `Dockerfile` builds the site with Bun and serves `dist/` through nginx on port 8080. nginx handles compression, long-lived caching for hashed assets, security headers, and redirects from the old `/project` and blog URLs to their current pages.
