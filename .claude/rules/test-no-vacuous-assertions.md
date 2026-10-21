---
paths:
  - "app/**/*.spec.ts"
---

# No assertions that can't fail

Never write `expect(wrapper.find(x)).toBeTruthy()`; assert `wrapper.find(x).exists()` (or the
attribute/text you care about). Never `vi.mock("#imports", ...)` to stub an auto-imported composable;
use `mockNuxtImport` (with `vi.hoisted`) or test the real composable's effect on the DOM. Never
`find("some-component")` by a component's tag name: a mounted Vue component renders its own root,
so the selector matches nothing and a `.exists()).toBe(false)` check always passes.

Why: `find()` returns a wrapper even when nothing matches, and a `#imports` mock doesn't apply under
`@nuxt/test-utils`, so both pass whatever the component renders. On 2026-10-21 the DashboardStatsGrid
and DashboardQuadGrid specs had 37 such assertions (one checked a class that never existed), and
CarouselFlip's `#imports` mock lacked `resetElementClasses` without anything noticing.
`CaptureQrCode`'s hidden-page test asserted `find("qrcodestream")` was absent, which held whatever
the component did.
Detail: `.claude/skills/testing-add-unit-test.md`.
