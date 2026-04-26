import type { WeaponConfig, WeaponId } from '../types';
import { weapons } from '../data/gameData';

export interface OwnedWeapon {
  id: WeaponId;
  level: number;
  cooldownLeftMs: number;
}

export class WeaponSystem {
  private readonly owned = new Map<WeaponId, OwnedWeapon>();

  addWeapon(id: WeaponId): void {
    if (this.owned.has(id)) return;
    this.owned.set(id, { id, level: 1, cooldownLeftMs: 250 });
  }

  levelUp(id: WeaponId): void {
    const weapon = this.owned.get(id);
    if (!weapon) return;
    weapon.level = Math.min(5, weapon.level + 1);
  }

  update(dtMs: number): WeaponConfig[] {
    const ready: WeaponConfig[] = [];
    for (const owned of this.owned.values()) {
      owned.cooldownLeftMs = Math.max(0, owned.cooldownLeftMs - dtMs);
      const config = weapons[owned.id];
      if (owned.cooldownLeftMs === 0) {
        ready.push(config);
        owned.cooldownLeftMs = Math.max(140, config.cooldownMs * (1 - (owned.level - 1) * 0.08));
      }
    }
    return ready;
  }

  getOwned(): OwnedWeapon[] {
    return [...this.owned.values()].map((weapon) => ({ ...weapon }));
  }
}
