---
name: jds-game-design-review
description: Use when reviewing or improving JDS gameplay, combat, enemies, weapons, rewards, difficulty, pacing, feedback, game feel, or Phaser game systems.
---

# JDS Game Design Review

Use this skill to evaluate gameplay changes beyond code correctness.

## Design Reference

Before reviewing or changing gameplay, weapons, monsters, effects, HUD, or Phaser systems, read root `DESIGN.md`.

If the request conflicts with `DESIGN.md`, explain the conflict and ask whether to update the design guide.

## Review Axes

- Core loop: Does the action, reward, and next decision form a clear loop?
- Game feel: Are movement, attacks, hit feedback, timing, and visual response readable?
- Difficulty: Does challenge rise without sudden unfair spikes?
- Rewards: Do upgrades, events, and drops create meaningful choices?
- Enemy design: Are patterns distinguishable and learnable?
- Feedback: Can the player tell what happened, why, and what to do next?
- Scope: Is the improvement small enough to implement and verify now?

## Output

After implementation or design review, separate findings into:

- Keep: what supports the intended game direction
- Improve now: small changes that fit the current task
- Defer: larger ideas for later specs

Prefer concrete, testable suggestions over broad statements like "make it more fun."
