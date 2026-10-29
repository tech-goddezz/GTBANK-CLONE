# GTBank Clone — Pixel-Perfect Design Work

The owner is a beginner and will work with Claude over many conversations. Read this file at the start of every conversation and follow every rule.

## Project goal

- Make every screen of this Expo / React Native app match the design exactly: layout, spacing, sizes, fonts, colours, icons, images, corner radius, shadows and text content.
- Build any screen that exists in the design but not in the app.

## Where the design is

- **Main reference: the PDFs in `design/`.** Each PDF is one board with several screens (for example "Sign in.pdf", "Settings flow.pdf", "Kyc flow.pdf"). They are vector exports from Figma, so 1 PDF unit = 1 Figma pixel and exact sizes can be measured from them. There is no Python or poppler on this machine; use Node to read their drawing commands.
- **Backup: the screenshots in `design/figma-screenshots/`.** Check them only when a PDF is unclear.
- **Do not use the Figma connection (MCP).** It is signed in as a different account with no access to the design file. Don't retry it.
- **Phone frame size: 393 x 852.**
- `design/` and `PIXEL-PERFECT-GUIDE.md` are gitignored. Never commit them.

## How to work (VERY IMPORTANT)

1. Work on ONE screen or ONE shared component at a time. Never change multiple screens in one go unless the owner asks.
2. Before changing anything, first give a numbered list of every difference found between the design and the current code, in plain English. Then STOP and wait for the owner to say "go ahead".
3. After making changes, tell the owner in simple words what changed, and give the web address to view that screen (e.g. http://localhost:8081/home).
4. Do not mark a screen as done until the owner has looked at it and confirmed it matches.
5. After the owner confirms a screen, update `DESIGN-TRACKER.md` and remind them to save a checkpoint.
6. Never change the backend, login logic, database calls, Supabase code, the `services/` folder, the `store/` folder, or the `supabase/` folder unless the owner explicitly asks. This work is about how things LOOK, not how they work.
7. Don't add new libraries/packages without asking first and explaining why.
8. Reuse the existing shared pieces: colours from `constants/colors.ts`, fonts from `constants/typography.ts`, and the components in `components/`. If the design uses a value that isn't there yet, add it to those files instead of typing the raw value into a screen.
9. If something in the design is unclear (e.g. a missing icon or an unknown colour), ask the owner instead of guessing.
10. Explain things as if to a non-programmer. Keep explanations short.
11. If the owner reports that something broke, fix that before doing anything new.

## Current progress

See DESIGN-TRACKER.md for what's done and what's next.
