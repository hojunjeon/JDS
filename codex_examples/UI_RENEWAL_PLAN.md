# JDS UI Renewal Plan

This plan converts the `codex_examples` HTML screen drafts into an implementation path for the actual JDS game UI. The HTML files are reference prototypes, not production code.

Root plan index:

- `C:\Users\SSAFY\Desktop\JDY\PLANS.md`
- Keep the UI Renewal entry status in `PLANS.md` synchronized with this plan's `Progress checklist`.

## Session Handoff

If a Codex session resets, resume from this section first.

Current status:

- The UI renewal workflow has started from this plan and `codex_examples/index.html`.
- `DESIGN.md` remains the visual source of truth.
- Phase 1 is in progress.
- Completed first TDD slice: shared UI tokens are now in `src/ui/theme.ts`.
- Added tests in `tests/uiTheme.test.ts`.
- `src/scenes/MenuScene.ts` has been refactored to use the shared theme tokens and to better match the 01 Start / Boot Screen direction.

Progress checklist:

- [x] Create UI renewal plan from `codex_examples/index.html`.
- [x] Establish `DESIGN.md` as the visual source of truth.
- [x] Add shared UI theme tokens in `src/ui/theme.ts`.
- [x] Add theme tests in `tests/uiTheme.test.ts`.
- [x] Refactor `src/scenes/MenuScene.ts` to use shared theme tokens.
- [x] Apply the first 01 Start / Boot Screen production pass.
- [ ] Add typed Phase 1 menu-flow model in `src/ui/menuFlow.ts`.
- [ ] Add `tests/menuFlow.test.ts` for `start`, `stage-select`, and `weapon-select`.
- [ ] Implement tested transitions from start command to stage select to weapon select to game start.
- [ ] Wire `MenuScene` to render state-specific Phase 1 panels.
- [ ] Verify `Enter`, number keys, and pointer interactions across Phase 1 screens.
- [ ] Run focused tests, `npm test`, `npm run build`, and relevant Playwright desktop check.
- [ ] Mark Phase 1 complete only after 01/02/03 flow reaches gameplay.

Last verified state:

- `npm test` passed: 5 test files, 14 tests.
- `npm run build` passed.
- `npm run e2e` passed.
- Playwright desktop screenshot at `1440x900` confirmed the renewed menu renders without visible overlap.
- Mobile verification is intentionally skipped for this prototype pass.
- Vite still reports the existing chunk size warning; it is not a failure.

Files to inspect before continuing:

1. `DESIGN.md`
2. `codex_examples/UI_RENEWAL_HANDOFF.md`
3. `codex_examples/UI_RENEWAL_PLAN.md`
4. `codex_examples/index.html`
5. `src/ui/theme.ts`
6. `src/scenes/MenuScene.ts`
7. `tests/uiTheme.test.ts`

Next recommended TDD slice:

1. Add a small typed menu-flow model for Phase 1, probably under `src/ui/menuFlow.ts`.
2. Write tests first for screen states: `start`, `stage-select`, `weapon-select`.
3. Include transitions: start command -> stage select -> weapon select -> game start.
4. Only after the model passes tests, wire `MenuScene` to render different panels based on that state.
5. Keep `Enter`, number keys, and pointer interactions working.

Do not start Phase 2 HUD work yet. Finish Phase 1's start/stage/weapon flow first.

## Source Screens

Use `codex_examples/index.html` as the review deck.

| No. | Screen | Reference |
| --- | --- | --- |
| 01 | Start / Boot Screen | `01_start_screen_frontend_design.html` |
| 02 | Stage Select / Curriculum Pipeline | `02_stage_select_frontend_design.html` |
| 03 | Weapon Select / Source-File Arsenal | `03_weapon_select_frontend_design.html` |
| 04 | In-Game HUD | `04_in_game_hud_frontend_design.html` |
| 05 | Level Up / Upgrade Modal | `05_level_up_upgrade_modal_frontend_design.html` |
| 06 | Event / Quest Popup | `06_event_quest_popup_frontend_design.html` |
| 07 | Boss Warning | `07_boss_warning_frontend_design.html` |
| 08 | Stage Clear / Result | `08_stage_clear_result_frontend_design.html` |
| 09 | Game Over | `09_game_over_frontend_design.html` |
| 10 | Collection / Codex | `10_collection_codex_frontend_design.html` |

## Product Direction

The game UI should feel like a live IDE/debugger under pressure.

Adopt:

- Terminal and VS Code-like layout primitives.
- Compact state panels, status bars, file explorers, command prompts, debug logs, and quick-fix modals.
- Syntax-highlight colors from `DESIGN.md`.
- Short readable text fragments that communicate state: `tests passed`, `SPAWN_LOCK`, `Quick Fix`, `Process terminated`.
- UI effects only when they clarify danger, reward, selection, or timing.

Avoid:

- Decorative cards that do not communicate game state.
- Long text blocks during combat.
- Heavy scanlines over gameplay.
- Large effects that hide enemies, player position, HP, EXP, or boss tells.

## Implementation Phases

### Phase 1: Core Menu Flow

Target screens:

- 01 Start / Boot Screen
- 02 Stage Select
- 03 Weapon Select

Goal:

- Establish the full pre-run flow from boot to stage and weapon selection.
- Convert visual patterns into reusable menu components.

Likely components:

- `TerminalWindow`
- `StatusBar`
- `ExplorerList`
- `CommandButton`
- `CodePreview`
- `ScreenHeader`

Acceptance criteria:

- Player can start from the boot screen and reach gameplay.
- Stage and weapon selections are keyboard/mouse friendly.
- Locked stages and locked weapons are visually distinct but not visually noisy.
- Menu screens share typography, spacing, and status bar behavior.

### Phase 2: Runtime Overlay

Target screens:

- 04 In-Game HUD
- 06 Event / Quest Popup
- 07 Boss Warning

Goal:

- Make combat information readable while preserving gameplay visibility.
- Separate always-on HUD from temporary alert overlays.

Likely components:

- `RuntimeHud`
- `HpExpCluster`
- `WeaponCooldownStrip`
- `QuestToast`
- `DebugLogFeed`
- `BossWarningOverlay`

Acceptance criteria:

- HP, EXP, timer, stage, weapon, and warning state are readable at a glance.
- Quest/event UI does not block enemy patterns.
- Boss warning has strong impact, then clears cleanly into gameplay.
- Effects use short transitions and do not create persistent visual clutter.

### Phase 3: Decision and Result Screens

Target screens:

- 05 Level Up / Upgrade Modal
- 08 Stage Clear / Result
- 09 Game Over

Goal:

- Turn reward, failure, and retry moments into clear command decisions.
- Keep the coding theme while making choices fast to parse.

Likely components:

- `QuickFixModal`
- `UpgradeOption`
- `RunResultPanel`
- `FailureTrace`
- `RewardSummary`

Acceptance criteria:

- Level-up choices are comparable in one glance.
- Result screens clearly show rewards, unlocks, and next action.
- Game over screen gives retry and menu paths without ambiguity.

### Phase 4: Meta Progression

Target screen:

- 10 Collection / Codex

Goal:

- Create a durable archive for unlocked weapons, monsters, boss logs, and learning progress.

Likely components:

- `CodexExplorer`
- `EntryInspector`
- `UnlockProgress`
- `MonsterLog`
- `WeaponProfile`

Acceptance criteria:

- Entries are grouped by weapons, monsters, bosses, and curriculum.
- Locked content teases future discoveries without spoiling everything.
- The codex uses the same explorer/inspector language as stage and weapon selection.

## Shared UI System

Create or centralize these tokens before broad implementation:

```ts
const uiColors = {
  bg: "#1e1e1e",
  sidebar: "#252526",
  status: "#007acc",
  white: "#d4d4d4",
  dim: "#858585",
  teal: "#4ec9b0",
  blue: "#9cdcfe",
  green: "#b5cea8",
  yellow: "#dcdcaa",
  orange: "#ce9178",
  red: "#f44747",
  comment: "#6a9955",
};
```

Standardize:

- 1px panel borders using dim translucent color.
- 30px status bar height for menu-style screens.
- 8px or smaller radius unless a Phaser object needs a different shape.
- Monospace UI text for code surfaces and compact labels.
- Short CSS/Phaser transition durations: 120ms, 180ms, 320ms, 600ms.
- Z-depth rules for gameplay, HUD, modal, boss warning, and debug overlays.

## DOM vs Phaser Split

Prefer Phaser for:

- Gameplay HUD elements that need to follow camera/game state.
- Boss warning transitions tied to scene timing.
- Floating damage, combat effects, pickups, and telegraphs.

Prefer DOM overlay or React-style UI for:

- Start, stage select, weapon select, result, game over, codex.
- Upgrade modal if the game can pause cleanly while the DOM handles selection.
- Static menus, lists, inspectors, and long-form codex content.

Decision checkpoint:

- If a UI element must react every frame to gameplay, implement it in Phaser.
- If a UI element is mostly layout, selection, or text, implement it as DOM UI.

## Open Decisions

- Should the first weapon selection default to Python, or should the player choose between Python, C/C++, and Java on the first run?
- Should stage select show all six stages immediately, or only the current stage plus locked previews?
- Should the boss name appear before first encounter, or should the warning screen hide the identity until spawn?
- Should codex unlocks be available from the start screen, the result screen, or both?
- Should `Quick Fix` upgrade choices pause the game completely or slow time while enemies remain visible?

## Recommended Next Implementation Order

1. Extract shared UI tokens and panel/status primitives.
2. Implement Start screen using the 01 frontend-design reference.
3. Implement Stage Select and Weapon Select as one continuous menu flow.
4. Implement Runtime HUD with minimal debug log and quest slot.
5. Implement Quick Fix modal.
6. Implement Stage Clear and Game Over screens.
7. Implement Boss Warning overlay.
8. Implement Codex after core loop rewards/unlocks are stable.

## Verification Plan

For each implementation slice:

- Run `npm run build`.
- Run focused unit/component tests if state logic changes.
- Capture a desktop screenshot with Playwright at `1440x900`.
- For gameplay overlays, check that player, enemies, HP, EXP, timer, and active warnings do not overlap.
- Mobile verification is currently optional because the user approved skipping it for this prototype pass.

## Product Improvement Notes

- Convert the current HTML prototypes into a small design-review gallery before touching production scenes.
- Treat the HUD as the highest-risk screen because it competes with active combat readability.
- Keep the codex late in the schedule because it depends on final weapon, monster, boss, and unlock data.

## Codex Workflow Improvement Notes

- Work in screen batches instead of all-at-once implementation.
- Keep prototype files and production UI separate until a pattern proves reusable.
- Add screenshot checkpoints to every visible UI change.
- Use this plan as the handoff document before editing Phaser or DOM production files.
