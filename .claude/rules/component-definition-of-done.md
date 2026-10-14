# Component definition of done

A new or changed component isn't done until its tests, Storybook story, VS Code snippet
(`.vscode/srcdev-component-{name}.code-snippets`), skill doc (`.claude/skills/components/`) and
`CONSUMER-STYLING.md` all match the code, in the same change.

Why: skills and snippets are what agents and developers use the component from; stale ones teach
wrong usage. Detail: `.claude/skills/component-compliance-checklist.md`; use `/new-component` or
`/migrate-component`.
