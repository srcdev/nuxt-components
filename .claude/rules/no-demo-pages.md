# Storybook is the only demo surface

Never add a page under `app/pages/` or a layout under `app/layouts/` to demo a component; add or
update its Storybook story. Delete any leftover demo page or layout you find, and grep for routes
pointing at it (prop defaults, skill-doc "Demo page:" lines).

Why: demo pages shipped with the layer package to every consuming app.
Detail: `.claude/skills/storybook-add-story.md`.
