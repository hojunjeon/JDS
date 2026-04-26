# AGENTS.md

## Core Rules

- Use relevant `superpowers` and project-local JDY skills before acting.
- Project-local skills live in `.codex/skills/`.
- Keep changes scoped, follow existing project patterns, and avoid unrelated refactors.
- For feature, UI, gameplay, behavior, workflow, spec, plan, or verification changes, use `jdy-development-workflow`.
- For GitHub commit or push decisions, use `jdy-git-sync`.
- For prompt diary decisions or entries, use `jdy-prompt-diary`.
- For gameplay quality, combat, enemies, weapons, rewards, difficulty, pacing, or game-feel review, use `jdy-game-design-review`.
- For screens, HUD, menus, responsive layout, visual hierarchy, controls, accessibility, or screenshots, use `jdy-ui-review`.
- For visual, UI, gameplay, weapon, monster, HUD, or effect work, read root `DESIGN.md` before proposing or implementing changes.
- Before claiming completion, run relevant verification and report the evidence.
- After verification, always suggest both product improvements and Codex workflow improvements.

## Repository

Expected GitHub repository:

```text
https://github.com/hojunjeon/JDY
```

Do not commit or push unless the repository, remote, diff, and verification state satisfy `jdy-git-sync`.
