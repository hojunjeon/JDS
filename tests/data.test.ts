import { describe, expect, it } from 'vitest';
import { enemies, stages, weapons } from '../src/data/gameData';

describe('game data', () => {
  it('defines a six-stage roadmap', () => {
    expect(stages).toHaveLength(6);
    expect(stages.map((stage) => stage.id)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('keeps Stage 1 playable from starter weapons to boss', () => {
    const stage = stages[0];
    expect(stage.starterWeapons).toEqual(['python', 'c-cpp', 'java']);
    expect(stage.events.map((event) => event.id)).toEqual(['q1', 'e1', 'e2', 'boss']);
    expect(stage.boss.hp).toBeGreaterThan(0);
  });

  it('references existing weapon and enemy configs', () => {
    for (const stage of stages) {
      stage.starterWeapons.forEach((id) => expect(weapons[id]).toBeDefined());
      stage.enemyPool.forEach((id) => expect(enemies[id]).toBeDefined());
    }
  });
});
