# Run tests through the npm scripts

Run specs with `npm run test:run` (a single file: `npm run test:run -- <path>`), never bare
`npx vitest run`, before calling a change green.

Why: the scripts set `SRCDEV_STANDALONE=true`, which loads modules (such as `nuxt-qrcode`) that a bare
run skips, so a bare run can pass while the user's `npm test` fails. A `CaptureQrCode` flake that
only appeared under that variable went unseen on 2026-10-21. Same variable as `nuxt-prepare.md`.
Detail: `.claude/skills/testing-add-unit-test.md`, "Stub third-party children that hold shared state".
