export type WeaponId =
  | 'python'
  | 'c-cpp'
  | 'java'
  | 'git'
  | 'sql'
  | 'javascript'
  | 'django'
  | 'linux-bash';

export type EnemyId =
  | 'syntax_error'
  | 'null_pointer'
  | 'seg_fault'
  | 'heal_bug'
  | 'indentation_error'
  | 'env_error'
  | 'time_limit'
  | 'layout_bug'
  | 'deadlock'
  | 'hallucination'
  | 'migration_error';

export type EventId = 'q1' | 'e1' | 'e2' | 'boss';

export interface WeaponConfig {
  id: WeaponId;
  name: string;
  codeName: string;
  description: string;
  cooldownMs: number;
  damage: number;
  projectileSpeed: number;
  color: number;
  unlock: 'starter' | 'reward';
}

export interface EnemyConfig {
  id: EnemyId;
  label: string;
  hp: number;
  speed: number;
  contactDamage: number;
  color: number;
  radius: number;
  behavior: 'chase' | 'flee' | 'tank' | 'event';
}

export interface StageEventConfig {
  id: EventId;
  title: string;
  triggerAtSec?: number;
  targetEnemy?: EnemyId;
  targetCount?: number;
  surviveSec?: number;
  rewardText: string;
  dialogue: string;
}

export interface StageConfig {
  id: number;
  title: string;
  theme: string;
  starterWeapons: WeaponId[];
  enemyPool: EnemyId[];
  events: StageEventConfig[];
  boss: {
    name: string;
    hp: number;
    color: number;
    dialogue: string;
  };
}

export interface RuntimeEventState {
  id: EventId;
  active: boolean;
  completed: boolean;
  progress: number;
  elapsedSec: number;
}
