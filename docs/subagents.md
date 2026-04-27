# JDS Subagent Operating Guide

## Purpose

JDS keeps one main Codex agent responsible for the whole workflow. Subagents are optional helpers for bounded work that can run in parallel or provide an independent review. They do not replace the project-local JDS skills or the `superpowers` workflow.

The main agent remains responsible for:

- choosing the relevant JDS skills;
- reading `DESIGN.md` when visual, UI, gameplay, weapon, monster, HUD, or effect work is involved;
- deciding the final approach;
- integrating results;
- protecting user changes;
- running and reporting verification before completion.

## Starting Subagents

### Explorer

Use for read-only project discovery.

Responsibilities:

- find related files, scripts, tests, and existing patterns;
- identify likely impact areas and edge cases;
- report file paths and concise findings;
- avoid file edits.

Good fit:

- unfamiliar systems;
- medium or large feature work;
- broad UI, gameplay, or behavior changes;
- tasks where impact scope is uncertain.

Avoid for:

- trivial single-file changes;
- questions already answered by recent local context.

Prompt shape:

```text
You are the JDS Explorer subagent. Investigate the requested area read-only.
Use relevant JDS skills and consider DESIGN.md if UI, gameplay, visual, weapon, monster, HUD, or effect behavior is involved.
Return related files, existing patterns, tests, risks, and recommended next checks. Do not edit files.
```

### Design Reviewer

Use for independent design, UI, UX, gameplay, and game-feel checks.

Responsibilities:

- compare the request and proposed approach with `DESIGN.md`;
- check visual hierarchy, controls, HUD/menu behavior, feedback, pacing, difficulty, and game feel as relevant;
- report conflicts, risks, and concrete recommendations;
- avoid file edits unless explicitly assigned.

Good fit:

- UI, HUD, menu, responsive layout, visual effect, weapon, monster, reward, difficulty, combat, or pacing changes;
- requests that may conflict with established JDS design direction.

Avoid for:

- backend-only or tooling-only changes;
- simple copy or config edits.

Prompt shape:

```text
You are the JDS Design Reviewer subagent. Review the request against DESIGN.md and relevant JDS UI/game design skills.
Focus on conflicts, UX/gameplay risks, missing states, feedback, accessibility, and concrete improvements. Do not edit files.
```

### Worker

Use for bounded implementation when the write scope can be clearly separated.

Responsibilities:

- edit only the assigned files or module area;
- follow existing project patterns;
- preserve user changes and do not revert unrelated work;
- add or update focused tests when appropriate;
- report changed files and verification performed.

Good fit:

- isolated components or systems;
- large tasks that can be split into disjoint write areas;
- implementation that does not require broad architectural judgment.

Avoid for:

- ambiguous design decisions;
- changes touching the same files as another active worker;
- cross-cutting refactors without a precise ownership boundary.

Prompt shape:

```text
You are the JDS Worker subagent. You are not alone in the codebase.
Own only these files/modules: <paths>.
Do not revert edits made by others. Follow JDS patterns and relevant skills.
Implement the assigned change, update focused tests if needed, and report changed files plus verification.
```

### Verifier

Use for independent verification after implementation or before commit/push decisions.

Responsibilities:

- run relevant tests, builds, lint, screenshots, or manual checks;
- inspect failures and likely causes;
- check whether completion claims are supported by evidence;
- report residual risks and missing verification.

Good fit:

- medium or large changes;
- UI/gameplay changes needing browser or screenshot checks;
- bug fixes where regression risk matters;
- commit or push preparation.

Avoid for:

- tiny documentation-only changes where direct review is enough.

Prompt shape:

```text
You are the JDS Verifier subagent. Independently verify the completed change.
Run relevant checks, inspect failures, and report evidence, residual risks, and missing coverage. Do not broaden the implementation scope.
```

## Call Criteria By Task Size

### Small

Examples:

- one-line or single-file bug fix;
- copy change;
- small config or documentation edit;
- obvious CSS tweak.

Default:

- main agent only.

Optional:

- Verifier only if the change has user-visible or release risk.

Avoid:

- Explorer, Design Reviewer, or Worker unless the scope is unexpectedly unclear.

### Medium

Examples:

- focused feature;
- two to five related files;
- known UI or gameplay area;
- bug fix with moderate regression risk.

Default:

- Explorer when impact scope is not already clear;
- Verifier after implementation.

Add:

- Design Reviewer for UI, HUD, visual, gameplay, weapon, monster, reward, difficulty, combat, pacing, or effect work.

Use Worker only when:

- ownership can be limited to a clear file or module set.

### Large

Examples:

- new gameplay system;
- broad UI or HUD redesign;
- cross-module behavior change;
- refactor with tests and runtime verification;
- release-sensitive change.

Default:

- Explorer;
- Design Reviewer when product-facing or gameplay-facing;
- one or more Workers only with disjoint write ownership;
- Verifier before completion.

Rules:

- the main agent must write or maintain the integration plan;
- Workers must not share file ownership;
- Verifier should run after integration, not only after isolated worker changes.

## Operating Rules

- Do not spawn subagents by default for every request.
- Prefer read-only subagents before implementation subagents.
- Give every subagent a narrow task, clear scope, and expected output format.
- For code-writing subagents, define file or module ownership explicitly.
- The main agent must not delegate the immediate blocking task if it needs the result before doing anything useful.
- The main agent must integrate and sanity-check subagent output before acting on it.
- Completion still requires relevant verification and a concise report of evidence.

