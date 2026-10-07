# Status tokens

Global status colours, declared on `:root` in `app/assets/styles/setup/03.theming/_status.css`.
Components that show a status (a dot, a badge, a pill) fall back to these, so a consumer restyles
every status indicator in the library from one place.

## The set

Each status has three roles:

| Role | Token | Use |
|---|---|---|
| Solid | `--status-<name>` | Dots, markers, small fills (mid-ramp step, visible on light and dark) |
| Surface | `--status-<name>-surface` | Tinted background of a badge or pill |
| Text | `--status-<name>-text` | Text/icon on that surface |

| Status | Solid | Surface / text | Meaning |
|---|---|---|---|
| `success` | `--green-06` | `--green-01` / `--green-10` | Good, active, online, complete |
| `warning` | `--orange-05` | `--orange-01` / `--orange-10` | Needs attention, pending, idle |
| `danger` | `--red-06` | `--red-01` / `--red-10` | Error, blocked, do not disturb |
| `info` | `--blue-06` | `--blue-01` / `--blue-09` | Informational, in progress, new |
| `neutral` | `--slate-05` | `--slate-01` / `--slate-09` | Inactive, offline, archived, draft |

Keep the set to these five. A domain-specific state (`pending`, `archived`, `in-progress`) maps
onto one of them rather than getting its own token; if a consumer genuinely needs a sixth colour,
they define it in their app and pass it wherever the component takes a colour (e.g. `dotColor`).

## Who reads them

The component's own token always wins, then the global status token:

| Component | Mapping |
|---|---|
| `DisplayChip` | `online` → success, `idle` → warning, `dnd` → danger, no class → neutral (solid) |
| `DisplayPill` | `success`/`warning`/`danger` variants → surface + text. `primary` (brand) and `neutral` (dark, inverted) do **not** read the set |
| `SelectMenu` | Nothing automatic; options pass `dotColor: "var(--status-success)"` etc. |

When adding a component that shows a status, default its colour tokens to these
(`var(--component-colour-online, var(--status-success))`), never to a palette step or hex value
directly.

## Overriding

```css
/* consuming app, unlayered */
:root {
  --status-success: #1f9d55;
  --status-success-surface: #e6f6ec;
  --status-success-text: #0f5132;
}
```

One component only: set its own token instead (`--display-chip-colour-online: hotpink`).

## Dark mode

Light values only, like every other layer token (no `light-dark()`). Storybook's dark values live
in `.storybook/color-scheme.css`: surfaces move to step `09`, text to step `02`; solids stay put.
A consumer app with a dark scheme copies those overrides (see `theming-dark-mode.md`).
