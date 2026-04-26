---
name: jdy-development-workflow
description: Use when changing JDY features, UI, gameplay, behavior, project workflow, specs, implementation plans, tests, or verification habits.
---

# JDY Development Workflow

Use this as the project-specific wrapper around the installed `superpowers` skills.

## Required Flow

1. Inspect the project structure, scripts, tests, and existing patterns before proposing changes.
2. For visual, UI, gameplay, weapon, monster, HUD, or effect work, read root `DESIGN.md` before proposing or implementing changes.
3. For feature, UI, gameplay, or behavior work, use `superpowers:brainstorming` before implementation.
4. After design approval, use `superpowers:writing-plans` for multi-step work.
5. For features, bug fixes, refactors, and behavior changes, use `superpowers:test-driven-development` unless the user explicitly approves an exception.
6. Before claiming completion, use `superpowers:verification-before-completion`.
7. After verification, always propose both product improvements and Codex workflow improvements.

If a request conflicts with `DESIGN.md`, explain the conflict and ask whether to update the design guide.

## Improvement Review

Product improvements should consider gameplay feel, UI/UX, code structure, tests, performance, accessibility, and edge cases.

Codex workflow improvements should consider prompt clarity, task splitting, useful skills, subagent fit, documentation, specs, plans, tests, and prompt diary needs.

## Request Handling

Prefer this request shape when asking the user for missing details:

```text
[목표] 무엇을 개선하는가
[대상] 화면, 컴포넌트, 기능, 게임 시스템
[원하는 방향] UX, 스타일, 플레이 감각, 제약
[완료 기준] 끝났다고 볼 수 있는 조건
```

Keep unrelated refactors out of scope. Follow existing project patterns unless the current task requires changing them.
