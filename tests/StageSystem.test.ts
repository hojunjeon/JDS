import { describe, expect, it } from 'vitest';
import { StageSystem } from '../src/systems/StageSystem';

describe('StageSystem', () => {
  it('starts at Stage 1 and advances conservatively', () => {
    const system = new StageSystem();
    expect(system.current.id).toBe(1);
    expect(system.advance().id).toBe(2);
  });

  it('selects an explicit stage', () => {
    const system = new StageSystem();
    expect(system.select(6).title).toContain('Django');
  });
});
