# Blackjack Simulator - Next.js + TypeScript (Minimal)

This project is a minimal working implementation for the Blackjack (21) simulator requested.
It uses Next.js 13 (app router) + TypeScript and demonstrates:

- app/api/login/route.ts (Next Handlers) that checks a secret (`API_SECRET`) and returns a fake token;
- Client-side localStorage management for token and route protection;
- Integration with Deck of Cards API to shuffle and draw cards;
- Basic Blackjack logic (Hit, Stand, Ace = 1 or 11);

## Setup

1. Copy `.env.example` to `.env` and set `API_SECRET` to any value you'd like.
2. Run `npm install`.
3. Run `npm run dev` to start the dev server.
4. Open http://localhost:3000/login and login using any username and the password equal to the `API_SECRET` value.

## Notes

- This is a minimal educational scaffold. UI is simple and styling is minimal.
- The Deck of Cards API is called from client components (browser fetch) for simplicity.
