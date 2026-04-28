# JDS Design Guide

This document is the visual and technical design reference for JY Survival. Use it when implementing screens, HUD, weapons, monster sprites, effects, and Phaser systems.

Reference HTML files stay in `examples/` and `codex_examples/`. This document records what to adopt from them, not their full source code.

## Core Concept

JY Survival is a coding-themed survival game built around debugging pressure: terminals, IDE windows, runtime errors, package issues, memory problems, and SSAFY study-room energy.

The visual direction is:

- Dark terminal and IDE interface
- Neon syntax-highlight colors
- CRT scanlines, glow, trails, and short glitch bursts
- Readable code/error motifs rather than generic fantasy effects
- Compact tool-like UI, not a marketing page

Avoid:

- Bright casual mobile-game palettes
- Soft fantasy, medieval, or natural textures
- Decorative UI that hides gameplay state
- Effects that are visually rich but do not communicate danger, hit, reward, or timing

## Reference Selection Rules

- `codex_examples/01_start_screen_frontend_design.html` through `codex_examples/10_collection_codex_frontend_design.html` define the current UI renewal screen references.
- `codex_examples/index.html` is a review deck for comparing those screen references, not a production screen by itself.
- `examples/total_ui/` defines screen and UI language.
- `examples/weapon_effect/` defines weapon effect motifs.
- Under `examples/monster/`, files whose filename starts with `_` are the selected monster designs.
- If multiple files exist for the same monster, the file starting with `_` is the chosen reference.
- Keep non-selected files as exploration history unless the user explicitly changes the selection.

## Visual Language

### Fonts

- UI and code surfaces: `JetBrains Mono`, `Space Mono`, or monospace fallback.
- Korean labels: `Noto Sans KR`.
- Monster title/reference display: `Orbitron` is acceptable for bold error-name styling.

### Base UI Palette

Use the VS Code-like palette from `examples/total_ui/start_screen.html` and `weapon_select.html`:

| Token | Color | Usage |
| --- | --- | --- |
| `bg` | `#1e1e1e` | Main terminal/editor panels |
| `sidebar` | `#252526` | Explorer/sidebar surfaces |
| `status` | `#007acc` | Status bars and system accents |
| `white` | `#d4d4d4` | Primary text |
| `dim` | `#858585` | Secondary text |
| `teal` | `#4ec9b0` | Active selection, prompts, primary actions |
| `blue` | `#9cdcfe` | Keywords, paths, Python-like accents |
| `green` | `#b5cea8` | Success, numeric literals, safe states |
| `yellow` | `#dcdcaa` | Warnings, classes, C/C++ accents |
| `orange` | `#ce9178` | Strings, Java accents |
| `red` | `#f44747` | Errors, danger, damage |
| `comment` | `#6a9955` | Comments and low-priority logs |

### Effects Language

- Use glow and trails sparingly to communicate active state, charge, impact, or danger.
- Use scanlines and CRT overlays mainly on menu/start screens, not over gameplay if they reduce readability.
- Prefer short readable text fragments: `NULL`, `DROP TABLE bugs;`, `.env`, `CHARGING`, `0xDEAD`.
- Screen shake should be reserved for heavy impacts, boss arrivals, and high-damage effects.

## Screen UI

### Start Screen

Reference:

- `examples/total_ui/start_screen.html`
- `codex_examples/01_start_screen_frontend_design.html`

Adopt:

- Terminal window frame with macOS-style window controls.
- Boot log sequence that introduces the game world.
- Prompt line with `jiyoon@ssafy:~/stage1$`.
- ASCII/logo treatment and subtle scanlines.

Implementation notes:

- Keep the start screen as a functional entry point.
- Transition to weapon select or game start through a clear command-like action.
- Avoid placing core start controls in decorative cards.

### Weapon Select

Reference:

- `examples/total_ui/weapon_select.html`
- `codex_examples/03_weapon_select_frontend_design.html`

Adopt:

- IDE/editor layout with explorer sidebar and code preview.
- Weapon files represented as source files such as `Python.py`, `C_Cpp.c`, `Java.class`.
- Active selection with teal left border and syntax-highlighted preview.
- Bottom status/action bar with a clear start action.

Implementation notes:

- Selection state should be stable and keyboard/mouse friendly.
- Weapon descriptions should read like code comments.
- Locked weapons can appear in the sidebar but should be visually secondary.

### In-Game HUD

Reference:

- `examples/total_ui/Debug Survival - Terminal UI-print.html`
- `codex_examples/04_in_game_hud_frontend_design.html`

Adopt:

- Compact debug-console style.
- HP, EXP, timer, stage, selected weapon, and warning state should remain readable during combat.
- System logs can reinforce theme but must not obscure enemy patterns.

Implementation notes:

- HUD elements need stable dimensions.
- Important combat state must be visible without reading long text.
- Mobile or small viewport layouts should reduce text density before reducing legibility.

### DOM and Phaser UI Split

- Use DOM overlay UI for static, layout-heavy screens: start, stage select, weapon select, level-up choices, result screens, game over, and collection/codex.
- Use Phaser UI for combat HUD elements that update every frame or need tight gameplay timing: HP/EXP/timer, weapon cooldowns, danger indicators, floating combat text, pickups, and player/enemy telegraphs.
- Temporary overlays such as event toasts and boss warnings may use DOM when visual similarity to the UI references matters more than frame-perfect gameplay timing.
- Remove or hide DOM overlays before active gameplay resumes so they do not intercept pointer or keyboard input.

## Weapons

Weapon effects should map programming concepts to readable combat behaviors.

| Weapon | Reference | Visual Identity | Gameplay/Technical Direction |
| --- | --- | --- | --- |
| C/C++ | `examples/weapon_effect/hero_c.html` | White precision spikes and fragments | Fast direct shots, exact targeting, piercing or burst fragments |
| Django | `examples/weapon_effect/hero_django.html` | Green template beam and rectangular render blocks | Horizontal/linear render burst, area lane damage |
| Git | `examples/weapon_effect/hero_git.html` | Orange branch fork/merge curves | Forking projectiles, split paths, merge impact |
| Java | `examples/weapon_effect/hero_java.html` | Blue hexagonal VM shield | Defensive orbit or timed shield pulse |
| JavaScript | `examples/weapon_effect/hero_js.html` | Yellow event-loop callbacks | Orbiting loop, delayed callbacks, chaotic repeated ticks |
| Linux | `examples/weapon_effect/hero_linux.html` | Green kernel panic black hole | Pull/slow enemies, panic burst, memory-address particles |
| Python | `examples/weapon_effect/hero_python.html` | Blue/green serpent trail | Homing serpentine projectile with smooth trail |
| SQL | `examples/weapon_effect/hero_sql.html` | Blue database table drop | Targeted area crash, falling table, screen shake on impact |

Technical notes:

- Convert Canvas prototypes into Phaser primitives, sprites, graphics, particles, tweens, and timers.
- Keep each weapon effect readable at gameplay scale; preview effects may be more elaborate than in-game versions.
- Prefer reusable effect helpers for trail, glow, screen shake, and floating text.
- Cap particle counts and lifetime to protect performance.

## Monsters

Selected monster references are the `_*.html` files under `examples/monster/`.

| Monster | Reference | Concept | Stats | Gameplay Direction |
| --- | --- | --- | --- | --- |
| SyntaxError | `examples/monster/syntax_error/_syntax_error_example_1.html` | Aggressive red spiky base bug | HP 24, SPD 65, DMG 10, CONTACT | Basic contact enemy; sharp silhouette and red error glow |
| EnvError | `examples/monster/env_error/_env_error_example_1.html` | Config Bull | HP 48, SPD 35->400, DMG 15, DASHER | Telegraph with `CHARGING`, then burst dash |
| IndentationError | `examples/monster/indentation_error/_indentation_error_example_1.html` | Tab Crab | HP 36, SPD 70, DMG 15, SHOOTER | Fires indentation arrows; orange tab/space motif |
| InfiniteLoop | `examples/monster/infinite_loop/_infinite_loop_example_1.html` | Matrix Loop Ring | HP 35, SPD orbit, DMG 8, ORBITER | Orbits and emits code-wall patterns |
| InputMismatch | `examples/monster/input_mismatch/_input_mismatch_example_2.html` | Reversed Jester | HP 28, SPD 60, DMG 10, CTRL-REV | Uses mirror/reversal symbols; can disrupt controls or projectile direction |
| LibraryDependency | `examples/monster/library_dependency/_library_dependency_example_1.html` | Package Golem | HP 40, SPD 35, DMG 8, AURA BUFF | Buff aura and dependency-chain behavior |
| MemoryLeak | `examples/monster/memory_leak/_memory_leak_example_1.html` | Growing Ooze | HP 20, SPD 40, DMG 12, GROWING | Grows over time, emits garbage fragments |
| NullPointer | `examples/monster/null_pointer/_null_pointer_example_1.html` | Phantom Ghost | HP 20, SPD 110, DMG 5, CONTACT | Fast translucent ghost; `NULL` text trail and phasing feel |
| RaceCondition | `examples/monster/race_condition/_race_condition_example_1.html` | Linked Twins | HP 30, SPD 70, DMG 10, LINKED | Twin enemies; one can revive or empower the other |
| SegFault | `examples/monster/seg_fault/_seg_fault_example_1.html` | Rock Golem | HP 48, SPD 40, DMG 25, CONTACT | Slow high-damage enemy; crack and shockwave feedback |
| HealBug | `examples/monster/heal_bug/_heal_bug_example_2.html` | Bouncy Slime | HP 15, SPD 150, DMG 0, FLEE+DROP | Flees, drops healing cross, supports other bugs |

Monster implementation rules:

- Each monster needs a distinct silhouette, color family, and behavior tell.
- Telegraph dangerous attacks before damage is applied.
- Text motifs should reinforce behavior, not replace animation readability.
- The same monster color should be consistent across sprite, projectile, aura, and UI reference.

## Phaser Implementation Notes

- Keep design constants centralized where practical: colors, font families, depths, effect durations, and common easing.
- Use Phaser `Graphics` for procedural shapes and prototypes; migrate to spritesheets only when reuse or performance requires it.
- Use `Tween`, `TimerEvent`, and lightweight particles for charge, burst, pulse, and trail effects.
- Use Arcade Physics for simple movement, dash, collision, and projectile systems unless a specific feature needs a different physics model.
- Keep gameplay logic testable outside Phaser when possible: damage, cooldown, spawn rules, upgrade math, and status effects.
- Avoid unlimited particles, unbounded arrays, and per-frame text object creation.

## Update Rules

Update this document when:

- A reference example is selected or replaced.
- A new weapon, monster, screen, HUD element, or effect family is introduced.
- A design rule becomes necessary to keep future work consistent.
- Implementation reveals that an example must be simplified for readability or performance.

Do not update this document for tiny code-only fixes unless they change design direction.
