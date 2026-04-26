import { describe, expect, it } from 'vitest';
import { WeaponSystem } from '../src/systems/WeaponSystem';

describe('WeaponSystem', () => {
  it('fires owned weapons when cooldown expires', () => {
    const system = new WeaponSystem();
    system.addWeapon('python');
    expect(system.update(249)).toHaveLength(0);
    expect(system.update(1).map((weapon) => weapon.id)).toEqual(['python']);
  });

  it('does not duplicate owned weapons', () => {
    const system = new WeaponSystem();
    system.addWeapon('python');
    system.addWeapon('python');
    expect(system.getOwned()).toHaveLength(1);
  });

  it('caps level ups at 5', () => {
    const system = new WeaponSystem();
    system.addWeapon('java');
    for (let i = 0; i < 10; i += 1) system.levelUp('java');
    expect(system.getOwned()[0].level).toBe(5);
  });
});
