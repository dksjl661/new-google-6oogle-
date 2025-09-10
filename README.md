# 6oogle — a tiny search engine clone

6oogle is a minimal search UI that aggregates results from public sources to simulate a search engine experience.

## Run locally

```bash
npm install
npm run dev
```

Open the dev server URL printed in your terminal.

## Sources

- Wikipedia: anonymous public API
- Hacker News: Algolia HN API

## Project structure

- `src/providers/` — individual search providers
- `src/services/aggregate.ts` — aggregator combining and ranking results
- `src/App.tsx` — UI and search flow

## Add your own provider

Create a new module in `src/providers/` that exports `searchX(query, signal) => SearchResult[]` and add it to `aggregateSearch`.

## Notes

- Client-only demo; no tracking or persistence
- Ranking is naive and for demo purposes only
