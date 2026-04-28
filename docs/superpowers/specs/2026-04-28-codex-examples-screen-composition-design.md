# Codex Examples Screen Composition Alignment Design

Date: 2026-04-28

## Context

The current JDS UI already borrows colors, terminal styling, and some DOM overlay structure from `codex_examples/`, but the screen composition is not strong enough yet. The reference screens are most effective when they feel like one IDE/debugger workspace: titlebar, explorer/sidebar, tabbed central work area, right-side inspector or actions, and bottom status bar.

`codex_examples/index.html` is a review deck, not a production game screen. The implementation target is therefore the composition language demonstrated by `codex_examples/01` through `10`, not the review deck page itself.

## Goal

Strengthen the implemented core screens so they clearly follow the `codex_examples/` screen composition while keeping gameplay readable and avoiding a broad rewrite.

Primary implementation scope:

- Start screen, matching `01_start_screen_frontend_design.html`
- Stage select, matching `02_stage_select_frontend_design.html`
- Weapon select, matching `03_weapon_select_frontend_design.html`
- In-game HUD/runtime overlay, matching `04_in_game_hud_frontend_design.html`
- Quick Fix upgrade modal, matching `05_level_up_upgrade_modal_frontend_design.html`
- Stage clear and game over, matching `08_stage_clear_result_frontend_design.html` and `09_game_over_frontend_design.html`
- Collection/Codex, matching `10_collection_codex_frontend_design.html`

Out of primary implementation scope:

- Full new gameplay systems
- New stage progression mechanics
- New weapon stat systems beyond UI presentation
- Rebuilding all monster, weapon, or effect art

The event toast and boss warning screens, `06` and `07`, should not be ignored. They should inherit the same composition rules and be adjusted only where they already exist or where a small polish pass is needed. They are not the main source of complexity for this pass.

## Success Criteria

- The implemented screens visibly share the same IDE workspace structure from `codex_examples/`.
- Each core screen has a clear layout role: explorer/sidebar, central editor/work area, inspector/action area, and status/navigation area where appropriate.
- The UI uses consistent VS Code-like color tokens from `DESIGN.md`.
- The Korean or English copy is readable and contains no mojibake or placeholder text.
- Gameplay HUD remains compact and does not block player/enemy readability.
- Existing menu, gameplay, decision, result, and codex flows still work.
- Verification includes unit tests, build, Playwright flow, and screenshot inspection at 1440x900.

## Recommended Approach

Use option 2 from brainstorming: align the currently implemented core screens first, while defining shared composition rules that make the remaining screens easy to implement later.

This is better than implementing all 10 screens at once because it improves the visible game quickly without creating shell screens that are not backed by real gameplay state. It also gives the project a reusable UI grammar: future screens can be added by filling existing layout slots instead of inventing a new design from scratch.

## Composition Rules

All DOM-heavy screens should use a common shell pattern unless gameplay readability requires a lighter overlay:

- Titlebar: macOS-style dots, current virtual path, compact state label when useful.
- Left explorer: file tree, stage list, weapon files, codex groups, or decision categories.
- Center workspace: tab strip, main title or command surface, primary content.
- Right inspector: selected item details, mission briefing, selected weapon, reward/result actions.
- Bottom statusbar: reference filename, input hint, current mode, or short run state.

The goal is not to make every screen identical. The goal is for the player to immediately understand that all screens belong to the same debug-survival IDE.

## Screen-Level Design

### Start Screen

The start screen should feel like booting the game from a terminal workspace. It should keep the explorer on the left, a large boot/title area in the center, mission briefing on the right, and a statusbar at the bottom.

Required improvements:

- Fix broken Korean text.
- Rebalance the lower action row so `start debug` and `open codex` feel intentional, not bolted on.
- Keep the boot log and command preview visually connected to the central boot sequence.

### Stage Select

Stage select should look like a curriculum pipeline editor. Locked stages can remain visible, but the selected stage must be visually dominant and the right inspector should explain the selected stage in readable copy.

Required improvements:

- Fix broken Korean text.
- Make tab/header spacing closer to the reference.
- Ensure locked stages are secondary without becoming unreadable.

### Weapon Select

Weapon select should feel like choosing a source file. The current structure is close, but the effect preview is still too plain.

Required improvements:

- Keep weapon files in the left explorer.
- Keep source/code preview in the center.
- Improve the right or center preview area so each weapon feels like a distinct file/effect selection, even before full weapon art exists.

### Runtime HUD

The HUD must remain Phaser-based or otherwise gameplay-safe because it updates during combat. It should borrow the compact debug-console composition from the reference, but it must not become a large DOM-style panel that hides action.

Required improvements:

- Keep status, HP, kills, timer, weapon, events, and boss state compact.
- Preserve readable combat space.
- Use short labels and stable dimensions.

### Quick Fix, Result, and Game Over

Decision/result overlays should use the same IDE composition rather than simple centered cards. A modal can still be compact, but it should include enough structure to look like part of the same debugger interface.

Required improvements:

- Add titlebar or sidebar treatment where it improves reference similarity.
- Keep action buttons clear.
- Avoid nested-card visuals.

### Codex

Codex is already close to the reference workspace pattern. It should become the clearest example of the common shell because future collection/progression screens can reuse this pattern.

Required improvements:

- Add background scanline/radial treatment consistent with menu screens.
- Make the selected group and entry grid feel closer to `10_collection_codex_frontend_design.html`.
- Preserve keyboard and close behavior.

## Architecture

Keep the current DOM/Phaser split from `DESIGN.md`:

- DOM overlays for layout-heavy screens: menu, stage select, weapon select, quick fix, result, game over, codex.
- Phaser UI for always-on gameplay HUD and high-frequency combat state.
- Short-lived DOM overlays are acceptable for event and boss alerts when they do not intercept input or persist too long.

Use existing modules where possible:

- `src/ui/menuOverlay.ts` and `.css` for Start, Stage Select, Weapon Select.
- `src/ui/runtimeOverlay.ts`, `runtimeOverlayDom.ts`, and `.css` for HUD view text and runtime alerts.
- `src/ui/runDecision.ts`, `runDecisionOverlay.ts`, and `.css` for Quick Fix/result screens.
- `src/ui/codexOverlay.ts` and `.css` for Codex.
- `src/ui/theme.ts` remains the shared color/font/depth reference.

Do not introduce React or another UI framework for this pass.

## Data Flow

- Existing state reducers and view-model builders should stay as the testable layer.
- DOM overlay modules should render from those view models or existing game state.
- Scene classes should own lifecycle: mount overlay, dispatch actions, clear overlay on shutdown, and start/restart scenes.
- The common visual shell can be implemented through shared CSS classes or carefully duplicated selectors, but only if it reduces real duplication without forcing a large refactor.

## Error Handling And Cleanup

- DOM overlays must remove event listeners and DOM nodes on scene shutdown.
- Runtime alerts must clear before returning to menu, restarting, or ending a run.
- Broken copy, mojibake, and placeholder text are treated as UI defects.
- If a reference layout conflicts with gameplay readability, gameplay readability wins and the deviation should be documented in the implementation plan.

## Testing And Verification

Required verification:

- Unit tests for menu, decision, runtime, and codex view/model behavior.
- `npm test`
- `npm run build`
- `npm run e2e`
- Playwright screenshots at 1440x900 for the affected screens.
- Manual screenshot inspection for text overlap, broken copy, missing shell areas, and weak reference alignment.

Useful screenshot targets:

- `phase1-dom-start-1440x900.png`
- `phase1-dom-stage-1440x900.png`
- `phase1-dom-weapon-1440x900.png`
- `runtime-overlay-1440x900.png`
- `quick-fix-1440x900.png`
- `decision-result-1440x900.png`
- `codex-1440x900.png`

## Ambiguity Review

- "Follow `codex_examples/`" means follow the screen composition of files `01` through `10`, not clone `index.html`.
- "Core screens" means the already implemented screens listed in the primary scope.
- `06_event` and `07_boss` are not excluded forever; they are secondary polish targets in this pass.
- "Consistency" means shared shell/layout grammar, not identical content on every screen.
- "Design reflected strongly" means visible structure, readable copy, matching palette, and consistent interaction placement.

## Implementation Plan Handoff

After this design is approved, the implementation plan should break the work into small, verifiable passes:

1. Fix broken copy and define the shared shell expectations.
2. Strengthen menu screen composition.
3. Strengthen decision/result overlay composition.
4. Strengthen runtime HUD and alert alignment without harming gameplay readability.
5. Strengthen Codex composition.
6. Run full verification and screenshot review.
