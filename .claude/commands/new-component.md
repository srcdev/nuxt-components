---
description: Create a new component that meets the compliance standard from the start (brief, spec, tier, naming, tokens, styling doc, tests, story, skill doc, snippet)
---

Build a new component to the standard in `.claude/skills/component-compliance-checklist.md`, so it
lands in the Component Ledger fully compliant instead of joining the `/migrate-component` backlog.
For an existing component, use `/migrate-component` instead.

## 1. Get the brief

If the user passed a description as the argument, treat it as the brief: skip straight to asking
only about the gaps that matter (step 1 of the spec can't be written without them), in one message.

Otherwise, print this template in a fenced block and wait for the reply. Any section can be left
blank or answered "you decide"; fill those with a proposal in the spec rather than asking again.

```markdown
## What it does
Purpose, and where it would typically be used.

## References
Existing library components to borrow patterns or UI from (and what to take from each),
plus any outside example: URL, screenshot, design system component.

## Acceptance criteria
- The behaviour it must have, one per line.

## API in mind
Props, slots, v-models, events.

## Interaction and a11y
Keyboard behaviour, roles, focus handling, motion.

## Layout
How it responds to container or viewport size.

## Theming
What you expect to customise (colours, spacing, sizes, radii, durations).

## Out of scope
Things it should not do.

## Shape and tier (optional)
Control only, or control + labelled Field wrapper; which tier (01.atoms to 05.forms).
```

Don't use `AskUserQuestion` for the brief itself (it's limited to a few fixed options); use it
afterwards only for a genuine either/or, such as named vs indexed dynamic slots
(`component-dynamic-slots.md`).

If the brief names a consumer site or client, use it to understand the context but never write
that name into any repo file (`feedback_no_consumer_names_in_public_text`).

## 2. Research before proposing

- Read every library component the brief references: its `.vue`, `CONSUMER-STYLING.md` and skill
  doc. Note what to reuse directly (compose it) versus what to copy as a pattern.
- Check `.claude/skills/components/` and `app/components/` for anything that already does most of
  this, or that the new component should be built from (`FormField`, `InputButton
  variant="inline"`, `ExpandingPanelClassic`, `DisplayPill`, etc.). If an existing component
  covers most of the brief, say so and propose extending it (via `/migrate-component` if it isn't
  compliant yet) instead of building a near-duplicate, and stop there unless the user still wants a
  new one.
- For an outside reference, fetch or view it if one was given, and take behaviour and structure
  from it, not its markup or class names.

## 3. Play back the spec and get approval

Reply with a short spec, then wait for approval or changes before writing any file:

1. **Names, tier and folder**: `<Name>` / `<Name>Field` per checklist item 13 and
   `component-naming.md` (multi-word, not an HTML element name, not a bare common word a
   consuming app might also define; grep `app/components/` to rule out a clash), and
   `app/components/<tier>/<family>/`.
2. **API table**: every prop (type, default), slot, model and event. Visitor-facing strings are
   props with English defaults (checklist item 10).
3. **Public tokens**: the planned `--<family>-*` tokens and their defaults, from the Theming answer
   plus anything else consumer-relevant (checklist item 3).
4. **References**: each component or example read, and what's being taken from it.
5. **Acceptance criteria**: numbered (AC1, AC2, ...), each with the test(s) and story that will
   prove it. Add criteria the checklist implies but the brief didn't state (keyboard, focus,
   reduced motion, pause for auto-advancing content) and mark them as added.
6. **Proposals**: anything the user left as "you decide", stated as a choice, not a question.
7. **Out of scope**: carried over from the brief.

Revise and replay the spec until the user approves it. The approved spec is the build contract:
if something in it turns out to be wrong during the build, stop and say so rather than quietly
deviating.

## 4. Scaffold

Create, under `app/components/<tier>/<family>/`:

```text
<Name>.vue
<Name>Field.vue                 (if it has a labelled wrapper)
CONSUMER-STYLING.md
stories/<Name>.stories.ts
tests/<Name>.spec.ts
tests/<Name>Field.spec.ts       (if it has a wrapper)
```

plus, outside the component folder:

- `.claude/skills/components/<family>.md` (Field documented under "Variants"). Its "Overview"
  comes from the spec's purpose, and a "Behaviour" section lists the acceptance criteria as plain
  statements (without AC numbers), so the intent outlives the conversation.
- `.vscode/srcdev-component-<family>.code-snippets`
- `app/types/components/<family>.d.ts` + export from `app/types/components/index.ts`, only if
  consumers need to import a type

Model each file on a recently migrated component in the same tier rather than writing from a
blank page; `05.forms/input-number/` is the reference for a control + Field pair. Name test cases
so each acceptance criterion's test is recognisable (e.g. `it("closes on Escape")` for "Escape
closes it"), without putting AC numbers in the repo.

## 5. Work the checklist

Work through every item in `.claude/skills/component-compliance-checklist.md` as a build spec.
Ignore the notes marked **Existing component**. Skip an item only when it genuinely doesn't apply,
and say why briefly.

## 6. Wrap up

- Run `npm run prepare` (never bare `npx nuxt prepare`) so `.nuxt/components.d.ts` picks up the new
  component, and tell the user to restart Storybook: a running Storybook keeps its startup
  component scan, so the new component renders as an empty unknown element until it restarts.
- Run the new test file(s), `npx eslint <new files>`, and `npx vue-tsc`.
- Run `node .claude/component-ledger/build.mjs` and check the new component's row in
  `.claude/component-ledger/audit.json` passes as described at the top of the checklist. Fix
  anything it flags before finishing.
- Report each acceptance criterion as met (with the test or story that shows it) or not met (with
  why). Anything only visible in the browser (layout, motion, focus styling) is listed as "check in
  Storybook" with the story name, not claimed as met.
- Summarize what was created and anything deliberately skipped (with reasons).
- Don't stage, commit, or push; that's the user's call. Suggest `/create-commit-message` next.
