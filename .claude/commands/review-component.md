---
description: Independent whole-component review by a fresh subagent (component plus its supporting cast), verified and recorded in the ledger
---

A whole-component review asks "is this component sound?", not "do the docs match the last diff?"
(that's `/retro`) or "does it have every required file?" (that's the ledger). It finds what neither
of those can see: props that are silently ignored, state shared between instances, ARIA roles that
promise behaviour the component doesn't have, CSS with no Safari 16 path, stale comments. The first
one (ResponsiveHeader and SiteHeader, 2026-10-24) found all of these in a component that scored 5/5.

The review runs in a subagent so it starts with none of this session's context: no memory of what
was "already fixed", what we think is fine, or why the code is the way it is. Keep it that way.

## 1. Resolve the component and its supporting cast

Resolve the argument against `app/components/` as `/migrate-component` does (folder or `.vue`
name, case-insensitive; ask if it's ambiguous). Then list, as paths only:

- every file in the component folder: `.vue` files, `tests/`, `stories/`, `CONSUMER-STYLING.md`;
- its skill doc (`.claude/skills/components/`), its snippet (`.vscode/`), its types
  (`app/types/components/`);
- composables and utils it calls (`grep -oE 'use[A-Z][A-Za-z]+\(' <files>`, resolve under
  `app/composables/` and `app/utils/`);
- child components it renders, and parents that render it (`grep -rln "<Name" app/components`).
  Parents matter: a wrapper that forwards some props but not others is a finding.

## 2. Spawn the reviewer

Use the Agent tool, `subagent_type: "general-purpose"`, with the prompt below. Fill in only the
component name and the file list. **Add nothing else:** no findings from this session, no "X was
recently fixed", no opinion on what's fine, no summary of the component. Anything you add is a
bias the reviewer can't see past.

> You are an independent reviewer seeing this Vue/Nuxt component for the first time. Nobody has
> told you what is wrong with it, and you shouldn't assume anything is right. This is a
> read-only task: don't edit any file.
>
> Component: `<Name>`. Files: `<file list>`. Repo conventions are in `CLAUDE.md` and
> `.claude/rules/` (constraints) and `.claude/skills/` (how-to). Safari 16 must work for anything
> load-bearing.
>
> **Treat every doc and comment as a claim to check, not as truth.** Skill docs, CONSUMER-STYLING,
> code comments and test names describe what someone believed. A comment explaining why something
> is fine is not evidence that it is. If a repo rule itself looks wrong for this component, say so.
>
> **Pass 1, open read.** Read the component and its supporting cast end to end before looking at
> any checklist. Note anything that looks wrong, odd or fragile.
>
> **Pass 2, lenses.** Then check each of these, as a minimum, not a limit:
>
> 1. Every prop: trace it from declaration to effect. Is it honoured, or overwritten, ignored or
>    read once at setup so later changes are missed? Do defaults match the docs?
> 2. Several instances on one page: ids, `name`s, CSS anchor names, `useState` keys, module-level
>    variables. Is anything shared that shouldn't be?
> 3. Lifecycle: listeners, timers, observers cleaned up on unmount; behaviour when the component
>    outlives a route change; prop and slot changes after mount.
> 4. Input: mouse, touch and keyboard separately, including event order (pointerdown, focus,
>    click) and keys that must not trigger anything.
> 5. Accessibility: do the roles and ARIA promise only what the component actually implements?
>    Landmarks, labels, expanded state, focus handling, reduced motion.
> 6. Browser support: any CSS or JS that is load-bearing but missing in Safari 16.
> 7. Data: empty, missing, duplicated, very long or very many values; consumer data mutated;
>    `v-for` keys unique.
> 8. Supporting cast: composables, types, children and parents agree with the component; wrappers
>    forward every prop they should; stories, snippet and docs describe the current code.
> 9. Tests: do they assert something that could fail? What behaviour above has no test?
> 10. Stale or misleading comments.
> 11. CSS against the markup: does every positional selector (`:last-child`, `:nth-child`, `+`,
>     `~`) match what the template actually renders, siblings included? How do floating panels size
>     and place themselves near each edge? Is every position or state a rule targets rendered by
>     some story, so a broken rule would be visible?
>
> **Report.** For each finding: severity (high, medium, low), `file:line`, a one-line claim, and a
> concrete failure scenario (this input or state gives this wrong result). Mark each one
> "certain" or "suspected". Leave out pure style preferences. Then list, briefly, the areas you
> checked and found sound, so silence isn't ambiguous. Don't propose a rewrite; a short fix
> suggestion per finding is enough.

## 3. Verify, without filtering

When the report arrives, check each finding against the code yourself (read the lines, and run a
quick test where reading isn't enough). Give each one a verdict:

- **Confirmed**: you reproduced it or the code plainly does what the finding says.
- **Plausible**: you couldn't confirm or rule it out.
- **Disagree**: say exactly why, with `file:line`. "It was designed that way" isn't a reason; the
  design may be the bug.

Never drop a finding silently, and never soften one. The user sees every finding the reviewer
made, with the reviewer's claim in its own words next to your verdict. Your verdict is a second
opinion, not a filter: confirmation bias lives in this step, so lean towards Plausible over
Disagree when in doubt.

## 4. Present and apply

Present a table: severity, finding (reviewer's words), `file:line`, your verdict and reason. Then
use AskUserQuestion: **Apply confirmed** (recommended), **Apply confirmed and plausible**, **I'll
pick** (wait for the user's list), **Don't apply**.

Apply the chosen fixes with the definition of done (`component-definition-of-done.md`): tests that
fail before the fix where practical, stories, snippet, skill doc and CONSUMER-STYLING.md updated in
the same change, a dated `> Changed` note for anything a consumer must change. Run
`npm run test:run -- <paths>` and `npx eslint <touched files>`.

## 5. Record it

Set the component's `compdir` (as the ledger writes it, e.g. `03.organisms/responsive-header`) to
today's date in `.claude/component-ledger/reviews.json`, also when the review found nothing. Record
parents or children that were reviewed and fixed along with it too. Then run
`node .claude/component-ledger/build.mjs` and republish `output.html` to the Component Ledger
artifact.

Report what the reviewer found, what was applied, and anything left for the user to decide. Don't
stage, commit or push.
