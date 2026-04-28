# AGENTS.md

## Core Rules

- Use relevant `superpowers` and project-local JDS skills before acting.
- Project-local skills live in `.codex/skills/`.
- Keep changes scoped, follow existing project patterns, and avoid unrelated refactors.
- For feature, UI, gameplay, behavior, workflow, spec, plan, or verification changes, use `jds-development-workflow`.
- For GitHub commit or push decisions, use `jds-git-sync`.
- For prompt diary decisions or entries, use `jds-prompt-diary`.
- For gameplay quality, combat, enemies, weapons, rewards, difficulty, pacing, or game-feel review, use `jds-game-design-review`.
- For screens, HUD, menus, responsive layout, visual hierarchy, controls, accessibility, or screenshots, use `jds-ui-review`.
- For visual, UI, gameplay, weapon, monster, HUD, or effect work, read root `DESIGN.md` before proposing or implementing changes.
- Use subagents selectively according to `docs/subagents.md`; the main agent remains responsible for final decisions, integration, and completion claims.
- Before claiming completion, run relevant verification and report the evidence.
- After verification, always suggest both product improvements and Codex workflow improvements.

## User Context and Response Style

- The user is a developer job seeker learning how to use Codex through game development, not a professional game developer.
- Calibrate explanations for that level: explain unfamiliar game-development terms, engine concepts, testing habits, and workflow decisions briefly when they matter.
- When recommending or making changes, include the practical "why" behind the choice so the user can learn the reasoning, not just receive the result.
- Prefer concrete examples, small steps, and beginner-friendly mental models over expert shorthand or unexplained jargon.
- Do not assume the user already knows professional game-production conventions; surface assumptions and tradeoffs in plain language.
- Keep answers concise and action-oriented, but include enough context for the user to understand what Codex is doing and how to repeat the workflow later.
- When relevant, connect work back to job-prep learning value: debugging practice, testing discipline, code-reading habits, Git hygiene, UI/gameplay iteration, or prompt-writing skill.
- Korean is preferred for user-facing explanations unless the user requests another language or the artifact convention requires English.

## Behavioral Guardrails

- Think before coding: state assumptions, surface tradeoffs, and ask when the request is genuinely unclear.
- Keep the solution simple: implement only what was requested, avoid speculative flexibility, and do not add single-use abstractions.
- Make surgical changes: touch only files and lines that directly support the request, and avoid adjacent cleanup or unrelated refactors.
- Match existing project style even when another style seems preferable.
- Clean up only unused imports, variables, functions, or files created by the current change.
- If unrelated dead code or cleanup opportunities appear, mention them instead of editing them.
- Define success criteria for non-trivial work before implementation, then verify against those criteria before claiming completion.
- For bug fixes, prefer a reproducing test or clear reproduction path before changing behavior.
- For multi-step work, keep a brief plan with each step tied to a concrete verification check.

## Repository

Expected GitHub repository:

```text
https://github.com/hojunjeon/JDS
```

Do not commit or push unless the repository, remote, diff, and verification state satisfy `jds-git-sync`.
