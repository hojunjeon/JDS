# UI Renewal Phase 2 Hybrid Runtime Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current in-game HUD, event banner, and boss alert with a readable IDE/debugger-style runtime overlay while preserving combat visibility.

**Architecture:** Keep always-on combat HUD in Phaser because it updates during active gameplay. Use a short-lived DOM overlay for event toasts and boss warnings when it improves visual similarity to `codex_examples/06` and `07`, and remove/hide the DOM overlay before input-sensitive gameplay resumes.

**Tech Stack:** Phaser 3, TypeScript, vanilla DOM, CSS, Vitest, Playwright, existing `src/ui/theme.ts` tokens.

---

## Decisions

- Runtime HUD stays in Phaser.
- Event/quest toast and boss warning use DOM overlay because they are short, layout-heavy, and reference-driven.
- DOM runtime alerts must not persist after their animation window.
- Boss warning shows the boss name immediately: `Jang Seonhyeong`.
- Mobile verification remains optional for this prototype pass.

## Files

- Create: `src/ui/runtimeOverlay.ts`
- Create: `src/ui/runtimeOverlayDom.ts`
- Create: `src/ui/runtimeOverlay.css`
- Create: `tests/runtimeOverlay.test.ts`
- Modify: `src/main.ts`
- Modify: `src/scenes/GameScene.ts`
- Modify: `tests/e2e/boot.spec.ts`
- Reference: `DESIGN.md`
- Reference: `codex_examples/04_in_game_hud_frontend_design.html`
- Reference: `codex_examples/06_event_quest_popup_frontend_design.html`
- Reference: `codex_examples/07_boss_warning_frontend_design.html`

---

### Task 1: Add Runtime Overlay View Models

**Files:**

- Create: `src/ui/runtimeOverlay.ts`
- Create: `tests/runtimeOverlay.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/runtimeOverlay.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildBossWarningView, buildQuestToastView, buildRuntimeHudView } from '../src/ui/runtimeOverlay';

describe('runtimeOverlay', () => {
  it('builds compact HUD copy', () => {
    const view = buildRuntimeHudView({
      stageTitle: 'Stage 1 - Python Basics',
      hp: 76.3,
      maxHp: 100,
      kills: 18,
      elapsedSec: 83.8,
      weaponCodeName: 'python.auto()',
      events: [
        { id: 'q1', completed: false, active: true, progress: 12 },
        { id: 'e1', completed: true, active: false, progress: 10 },
        { id: 'e2', completed: false, active: false, progress: 0 },
        { id: 'boss', completed: false, active: false, progress: 0 },
      ],
      boss: null,
    });

    expect(view.statusLine).toBe('Stage 1 - Python Basics | 01:23 | python.auto()');
    expect(view.vitalsLine).toBe('HP 77/100 | kills 18');
    expect(view.eventLine).toBe('q1:run:12 | e1:done:10 | e2:wait:0 | boss:wait:0');
    expect(view.bossLine).toBeNull();
  });

  it('builds DOM quest and boss overlay copy', () => {
    expect(buildQuestToastView({
      title: 'E1: indentation panic',
      dialogue: '"IndentationError keeps breaking the lab!"',
      rewardText: 'upgrade currency +3',
    })).toEqual({
      heading: 'EVENT_TRIGGERED',
      body: 'E1: indentation panic',
      detail: 'reward: upgrade currency +3',
      dialogue: '"IndentationError keeps breaking the lab!"',
    });

    expect(buildBossWarningView({
      name: 'Jang Seonhyeong',
      dialogue: 'boss.spawn("I am not losing again!")',
    })).toEqual({
      heading: 'BOSS PROCESS ATTACHED',
      name: 'Jang Seonhyeong',
      detail: 'boss.spawn("I am not losing again!")',
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/runtimeOverlay.test.ts`

Expected: FAIL because `src/ui/runtimeOverlay.ts` does not exist.

- [ ] **Step 3: Write the implementation**

Create `src/ui/runtimeOverlay.ts`:

```ts
import type { EventId } from '../types';

export interface RuntimeEventSummary {
  id: EventId;
  active: boolean;
  completed: boolean;
  progress: number;
}

export interface RuntimeHudInput {
  stageTitle: string;
  hp: number;
  maxHp: number;
  kills: number;
  elapsedSec: number;
  weaponCodeName: string;
  events: RuntimeEventSummary[];
  boss: { name: string; hp: number; maxHp: number } | null;
}

export function buildRuntimeHudView(input: RuntimeHudInput) {
  return {
    statusLine: `${input.stageTitle} | ${formatElapsed(input.elapsedSec)} | ${input.weaponCodeName}`,
    vitalsLine: `HP ${Math.max(0, Math.ceil(input.hp))}/${input.maxHp} | kills ${input.kills}`,
    eventLine: input.events.map(formatEvent).join(' | '),
    bossLine: input.boss ? `BOSS ${input.boss.name} | HP ${Math.max(0, Math.ceil(input.boss.hp))}/${input.boss.maxHp}` : null,
  };
}

export function buildQuestToastView(input: { title: string; dialogue: string; rewardText: string }) {
  return {
    heading: 'EVENT_TRIGGERED',
    body: input.title,
    detail: `reward: ${input.rewardText}`,
    dialogue: input.dialogue,
  };
}

export function buildBossWarningView(input: { name: string; dialogue: string }) {
  return {
    heading: 'BOSS PROCESS ATTACHED',
    name: input.name,
    detail: input.dialogue,
  };
}

function formatElapsed(elapsedSec: number): string {
  const total = Math.max(0, Math.floor(elapsedSec));
  return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`;
}

function formatEvent(event: RuntimeEventSummary): string {
  const status = event.completed ? 'done' : event.active ? 'run' : 'wait';
  return `${event.id}:${status}:${event.progress}`;
}
```

- [ ] **Step 4: Run the focused test**

Run: `npm test -- tests/runtimeOverlay.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/ui/runtimeOverlay.ts tests/runtimeOverlay.test.ts
git commit -m "test: add runtime overlay view models"
```

### Task 2: Render the Phaser Runtime HUD

**Files:**

- Modify: `src/scenes/GameScene.ts`

- [ ] **Step 1: Import helpers and theme tokens**

Add:

```ts
import type { EventId } from '../types';
import { buildRuntimeHudView, type RuntimeEventSummary } from '../ui/runtimeOverlay';
import { toHexColor, uiColors, uiDepths, uiFonts, uiLayout } from '../ui/theme';
```

- [ ] **Step 2: Replace single HUD text with a panel**

Replace `private hud!: Phaser.GameObjects.Text;` with:

```ts
private hudPanel!: Phaser.GameObjects.Container;
private hudStatus!: Phaser.GameObjects.Text;
private hudVitals!: Phaser.GameObjects.Text;
private hudEvents!: Phaser.GameObjects.Text;
private hudBoss!: Phaser.GameObjects.Text;
```

- [ ] **Step 3: Create compact HUD objects**

Replace the current HUD creation block with:

```ts
this.hudPanel = this.add.container(18, 14).setScrollFactor(0).setDepth(uiDepths.hud);
const hudBg = this.add.rectangle(0, 0, 470, 116, toHexColor('bg'), 0.88).setOrigin(0, 0);
hudBg.setStrokeStyle(uiLayout.panelBorderWidth, toHexColor('dim'), 0.34);
const statusStrip = this.add.rectangle(0, 0, 470, 24, toHexColor('status'), 0.92).setOrigin(0, 0);
this.hudStatus = this.add.text(12, 5, '', { fontFamily: uiFonts.fallbackMono, fontSize: '13px', color: uiColors.white });
this.hudVitals = this.add.text(12, 34, '', { fontFamily: uiFonts.fallbackMono, fontSize: '14px', color: uiColors.green });
this.hudEvents = this.add.text(12, 58, '', { fontFamily: uiFonts.fallbackMono, fontSize: '12px', color: uiColors.dim, wordWrap: { width: 438 } });
this.hudBoss = this.add.text(12, 88, '', { fontFamily: uiFonts.fallbackMono, fontSize: '13px', color: uiColors.red });
this.hudPanel.add([hudBg, statusStrip, this.hudStatus, this.hudVitals, this.hudEvents, this.hudBoss]);
```

- [ ] **Step 4: Replace `updateHud()`**

Use:

```ts
private updateHud(): void {
  const eventSummaries: RuntimeEventSummary[] = ['q1', 'e1', 'e2', 'boss']
    .map((id) => this.eventSystem.getState(id as EventId));
  const bossConfig = stages[0].boss;
  const view = buildRuntimeHudView({
    stageTitle: stages[0].title,
    hp: this.hp,
    maxHp: 100,
    kills: this.kills,
    elapsedSec: this.elapsedSec,
    weaponCodeName: weapons[this.selectedWeapon].codeName,
    events: eventSummaries,
    boss: this.boss ? { name: bossConfig.name, hp: this.boss.hp, maxHp: this.boss.maxHp } : null,
  });

  this.hudStatus.setText(view.statusLine);
  this.hudVitals.setText(view.vitalsLine);
  this.hudEvents.setText(view.eventLine);
  this.hudBoss.setText(view.bossLine ?? 'move WASD/arrows | R restart | ESC menu');
}
```

- [ ] **Step 5: Run verification**

Run:

```bash
npm test -- tests/runtimeOverlay.test.ts
npm run build
```

Expected: both PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/scenes/GameScene.ts
git commit -m "feat: render compact runtime HUD"
```

### Task 3: Add DOM Runtime Alerts

**Files:**

- Create: `src/ui/runtimeOverlayDom.ts`
- Create: `src/ui/runtimeOverlay.css`
- Modify: `src/main.ts`

- [ ] **Step 1: Create DOM alert helpers**

Create `src/ui/runtimeOverlayDom.ts`:

```ts
import { buildBossWarningView, buildQuestToastView } from './runtimeOverlay';

let activeAlert: HTMLElement | null = null;

export function showQuestToast(input: { title: string; dialogue: string; rewardText: string }): void {
  const view = buildQuestToastView(input);
  showAlert(`
    <section class="jds-runtime-alert toast">
      <div class="label">${view.heading}</div>
      <strong>${view.body}</strong>
      <p>${view.dialogue}</p>
      <small>${view.detail}</small>
    </section>
  `, 2100);
}

export function showBossWarning(input: { name: string; dialogue: string }): void {
  const view = buildBossWarningView(input);
  showAlert(`
    <section class="jds-runtime-alert boss">
      <div class="label">${view.heading}</div>
      <h1>${view.name}</h1>
      <code>${view.detail}</code>
    </section>
  `, 2300);
}

export function clearRuntimeAlert(): void {
  activeAlert?.remove();
  activeAlert = null;
}

function showAlert(html: string, durationMs: number): void {
  clearRuntimeAlert();
  const root = document.createElement('div');
  root.className = 'jds-runtime-alert-root';
  root.innerHTML = html;
  document.body.append(root);
  activeAlert = root;
  window.setTimeout(() => {
    if (activeAlert === root) clearRuntimeAlert();
  }, durationMs);
}
```

- [ ] **Step 2: Create alert CSS**

Create `src/ui/runtimeOverlay.css`:

```css
.jds-runtime-alert-root {
  position: fixed;
  inset: 0;
  z-index: 30;
  pointer-events: none;
  font-family: "JetBrains Mono", "Space Mono", "Noto Sans KR", Consolas, monospace;
  color: #d4d4d4;
}

.jds-runtime-alert {
  border: 1px solid #4ec9b0;
  background: rgba(37, 37, 38, 0.94);
  box-shadow: 0 0 34px rgba(78, 201, 176, 0.18);
}

.jds-runtime-alert .label {
  color: #6a9955;
  font-size: 12px;
  text-transform: uppercase;
}

.jds-runtime-alert.toast {
  position: absolute;
  left: 26px;
  top: 150px;
  width: min(460px, calc(100vw - 52px));
  padding: 14px;
  display: grid;
  gap: 8px;
}

.jds-runtime-alert.toast strong { color: #dcdcaa; }
.jds-runtime-alert.toast p { margin: 0; color: #d4d4d4; }
.jds-runtime-alert.toast small { color: #858585; }

.jds-runtime-alert.boss {
  position: absolute;
  left: 50%;
  top: 42%;
  width: min(700px, calc(100vw - 52px));
  transform: translate(-50%, -50%);
  padding: 28px;
  text-align: center;
  border-color: #f44747;
  background: rgba(30, 30, 30, 0.96);
}

.jds-runtime-alert.boss h1 {
  margin: 8px 0 12px;
  color: #f44747;
  font-size: clamp(36px, 6vw, 76px);
  letter-spacing: 0;
}

.jds-runtime-alert.boss code { color: #ce9178; }
```

- [ ] **Step 3: Import CSS**

In `src/main.ts`, add:

```ts
import './ui/runtimeOverlay.css';
```

- [ ] **Step 4: Run build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/ui/runtimeOverlayDom.ts src/ui/runtimeOverlay.css src/main.ts
git commit -m "feat: add DOM runtime alerts"
```

### Task 4: Connect DOM Alerts to Gameplay Events

**Files:**

- Modify: `src/scenes/GameScene.ts`

- [ ] **Step 1: Import DOM alert helpers**

Add:

```ts
import { clearRuntimeAlert, showBossWarning, showQuestToast } from '../ui/runtimeOverlayDom';
```

- [ ] **Step 2: Replace old event banner calls**

Where event trigger/completion text is currently shown, use:

```ts
showQuestToast({ title: event.title, dialogue: event.dialogue, rewardText: event.rewardText });
```

- [ ] **Step 3: Replace boss warning call**

In `spawnBoss()`, call:

```ts
showBossWarning(stages[0].boss);
```

- [ ] **Step 4: Clear DOM alerts on scene shutdown**

In `create()`, add:

```ts
this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => clearRuntimeAlert());
```

- [ ] **Step 5: Run verification**

Run:

```bash
npm test -- tests/runtimeOverlay.test.ts
npm run build
npm run e2e
```

Expected: all PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/scenes/GameScene.ts
git commit -m "feat: connect hybrid runtime overlays"
```

### Task 5: Phase 2 Final Verification and Docs

**Files:**

- Modify: `tests/e2e/boot.spec.ts`
- Modify: `codex_examples/UI_RENEWAL_PLAN.md`
- Modify: `PLANS.md`

- [ ] **Step 1: Add screenshot evidence**

Update or add an e2e flow that enters gameplay and captures:

```ts
await page.screenshot({ path: 'test-results/runtime-overlay-1440x900.png', fullPage: true });
```

- [ ] **Step 2: Run full verification**

Run:

```bash
npm test
npm run build
npm run e2e
```

Expected: all commands PASS.

- [ ] **Step 3: Update docs**

In `codex_examples/UI_RENEWAL_PLAN.md`, mark Phase 2 complete only after the commands pass and screenshot is inspected.

In `PLANS.md`, set current execution plan to:

```text
docs/superpowers/plans/2026-04-27-ui-renewal-phase-3-decision-result.md
```

- [ ] **Step 4: Commit**

Run:

```bash
git add tests/e2e/boot.spec.ts PLANS.md codex_examples/UI_RENEWAL_PLAN.md
git commit -m "docs: mark hybrid runtime overlay verified"
```

## Self-Review

- Always-on HUD remains Phaser for gameplay readability.
- Event and boss reference-heavy overlays use DOM and include cleanup.
- Tests cover pure view text; Playwright covers rendering and screenshot evidence.
