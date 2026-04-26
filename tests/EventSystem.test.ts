import { describe, expect, it } from 'vitest';
import { stages } from '../src/data/gameData';
import { EventSystem } from '../src/systems/EventSystem';

describe('EventSystem', () => {
  it('triggers time based events', () => {
    const system = new EventSystem(stages[0]);
    expect(system.update(24, 1)).toHaveLength(0);
    expect(system.update(25, 1).map((event) => event.id)).toContain('e1');
  });

  it('completes kill based event progress', () => {
    const system = new EventSystem(stages[0]);
    system.update(25, 1);

    for (let i = 0; i < 9; i += 1) {
      expect(system.notifyKill('indentation_error')).toHaveLength(0);
    }

    const completed = system.notifyKill('indentation_error');
    expect(completed.map((event) => event.id)).toContain('e1');
    expect(system.isCompleted('e1')).toBe(true);
  });

  it('tracks q1 across normal kills', () => {
    const system = new EventSystem(stages[0]);
    for (let i = 0; i < 24; i += 1) {
      system.notifyKill('syntax_error');
    }
    expect(system.isCompleted('q1')).toBe(true);
  });
});
