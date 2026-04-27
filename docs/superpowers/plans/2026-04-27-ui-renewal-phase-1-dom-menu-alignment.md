# UI Renewal Phase 1 DOM Menu Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the Phase 1 start, stage-select, and weapon-select screens into DOM overlay menus that closely match `codex_examples/01`, `02`, and `03` while preserving the tested menu flow into gameplay.

**Architecture:** Keep `src/ui/menuFlow.ts` as the single source of truth for menu state and transitions. `MenuScene` owns Phaser scene lifecycle, menu keyboard input, and starts `GameScene`, while a new DOM overlay module renders the menu UI, handles pointer input, and removes itself before gameplay begins.

**Tech Stack:** Phaser 3, TypeScript, vanilla DOM, CSS, Vitest, Playwright, existing `src/ui/theme.ts` tokens.

---

## Decisions

- Phase 1 menus should prioritize visual similarity to `codex_examples/01_start_screen_frontend_design.html`, `02_stage_select_frontend_design.html`, and `03_weapon_select_frontend_design.html`.
- Use vanilla TypeScript DOM and CSS; do not add React or another UI framework in this pass.
- `menuFlow.ts` remains the only state reducer for `start`, `stage-select`, `weapon-select`, and `game-start`.
- `MenuScene` handles menu keyboard input, and the DOM overlay handles pointer input. Phaser gameplay input starts only after the DOM overlay is removed.
- Desktop `1440x900` is the primary verification viewport. Mobile only needs a non-broken fallback for this prototype pass.
- Replace broken prototype Korean text with short readable Korean or English production copy.

## Files

- Create: `src/ui/menuOverlay.ts`
- Create: `src/ui/menuOverlay.css`
- Create: `tests/menuOverlay.test.ts`
- Modify: `src/scenes/MenuScene.ts`
- Modify: `src/main.ts`
- Modify: `src/style.css`
- Modify: `tests/e2e/boot.spec.ts`
- Reference: `DESIGN.md`
- Reference: `codex_examples/01_start_screen_frontend_design.html`
- Reference: `codex_examples/02_stage_select_frontend_design.html`
- Reference: `codex_examples/03_weapon_select_frontend_design.html`

---

### Task 1: Add DOM Overlay View Renderer

**Files:**

- Create: `src/ui/menuOverlay.ts`
- Create: `tests/menuOverlay.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/menuOverlay.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createMenuFlowState } from '../src/ui/menuFlow';
import { renderMenuOverlayHtml } from '../src/ui/menuOverlay';

describe('menuOverlay', () => {
  it('renders the start screen as an IDE boot layout', () => {
    const html = renderMenuOverlayHtml(createMenuFlowState());

    expect(html).toContain('data-screen="start"');
    expect(html).toContain('Explorer');
    expect(html).toContain('JDS');
    expect(html).toContain('Mission Briefing');
    expect(html).toContain('start debug');
  });

  it('renders the stage select pipeline', () => {
    const html = renderMenuOverlayHtml({ ...createMenuFlowState(), screen: 'stage-select' });

    expect(html).toContain('data-screen="stage-select"');
    expect(html).toContain('Stage Pipeline');
    expect(html).toContain('stage_01.python');
    expect(html).toContain('LOCKED');
    expect(html).toContain('continue to weapon select');
  });

  it('renders the weapon select source-file arsenal', () => {
    const html = renderMenuOverlayHtml({ ...createMenuFlowState(), screen: 'weapon-select' });

    expect(html).toContain('data-screen="weapon-select"');
    expect(html).toContain('Weapon Select');
    expect(html).toContain('Python.py');
    expect(html).toContain('C_Cpp.c');
    expect(html).toContain('Java.class');
    expect(html).toContain('start Stage 1');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/menuOverlay.test.ts`

Expected: FAIL because `src/ui/menuOverlay.ts` does not exist.

- [ ] **Step 3: Add the HTML renderer**

Create `src/ui/menuOverlay.ts`:

```ts
import { stages, starterWeaponConfigs } from '../data/gameData';
import type { MenuFlowState } from './menuFlow';

export function renderMenuOverlayHtml(state: MenuFlowState): string {
  if (state.screen === 'stage-select') return renderStageSelect(state);
  if (state.screen === 'weapon-select') return renderWeaponSelect(state);
  return renderStart();
}

function renderStart(): string {
  return `
    <section class="jds-menu jds-screen-start" data-screen="start">
      <header class="jds-titlebar">
        <span class="jds-dot red"></span><span class="jds-dot yellow"></span><span class="jds-dot green"></span>
        <span>jiyoon@ssafy: ~/debug-survival/start.frontend-design</span>
      </header>
      <main class="jds-workspace three-col">
        <aside class="jds-sidebar">
          <div class="jds-label">Explorer</div>
          <h3>debug-survival</h3>
          <button class="jds-file active" data-action="start.confirm"><b>start.sh</b><span>boot entrypoint</span></button>
          <button class="jds-file" data-action="noop"><b>stage_01/</b><span>Python Basics</span></button>
          <button class="jds-file" data-action="noop"><b>weapons/</b><span>Python.py, C_Cpp.c, Java.class</span></button>
          <button class="jds-file" data-action="noop"><b>boss.trace</b><span>locked until runtime</span></button>
        </aside>
        <section class="jds-center">
          <div class="jds-hero">
            <div>
              <div class="jds-eyebrow">// SSAFY boot sequence initialized</div>
              <h1>JDS<br>Survival</h1>
              <p>교실 터미널에서 runaway error를 정리하고 첫 boss trace까지 버티세요.</p>
            </div>
            <div class="jds-boot-chip"><span>Boot</span><strong>01</strong><em>ready</em></div>
          </div>
          <section class="jds-panel-grid">
            <article class="jds-panel">
              <span class="jds-label">Boot Log</span>
              <p><b class="green">OK</b> loaded Python Basics</p>
              <p><b class="green">OK</b> mounted SSAFY classroom</p>
              <p><b class="yellow">WARN</b> 24 unresolved bugs detected</p>
              <p><b class="red">ERR</b> IndentationError wave scheduled</p>
            </article>
            <article class="jds-panel">
              <span class="jds-label">Command Preview</span>
              <code><span class="teal">jiyoon@ssafy</span>:<span class="blue">~/stage1</span>$ <span class="yellow">npm run survive</span></code>
            </article>
          </section>
          <footer class="jds-actions">
            <code><span class="teal">$</span> session.prepare("stage_01")</code>
            <button data-action="start.confirm">start debug</button>
          </footer>
        </section>
        <aside class="jds-sidebar">
          <div class="jds-label">Mission Briefing</div>
          <h2>Stage 1</h2>
          <dl>
            <dt>Curriculum</dt><dd>Python Basics</dd>
            <dt>Location</dt><dd>SSAFY lab</dd>
            <dt>First wave</dt><dd>IndentationError</dd>
            <dt>Boss</dt><dd>Jang Seonhyeong</dd>
          </dl>
        </aside>
      </main>
      <footer class="jds-statusbar"><span>01_start_screen_frontend_design.html</span><span>Enter: start</span><span>JDS</span></footer>
    </section>
  `;
}

function renderStageSelect(state: MenuFlowState): string {
  const rows = stages.map((stage) => {
    const active = stage.id === state.selectedStageId;
    const locked = stage.id !== 1;
    return `
      <button class="jds-stage ${active ? 'active' : ''} ${locked ? 'locked' : ''}" data-stage-id="${stage.id}" ${locked ? 'disabled' : ''}>
        <span class="jds-stage-id">${stage.id.toString().padStart(2, '0')}<em>${locked ? 'LOCKED' : 'READY'}</em></span>
        <span class="jds-stage-main"><b>${stage.title.replace(/^Stage \\d - /, '')}</b><small>${stage.theme}</small></span>
        <span class="jds-stage-state">${active ? 'selected' : locked ? 'requires clear' : 'available'}</span>
      </button>
    `;
  }).join('');

  return `
    <section class="jds-menu jds-screen-stage" data-screen="stage-select">
      <header class="jds-titlebar"><span class="jds-dot red"></span><span class="jds-dot yellow"></span><span class="jds-dot green"></span><span>~/debug-survival/stage-pipeline.config</span></header>
      <main class="jds-workspace stage-layout">
        <aside class="jds-sidebar"><div class="jds-label">Explorer</div><p class="active">curriculum</p><p class="active">stage_01.python</p><p class="locked">stage_02.algorithm</p><p class="locked">stage_03.web</p></aside>
        <section class="jds-center">
          <div class="jds-tabs"><span class="active">stage-pipeline.config</span><span>quest.queue</span><span>boss.trace</span></div>
          <div class="jds-head"><div><div class="jds-eyebrow">// SSAFY curriculum is compiled as survival stages</div><h1>Stage Pipeline</h1></div><code>run stage_01 --mode survival</code></div>
          <div class="jds-stage-list">${rows}</div>
        </section>
        <aside class="jds-sidebar"><div class="jds-label">Selected Stage</div><h2>Stage 1 Briefing</h2><p>Python 기본 문법 오류와 첫 이벤트를 처리하는 디버깅 생존 루트입니다.</p><button data-action="stage.confirm">continue to weapon select</button><button data-action="back">return to boot screen</button></aside>
      </main>
      <footer class="jds-statusbar"><span>02_stage_select_frontend_design.html</span><span>1-6: select</span><span>ESC: back</span></footer>
    </section>
  `;
}

function renderWeaponSelect(state: MenuFlowState): string {
  const selected = starterWeaponConfigs.find((weapon) => weapon.id === state.selectedWeapon) ?? starterWeaponConfigs[0];
  const files = starterWeaponConfigs.map((weapon) => `
    <button class="jds-file ${weapon.id === state.selectedWeapon ? 'active' : ''}" data-weapon-id="${weapon.id}">
      <b>${weapon.name === 'C/C++' ? 'C_Cpp.c' : `${weapon.name}.py`.replace('Java.py', 'Java.class')}</b>
      <span>${weapon.codeName}</span>
    </button>
  `).join('');

  return `
    <section class="jds-menu jds-screen-weapon" data-screen="weapon-select">
      <header class="jds-titlebar"><span class="jds-dot red"></span><span class="jds-dot yellow"></span><span class="jds-dot green"></span><span>~/debug-survival/loadout/${selected.name}.file</span></header>
      <main class="jds-workspace three-col">
        <aside class="jds-sidebar"><div class="jds-label">Explorer</div><h3>starter_weapons</h3>${files}<h3>reward_weapons</h3><p class="locked">Git.sh</p><p class="locked">SQL.sql</p></aside>
        <section class="jds-center">
          <div class="jds-tabs"><span class="active">Python.py</span><span>C_Cpp.c</span><span>Java.class</span></div>
          <div class="jds-head"><div><div class="jds-eyebrow">// choose the first debugging weapon file</div><h1>Weapon Select</h1></div><code>equip ${selected.codeName}</code></div>
          <div class="jds-bench">
            <pre class="jds-code"><code># ${selected.name}
class ${selected.name.replace(/[^A-Za-z]/g, '')}Weapon:
    damage = ${selected.damage}
    cooldown_ms = ${selected.cooldownMs}
    pattern = "${selected.description}"

    def cast(self, bugs):
        return ${selected.codeName}</code></pre>
            <article class="jds-preview"><span>effect.preview</span><strong>${selected.codeName}</strong><p>${selected.description}</p></article>
          </div>
        </section>
        <aside class="jds-sidebar"><div class="jds-label">Selected Weapon</div><h2>${selected.name} / ${selected.codeName}</h2><p>${selected.description}</p><button data-action="weapon.confirm">start Stage 1</button><button data-action="back">return to stage pipeline</button></aside>
      </main>
      <footer class="jds-statusbar"><span>03_weapon_select_frontend_design.html</span><span>1-3: weapon</span><span>Enter: start</span></footer>
    </section>
  `;
}
```

- [ ] **Step 4: Run the focused test**

Run: `npm test -- tests/menuOverlay.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/ui/menuOverlay.ts tests/menuOverlay.test.ts
git commit -m "test: add DOM menu overlay renderer"
```

### Task 2: Add Menu Overlay Styling

**Files:**

- Create: `src/ui/menuOverlay.css`
- Modify: `src/main.ts`
- Modify: `src/style.css`

- [ ] **Step 1: Create the CSS file**

Create `src/ui/menuOverlay.css`:

```css
:root {
  --jds-bg: #1e1e1e;
  --jds-sidebar: #252526;
  --jds-status: #007acc;
  --jds-white: #d4d4d4;
  --jds-dim: #858585;
  --jds-teal: #4ec9b0;
  --jds-blue: #9cdcfe;
  --jds-green: #b5cea8;
  --jds-yellow: #dcdcaa;
  --jds-orange: #ce9178;
  --jds-red: #f44747;
  --jds-comment: #6a9955;
  --jds-line: #3c3c3c;
}

.jds-menu-root {
  position: fixed;
  inset: 0;
  z-index: 20;
  color: var(--jds-white);
  font-family: "JetBrains Mono", "Space Mono", "Noto Sans KR", Consolas, monospace;
  background:
    repeating-linear-gradient(0deg, rgba(255,255,255,0.026), rgba(255,255,255,0.026) 1px, transparent 1px, transparent 4px),
    radial-gradient(circle at 72% 30%, rgba(244, 71, 71, 0.09), transparent 300px),
    radial-gradient(circle at 32% 66%, rgba(78, 201, 176, 0.14), transparent 430px),
    var(--jds-bg);
}

.jds-menu {
  height: calc(100vh - 52px);
  margin: 26px;
  border: 1px solid var(--jds-line);
  background: rgba(30, 30, 30, 0.97);
  display: grid;
  grid-template-rows: 34px minmax(0, 1fr) 28px;
  overflow: hidden;
  box-shadow: 0 0 42px rgba(78, 201, 176, 0.14);
}

.jds-titlebar,
.jds-statusbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  font-size: 12px;
}

.jds-titlebar { background: var(--jds-sidebar); color: var(--jds-dim); border-bottom: 1px solid var(--jds-line); }
.jds-statusbar { justify-content: space-between; background: var(--jds-status); color: #fff; }
.jds-dot { width: 11px; height: 11px; border-radius: 50%; display: inline-block; }
.jds-dot.red { background: #ff5f57; }
.jds-dot.yellow { background: #ffbd2e; }
.jds-dot.green { background: #28c840; }

.jds-workspace { min-height: 0; display: grid; background: #151515; }
.jds-workspace.three-col { grid-template-columns: 270px minmax(0, 1fr) 330px; }
.jds-workspace.stage-layout { grid-template-columns: 238px minmax(0, 1fr) 316px; }
.jds-sidebar { min-width: 0; background: rgba(37,37,38,0.94); padding: 16px; display: grid; align-content: start; gap: 12px; border-color: var(--jds-line); }
.jds-sidebar:first-child { border-right: 1px solid var(--jds-line); }
.jds-sidebar:last-child { border-left: 1px solid var(--jds-line); }
.jds-center { min-width: 0; min-height: 0; padding: 18px; display: grid; grid-template-rows: auto minmax(0, 1fr) auto; gap: 14px; overflow: hidden; }
.jds-label, .jds-eyebrow { color: var(--jds-comment); font-size: 12px; text-transform: uppercase; }
.jds-menu h1 { margin: 0; color: var(--jds-white); font-size: clamp(42px, 7vw, 92px); line-height: 0.88; letter-spacing: 0; text-shadow: 4px 0 rgba(78,201,176,0.35), -3px 0 rgba(244,71,71,0.24); }
.jds-menu h2, .jds-menu h3, .jds-menu p { margin: 0; }
.jds-menu button { border: 1px solid rgba(78,201,176,0.42); background: rgba(78,201,176,0.08); color: var(--jds-teal); font: inherit; cursor: pointer; text-align: left; padding: 10px 12px; }
.jds-menu button:hover, .jds-menu button:focus-visible { outline: 1px solid rgba(78,201,176,0.72); }
.jds-file { display: grid; gap: 3px; border-left: 3px solid transparent; color: var(--jds-dim); background: rgba(255,255,255,0.02); }
.jds-file.active { border-left-color: var(--jds-teal); background: rgba(78,201,176,0.08); color: var(--jds-white); }
.jds-file span, .jds-sidebar p, .jds-menu small { color: var(--jds-dim); }
.jds-sidebar .locked, .jds-stage.locked { opacity: 0.48; }
.jds-hero { border: 1px solid rgba(78,201,176,0.42); border-left: 5px solid var(--jds-teal); background: rgba(24,24,24,0.95); padding: 20px; display: grid; grid-template-columns: minmax(0, 1fr) 220px; gap: 18px; align-items: center; }
.jds-hero p { color: var(--jds-dim); line-height: 1.55; margin-top: 12px; }
.jds-boot-chip, .jds-panel, .jds-preview, .jds-code { border: 1px solid rgba(212,212,212,0.13); background: rgba(8,8,8,0.62); padding: 14px; }
.jds-boot-chip { display: grid; place-items: center; text-align: center; }
.jds-boot-chip strong { color: var(--jds-teal); font-size: 48px; }
.jds-panel-grid, .jds-bench { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 12px; min-height: 0; }
.jds-panel { display: grid; align-content: start; gap: 8px; }
.jds-actions { display: grid; grid-template-columns: minmax(0, 1fr) 190px; gap: 10px; align-items: center; }
.jds-tabs { display: flex; height: 36px; background: #181818; border-bottom: 1px solid var(--jds-line); }
.jds-tabs span { min-width: 136px; padding: 10px 13px 0; color: var(--jds-dim); border-right: 1px solid var(--jds-line); font-size: 12px; }
.jds-tabs .active { color: var(--jds-white); background: var(--jds-bg); border-top: 2px solid var(--jds-teal); }
.jds-head { display: grid; grid-template-columns: minmax(0, 1fr) minmax(230px, 312px); gap: 18px; align-items: stretch; }
.jds-head h1 { font-size: clamp(30px, 4.8vw, 62px); line-height: 0.94; }
.jds-head code, .jds-actions code { border: 1px solid rgba(78,201,176,0.28); border-left: 3px solid var(--jds-teal); background: rgba(8,8,8,0.64); padding: 12px; color: var(--jds-white); }
.jds-stage-list { overflow: auto; display: grid; gap: 10px; align-content: start; }
.jds-stage { min-height: 96px; display: grid; grid-template-columns: 84px minmax(0, 1fr) 160px; gap: 14px; align-items: center; border-color: var(--jds-line); color: var(--jds-white); }
.jds-stage.active { border-color: rgba(78,201,176,0.76); box-shadow: 0 0 20px rgba(78,201,176,0.11); }
.jds-stage-id { display: grid; gap: 18px; color: var(--jds-white); }
.jds-stage-id em, .jds-stage-state { color: var(--jds-teal); font-style: normal; font-size: 12px; }
.jds-code { overflow: auto; color: var(--jds-white); margin: 0; min-height: 0; }
.jds-preview { display: grid; align-content: center; gap: 10px; min-height: 0; }
.jds-preview strong { color: var(--jds-teal); }
.teal { color: var(--jds-teal); } .blue { color: var(--jds-blue); } .green { color: var(--jds-green); } .yellow { color: var(--jds-yellow); } .red { color: var(--jds-red); }

@media (max-width: 920px) {
  .jds-menu { margin: 12px; height: calc(100vh - 24px); }
  .jds-workspace.three-col, .jds-workspace.stage-layout, .jds-hero, .jds-panel-grid, .jds-bench, .jds-head { grid-template-columns: 1fr; }
  .jds-sidebar:last-child { border-left: 0; border-top: 1px solid var(--jds-line); }
  .jds-center { overflow: auto; }
}
```

- [ ] **Step 2: Import the CSS**

In `src/main.ts`, add:

```ts
import './ui/menuOverlay.css';
```

Keep the existing `import './style.css';`.

- [ ] **Step 3: Ensure the app root allows overlay layering**

In `src/style.css`, ensure `#app` or the canvas parent does not clip fixed overlays:

```css
#app {
  position: relative;
  min-height: 100vh;
}
```

- [ ] **Step 4: Run build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/ui/menuOverlay.css src/main.ts src/style.css
git commit -m "feat: style DOM menu overlay"
```

### Task 3: Connect Overlay Lifecycle to `MenuScene`

**Files:**

- Modify: `src/ui/menuOverlay.ts`
- Modify: `src/scenes/MenuScene.ts`

- [ ] **Step 1: Add overlay mount API**

Append to `src/ui/menuOverlay.ts`:

```ts
import type { MenuFlowEvent } from './menuFlow';

export interface MenuOverlayController {
  update(state: MenuFlowState): void;
  destroy(): void;
}

export function mountMenuOverlay(input: {
  state: MenuFlowState;
  dispatch: (event: MenuFlowEvent) => void;
}): MenuOverlayController {
  const root = document.createElement('div');
  root.className = 'jds-menu-root';
  document.body.append(root);

  const render = (state: MenuFlowState) => {
    root.innerHTML = renderMenuOverlayHtml(state);
  };

  const onClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const action = target.closest<HTMLElement>('[data-action]')?.dataset.action;
    const stageId = target.closest<HTMLElement>('[data-stage-id]')?.dataset.stageId;
    const weaponId = target.closest<HTMLElement>('[data-weapon-id]')?.dataset.weaponId;

    if (action === 'start.confirm') input.dispatch({ type: 'start.confirm' });
    if (action === 'stage.confirm') input.dispatch({ type: 'stage.confirm' });
    if (action === 'weapon.confirm') input.dispatch({ type: 'weapon.confirm' });
    if (action === 'back') input.dispatch({ type: 'back' });
    if (stageId) input.dispatch({ type: 'stage.select', stageId: Number(stageId) });
    if (weaponId) input.dispatch({ type: 'weapon.select', weapon: weaponId as MenuFlowState['selectedWeapon'] });
  };

  root.addEventListener('click', onClick);
  render(input.state);

  return {
    update: render,
    destroy: () => {
      root.removeEventListener('click', onClick);
      root.remove();
    },
  };
}
```

- [ ] **Step 2: Replace Phaser menu drawing in `MenuScene`**

In `src/scenes/MenuScene.ts`, import:

```ts
import { mountMenuOverlay, type MenuOverlayController } from '../ui/menuOverlay';
```

Replace the Phaser drawing fields and render calls with:

```ts
private overlay: MenuOverlayController | null = null;

create(): void {
  this.flow = createMenuFlowState();
  this.cameras.main.setBackgroundColor(uiColors.bg);
  this.overlay = mountMenuOverlay({
    state: this.flow,
    dispatch: (event) => this.dispatch(event),
  });
  this.registerKeyboard();
  this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroyOverlay());
}

private render(): void {
  this.overlay?.update(this.flow);
}

private destroyOverlay(): void {
  this.overlay?.destroy();
  this.overlay = null;
}
```

Leave `menuFlow` dispatch behavior intact. Remove unused Phaser-only draw methods after `MenuScene` no longer calls them.

- [ ] **Step 3: Destroy overlay before gameplay**

In `startGame()`, add `this.destroyOverlay();` before `this.scene.start(...)`:

```ts
private startGame(): void {
  this.destroyOverlay();
  this.scene.start('GameScene', { stageId: this.flow.selectedStageId, weapon: this.flow.selectedWeapon });
}
```

- [ ] **Step 4: Run verification**

Run:

```bash
npm test -- tests/menuFlow.test.ts tests/menuOverlay.test.ts
npm run build
```

Expected: both commands PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/ui/menuOverlay.ts src/scenes/MenuScene.ts
git commit -m "feat: mount DOM menu overlay from MenuScene"
```

### Task 4: Add Menu Keyboard Control Without Double Handling

**Files:**

- Modify: `src/scenes/MenuScene.ts`

- [ ] **Step 1: Keep keyboard handling in `MenuScene` only**

Keep `registerKeyboard()`, `handleEnter()`, `handleBack()`, and `handleNumber()` in `MenuScene`. Do not add document-level keyboard listeners in `menuOverlay.ts`.

- [ ] **Step 2: Verify keyboard flow manually**

Run: `npm run dev`

Manual check at the local Vite URL:

- `Enter` on Start moves to Stage Select once.
- `Enter` on Stage Select moves to Weapon Select once.
- `1`, `2`, `3` on Weapon Select choose the matching weapon once.
- `ESC` moves back one screen.
- `Enter` on Weapon Select starts gameplay and removes `.jds-menu-root`.

- [ ] **Step 3: Commit only if code changed**

If Task 3 already left keyboard handling correct, do not make a commit for this task.

### Task 5: Expand E2E Coverage and Screenshots

**Files:**

- Modify: `tests/e2e/boot.spec.ts`

- [ ] **Step 1: Replace the basic boot test with DOM-aware checks**

Use:

```ts
import { expect, test } from '@playwright/test';

test('DOM menu flow reaches gameplay', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.jds-menu-root [data-screen="start"]')).toBeVisible();
  await page.screenshot({ path: 'test-results/phase1-dom-start-1440x900.png', fullPage: true });

  await page.keyboard.press('Enter');
  await expect(page.locator('.jds-menu-root [data-screen="stage-select"]')).toBeVisible();
  await page.screenshot({ path: 'test-results/phase1-dom-stage-1440x900.png', fullPage: true });

  await page.keyboard.press('Enter');
  await expect(page.locator('.jds-menu-root [data-screen="weapon-select"]')).toBeVisible();
  await page.keyboard.press('Digit2');
  await page.screenshot({ path: 'test-results/phase1-dom-weapon-1440x900.png', fullPage: true });

  await page.keyboard.press('Enter');
  await expect(page.locator('.jds-menu-root')).toHaveCount(0);
  await expect(page.locator('canvas')).toBeVisible();
});
```

- [ ] **Step 2: Run e2e**

Run: `npm run e2e`

Expected: PASS and three Phase 1 DOM screenshots exist under `test-results/`.

- [ ] **Step 3: Inspect screenshots**

Confirm:

- Start screen visibly has Explorer, boot hero, boot log, mission briefing, and status bar.
- Stage screen visibly has Explorer, tabs, stage pipeline, selected stage briefing, and locked stages.
- Weapon screen visibly has Explorer, tabs, code preview, effect preview/profile, and start action.
- Text does not overlap at `1440x900`.

- [ ] **Step 4: Commit**

Run:

```bash
git add tests/e2e/boot.spec.ts
git commit -m "test: cover DOM menu flow screenshots"
```

### Task 6: Phase 1 Final Verification and Docs

**Files:**

- Modify: `PLANS.md`
- Modify: `codex_examples/UI_RENEWAL_PLAN.md`

- [ ] **Step 1: Run full verification**

Run:

```bash
npm test
npm run build
npm run e2e
```

Expected: all commands PASS.

- [ ] **Step 2: Update roadmap completion state**

In `codex_examples/UI_RENEWAL_PLAN.md`, mark Phase 1 as visually realigned and record:

```text
Phase 1 DOM menu alignment verified with:
- npm test
- npm run build
- npm run e2e
- test-results/phase1-dom-start-1440x900.png
- test-results/phase1-dom-stage-1440x900.png
- test-results/phase1-dom-weapon-1440x900.png
```

- [ ] **Step 3: Update root index**

In `PLANS.md`, set current step to:

```text
Current step: Phase 1 DOM menu alignment complete; implement Phase 2 hybrid runtime overlay next.
```

- [ ] **Step 4: Commit**

Run:

```bash
git add PLANS.md codex_examples/UI_RENEWAL_PLAN.md
git commit -m "docs: mark Phase 1 DOM menu alignment verified"
```

## Self-Review

- This plan keeps `menuFlow.ts` as the tested state model and moves only the visual menu layer into DOM.
- The plan avoids adding a UI framework.
- The plan includes cleanup so DOM overlay does not remain over `GameScene`.
- The plan includes DOM-aware Playwright verification and screenshot evidence.
