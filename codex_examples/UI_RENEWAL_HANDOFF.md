# JDS UI Renewal Handoff

Use this file when a new Codex session needs to continue the UI renewal work without relying on previous chat context.

## Required Reading Order

1. `AGENTS.md`
2. `.codex/skills/jds-development-workflow/SKILL.md`
3. `.codex/skills/jds-ui-review/SKILL.md`
4. `DESIGN.md`
5. `codex_examples/UI_RENEWAL_PLAN.md`
6. `codex_examples/index.html`

Use `frontend-design` again only when creating or significantly reshaping visible UI.

## Current Goal

Implement the UI renewal plan in production code, using the 01-10 HTML prototypes as visual references. The production UI should stay consistent with `DESIGN.md`: dark terminal/IDE surfaces, VS Code-like syntax colors, compact panels, command-style actions, and readable debug/game state.

Use the `Progress checklist` in `codex_examples/UI_RENEWAL_PLAN.md` as the single source of truth for task status. This handoff file explains how to resume, but completion checks should be updated in the plan.

## Current Production State

Completed:

- Added shared UI theme module: `src/ui/theme.ts`
- Added tests for the theme module: `tests/uiTheme.test.ts`
- Refactored `src/scenes/MenuScene.ts` to use shared tokens.
- Updated the start/menu screen toward the `01_start_screen_frontend_design.html` direction.

Preserved behavior:

- `Enter` starts the game.
- `1`, `2`, `3` choose Python, C/C++, Java.
- Pointer click on weapon cards still changes selection.
- Pointer click on the start command still starts the game.

Known worktree context:

- `codex_examples/` is untracked and contains the prototype/reference files.
- There are unrelated dirty files outside this UI slice. Do not revert them.
- The relevant current UI files are:
  - `src/ui/theme.ts`
  - `src/scenes/MenuScene.ts`
  - `tests/uiTheme.test.ts`
  - `codex_examples/UI_RENEWAL_PLAN.md`
  - `codex_examples/UI_RENEWAL_HANDOFF.md`

## Last Verification

Run results from the previous session:

```text
npm test
5 test files passed, 14 tests passed

npm run build
passed
Vite chunk size warning remains

npm run e2e
1 Playwright test passed
```

Manual visual check:

- Playwright desktop screenshot at `1440x900`.
- Menu rendered correctly.
- No visible text overlap in the renewed menu.
- Mobile check was skipped because the user approved skipping mobile verification for this prototype pass.

## Workflow Rules For Continuation

For each production UI slice:

1. Read the relevant section in `UI_RENEWAL_PLAN.md`.
2. Brainstorm the smallest useful slice.
3. Write a failing Vitest test first when state, data, or transition logic changes.
4. Implement the minimum production code to pass.
5. Run focused tests.
6. Run `npm test`, `npm run build`, and relevant Playwright check before completion.
7. Report product improvement and Codex workflow improvement.

For docs-only changes, TDD is not required, but still verify by checking file references and formatting.

## Next Recommended Slice

Do this next:

1. Create a typed Phase 1 menu flow model.
2. Suggested file: `src/ui/menuFlow.ts`
3. Suggested test file: `tests/menuFlow.test.ts`
4. Model states:
   - `start`
   - `stage-select`
   - `weapon-select`
5. Model events:
   - `boot.complete` or `start.confirm`
   - `stage.select`
   - `stage.confirm`
   - `weapon.select`
   - `weapon.confirm`
   - `back`
6. Expected default:
   - current screen: `start`
   - current stage: Stage 1
   - current weapon: `python`

After this passes, update `MenuScene` to render state-specific panels:

- `start`: boot terminal and command prompt
- `stage-select`: six-stage curriculum pipeline
- `weapon-select`: starter source-file arsenal

## Stop Conditions

Pause and ask the user before:

- Replacing Phaser menu UI with a DOM/React overlay.
- Changing game progression rules.
- Removing starter weapon choice.
- Changing `DESIGN.md` direction.
- Touching Git commit or push workflow.

## Product Direction Reminder

Prioritize readability over decoration. The UI should feel like a debugger that the player can act through, not a static concept poster.
