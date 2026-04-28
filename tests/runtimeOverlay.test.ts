import { describe, expect, it } from 'vitest';
import { buildBossWarningView, buildQuestToastView, buildRuntimeHudView } from '../src/ui/runtimeOverlay';

describe('runtimeOverlay', () => {
  it('builds compact HUD copy', () => {
    const view = buildRuntimeHudView({
      stageTitle: 'Stage 1 - Python Basics',
      hp: 76.3,
      maxHp: 100,
      kills: 18,
      elapsedSec: 83.8,
      weaponCodeName: 'python.auto()',
      events: [
        { id: 'q1', completed: false, active: true, progress: 12 },
        { id: 'e1', completed: true, active: false, progress: 10 },
        { id: 'e2', completed: false, active: false, progress: 0 },
        { id: 'boss', completed: false, active: false, progress: 0 },
      ],
      boss: null,
    });

    expect(view.statusLine).toBe('Stage 1 - Python Basics | 01:23 | python.auto()');
    expect(view.vitalsLine).toBe('HP 77/100 | kills 18');
    expect(view.eventLine).toBe('q1:run:12 | e1:done:10 | e2:wait:0 | boss:wait:0');
    expect(view.bossLine).toBeNull();
  });

  it('builds DOM quest and boss overlay copy', () => {
    expect(buildQuestToastView({
      title: 'E1: indentation panic',
      dialogue: '"IndentationError keeps breaking the lab!"',
      rewardText: 'upgrade currency +3',
    })).toEqual({
      heading: 'EVENT_TRIGGERED',
      body: 'E1: indentation panic',
      detail: 'reward: upgrade currency +3',
      dialogue: '"IndentationError keeps breaking the lab!"',
    });

    expect(buildBossWarningView({
      name: 'Jang Seonhyeong',
      dialogue: 'boss.spawn("I am not losing again!")',
    })).toEqual({
      heading: 'BOSS PROCESS ATTACHED',
      name: 'Jang Seonhyeong',
      detail: 'boss.spawn("I am not losing again!")',
    });
  });
});
