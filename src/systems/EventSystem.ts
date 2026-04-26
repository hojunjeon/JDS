import type { EventId, RuntimeEventState, StageConfig, StageEventConfig } from '../types';

export class EventSystem {
  private readonly configs: StageEventConfig[];
  private readonly states = new Map<EventId, RuntimeEventState>();

  constructor(stage: StageConfig) {
    this.configs = stage.events;
    for (const event of this.configs) {
      this.states.set(event.id, {
        id: event.id,
        active: false,
        completed: false,
        progress: 0,
        elapsedSec: 0,
      });
    }
  }

  update(totalElapsedSec: number, dt: number): StageEventConfig[] {
    const triggered: StageEventConfig[] = [];
    for (const config of this.configs) {
      const state = this.mustState(config.id);
      if (state.completed) continue;
      if (state.active) {
        state.elapsedSec += dt;
        if (config.surviveSec && state.elapsedSec >= config.surviveSec) {
          this.complete(config.id);
        }
        continue;
      }
      if (config.triggerAtSec !== undefined && totalElapsedSec >= config.triggerAtSec) {
        state.active = true;
        triggered.push(config);
      }
    }
    return triggered;
  }

  notifyKill(enemyId: string): StageEventConfig[] {
    const completed: StageEventConfig[] = [];
    for (const config of this.configs) {
      const state = this.mustState(config.id);
      if (!state.active || state.completed || config.targetEnemy !== enemyId) continue;
      state.progress += 1;
      if (config.targetCount && state.progress >= config.targetCount) {
        this.complete(config.id);
        completed.push(config);
      }
    }
    const q1 = this.states.get('q1');
    const q1Config = this.configs.find((event) => event.id === 'q1');
    if (q1 && q1Config && !q1.completed) {
      q1.active = true;
      q1.progress += 1;
      if (q1Config.targetCount && q1.progress >= q1Config.targetCount) {
        this.complete('q1');
        completed.push(q1Config);
      }
    }
    return completed;
  }

  complete(id: EventId): void {
    const state = this.mustState(id);
    state.completed = true;
    state.active = false;
  }

  getState(id: EventId): RuntimeEventState {
    return { ...this.mustState(id) };
  }

  isCompleted(id: EventId): boolean {
    return this.mustState(id).completed;
  }

  getActiveEvents(): RuntimeEventState[] {
    return [...this.states.values()].filter((state) => state.active).map((state) => ({ ...state }));
  }

  private mustState(id: EventId): RuntimeEventState {
    const state = this.states.get(id);
    if (!state) throw new Error(`Unknown event: ${id}`);
    return state;
  }
}
