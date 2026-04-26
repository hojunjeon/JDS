---
name: jdy-ui-review
description: Use when reviewing or improving JDY screens, HUD, menus, responsive layout, visual hierarchy, UI controls, accessibility, or browser screenshots.
---

# JDY UI Review

Use this skill for UI quality checks in the JDY project.

## Design Reference

Before reviewing or changing screens, HUD, menus, layout, visual hierarchy, controls, or screenshots, read root `DESIGN.md`.

If the request conflicts with `DESIGN.md`, explain the conflict and ask whether to update the design guide.

## UI Standards

- Build the usable screen first, not a marketing page.
- Keep controls predictable, compact, and readable.
- Use stable dimensions for HUD, buttons, boards, panels, counters, and game UI.
- Avoid overlapping text or controls on desktop and mobile.
- Preserve existing style unless the task explicitly changes direction.
- Prefer icons for common tool actions when the project has an icon set.
- Keep cards for repeated items, modals, or framed tools; avoid nested cards.

## Verification

When relevant, verify with:

- `npm run build`
- Component or unit tests
- Playwright/browser screenshots
- Desktop and mobile viewport checks

## Output

Report:

- What changed visually
- What was verified
- Any remaining UI risks
- One or more concrete UI improvement suggestions
