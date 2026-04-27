---
name: jds-prompt-diary
description: Use when a JDS user prompt changes the overall development process, collaboration workflow, project direction, prompt habits, specs, plans, commits, or documentation habits.
---

# JDS Prompt Diary

Write a prompt diary when a prompt changes the project at the development-process level, not merely at the feature level.

## Write When

- A new collaboration workflow is decided.
- Codex's role or autonomy changes.
- Planning, testing, review, commit, push, or documentation habits change.
- A major game direction, UI philosophy, or development strategy is chosen.
- The user asks to record the prompt diary.

Usually skip for small bug fixes, minor UI tweaks, routine tests, or config changes with no broader workflow meaning.

## Location

Prefer:

```text
docs/prompt-diary/프롬프트일기_001.md
docs/prompt-diary/프롬프트일기_002.md
```

Use the next available number. If another diary location already exists, follow it.

## Style

Use `프롬프트일기_예시.md` and `references/prompt-diary-template.md` as references. Write like a development journal, not a changelog.

Include:

- 이 시점의 게임
- 그날 상황
- 입력한 프롬프트
- 뭐가 나왔나
- 그래서 어떤 결정을 했나
- 한 줄 회고

Quote only the core user prompt, not the entire conversation.
