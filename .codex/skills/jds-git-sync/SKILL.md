---
name: jds-git-sync
description: Use when committing, pushing, syncing with GitHub, checking remotes, or deciding whether JDS changes should be committed or pushed.
---

# JDS Git Sync

Use this skill for commit and push decisions in the JDS project.

## Repository

Expected remote:

```text
https://github.com/hojunjeon/JDS
```

## Commit And Push Gate

Commit and push only when all are true:

- The workspace is a Git repository.
- `git remote -v` points to the expected repository.
- Verification for the current task has been run and reported.
- The diff contains only current-task changes or clearly separable files.
- No unrelated user changes are staged.
- The commit message accurately describes the change.

Do not commit or push when the repo is missing, remote is unexpected, verification has not run, unrelated changes are mixed in, or the user says not to.

## Procedure

1. Run `git status --short --branch`.
2. Run `git remote -v`.
3. Inspect relevant diffs before staging.
4. Stage only task-related files.
5. Commit with a concise conventional message, for example `docs: add JDS workflow skills`.
6. Push only after commit succeeds and branch/remote are clear.
7. Report commit hash and push result.

If Git is not initialized, explain the blocker and suggest:

```powershell
git init
git remote add origin https://github.com/hojunjeon/JDS
```
