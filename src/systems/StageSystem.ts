import { stages } from '../data/gameData';
import type { StageConfig } from '../types';

export class StageSystem {
  private currentIndex = 0;

  get current(): StageConfig {
    return stages[this.currentIndex];
  }

  get all(): StageConfig[] {
    return stages;
  }

  advance(): StageConfig {
    this.currentIndex = Math.min(stages.length - 1, this.currentIndex + 1);
    return this.current;
  }

  select(stageId: number): StageConfig {
    const next = stages.findIndex((stage) => stage.id === stageId);
    if (next === -1) throw new Error(`Unknown stage: ${stageId}`);
    this.currentIndex = next;
    return this.current;
  }
}
