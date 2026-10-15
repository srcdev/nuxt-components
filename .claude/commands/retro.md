---
description: End-of-session retro — bring every consumer-facing doc in line with the code changed since the last release, then record learnings in skills, rules and memory
---

Run at the end of a long session (or any time) to answer "are the docs up to date?" without being
asked twice. The main job is part 1: every consumer-facing doc matches the code. Part 2 captures
anything worth keeping from the session. Don't stage, commit or push.

## 0. Work out the scope

Scope comes from git, not from memory of the conversation, so it also works after a context reset:

```bash
last=$(git log --grep='^chore(release)' -1 --format=%H)
git log --oneline "$last"..HEAD                       # committed since the last release
git status --short                                     # uncommitted, including untracked
git diff --name-only "$last" -- app/ .claude/ .vscode/ # every file touched in that range
```

Group the touched files by component folder (`app/components/<tier>/<family>/`). Shared files count
too: a change to `app/types/components/`, `app/composables/`, `app/utils/` or a global style file
puts every component that uses it in scope. Say in one line which components are in scope before
starting.

## 1. Consumer-facing docs (fix directly)

"Consumer-facing" means what a developer or AI agent using the layer reads: each component's
`CONSUMER-STYLING.md`, its skill doc in `.claude/skills/components/`, its VS Code snippet in
`.vscode/`, `.claude/skills/index.md`, and the docs text inside its stories. For every component in
scope, read the `.vue` file(s) as they are now and check each doc against them. Fix what's wrong in
place; this part doesn't need approval.

**Tokens** (`CONSUMER-STYLING.md`). List the public tokens actually declared and the ones documented,
and compare:

```bash
f=app/components/<tier>/<family>/<Name>.vue; d=$(dirname "$f")/CONSUMER-STYLING.md
grep -oE -- '--[a-z][a-z0-9-]*' "$f" | sort -u > /tmp/retro-code   # any public --name, read or set (a var( can span lines)
grep -oE '`--[a-z][a-z0-9-]*`' "$d" | tr -d '`' | sort -u > /tmp/retro-doc
comm -23 /tmp/retro-code /tmp/retro-doc   # in code, not documented
comm -13 /tmp/retro-code /tmp/retro-doc   # documented, gone from code
```

Read the result with judgement. Tokens owned by another component (`--eyebrow-text-*`), global
theme tokens (`--theme-*`, `--colour-*`) and tokens documented as a scale shorthand
(`-xs` / `-s` / `-md`) show up as false positives. Then check by eye:

- each default in the doc matches the fallback in the code;
- the private `--_` token list matches the code;
- state hooks (`data-*` attributes, inner class names) match the template;
- every behaviour change has a dated `> Changed YYYY-MM-DD` note saying what a consumer must change;
- the fixed layout from compliance checklist item 4 still holds (`## Local overrides` present,
  sections in order, adjacent changelog blockquotes merged with a `>` line so markdownlint's
  MD028 stays quiet).

**Props, slots, emits, models** (skill doc and snippet). Compare the `interface Props`,
`withDefaults` defaults, named and dynamic slots, slot props, `defineEmits` and `defineModel` with
the skill doc's tables and examples. Check that the snippet uses only props and slots that exist,
in hyphenated template form, and covers any new variant worth a snippet.

**Stale references.** Grep the whole repo for every prop, token, class, slot, story name or file
that was removed or renamed in the range:

```bash
grep -rn "<old name>" app .claude .vscode --include='*.md' --include='*.ts' --include='*.vue' --include='*.code-snippets'
```

Look in other components' docs too (a parent that renders this one, a sibling that links to it).

**Stories as docs.** Story descriptions and in-canvas notes must describe what the story actually
does now: prop names, token names, story names they link to. Components used in a story template
must be registered in `components: {}` (`storybook-add-story.md`).

**Index.** Every component in scope has a one-line entry in `.claude/skills/index.md` that still
describes it.

**Public text rules.** In anything that ships with the package (docs, stories, snippets, comments):
no consumer app, client name, town or domain (sample copy uses placeholders like "Alex Morgan" /
"Northtown"), and no em dashes in visitor-facing default copy (developer docs are fine).

Then run the ledger so the scored checks agree:

```bash
node .claude/component-ledger/build.mjs
```

and confirm each in-scope component's row is still fully compliant (`score: 5` and every flag
`false`).

## 2. Learnings (decide and record)

Look back over the session for things a future session would want to know. Good candidates: a bug
whose cause wasn't obvious, a correction the user made, a pattern that worked and should be
repeated, a check that would have caught a problem earlier, a rule that turned out to be wrong.
Skip anything the code, git history or an existing doc already records.

Sort each one by where it belongs:

| Destination | What goes there |
|---|---|
| `.claude/rules/*.md` | A one-sentence constraint that must hold every time matching files are touched (`paths:`-scoped, links its skill); see CLAUDE.md "Where knowledge goes"; under `consumer/` if it also holds in apps extending the layer (that folder ships) |
| `.claude/skills/*.md` | How-to and patterns for working in this layer; ships with the repo |
| `CLAUDE.md` pitfalls | Incident history for a trap, as a numbered pointer to its rule (the constraint itself goes in a rule) |
| `.claude/skills/component-compliance-checklist.md` | A check every component should pass |
| `/migrate-component` or `/new-component` | A step those commands should take |
| Private memory | Anything naming a consumer app, user preferences, pending consumer edits |

Check each destination for an existing entry first and update it rather than adding a duplicate.
Then write them: decide yourself what's worth keeping and record it, without asking for approval
first (the user would approve them anyway). Leave out anything trivial or already covered. List what
you recorded, and where, in the report so the user can strike anything they disagree with. Consumer
names and pending consumer-repo edits only ever go to private memory.

## 3. Report

Finish with a short report:

- components checked, and per component which docs changed (or "up to date");
- stale references fixed elsewhere;
- learnings recorded, and where (one line each, so any can be reverted);
- anything left undone and why (e.g. consumer-repo edits, which are listed in private memory and
  never applied from here). A gap in an in-scope component's own files (its spec, stories,
  snippet, docs) doesn't belong here: fix it before reporting. Only decisions for the user and
  consumer-repo edits stay open.

Mention that `/create-commit-message` will pick the doc changes up with the code.
