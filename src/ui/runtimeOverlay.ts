import type { EventId } from '../types';

export interface RuntimeEventSummary {
  id: EventId;
  active: boolean;
  completed: boolean;
  progress: number;
}

export interface RuntimeHudInput {
  stageTitle: string;
  hp: number;
  maxHp: number;
  kills: number;
  elapsedSec: number;
  weaponCodeName: string;
  events: RuntimeEventSummary[];
  boss: { name: string; hp: number; maxHp: number } | null;
}

export function buildRuntimeHudView(input: RuntimeHudInput) {
  return {
    statusLine: `${input.stageTitle} | ${formatElapsed(input.elapsedSec)} | ${input.weaponCodeName}`,
    vitalsLine: `HP ${Math.max(0, Math.ceil(input.hp))}/${input.maxHp} | kills ${input.kills}`,
    eventLine: input.events.map(formatEvent).join(' | '),
    bossLine: input.boss
      ? `BOSS ${input.boss.name} | HP ${Math.max(0, Math.ceil(input.boss.hp))}/${input.boss.maxHp}`
      : null,
  };
}

export function buildQuestToastView(input: { title: string; dialogue: string; rewardText: string }) {
  return {
    heading: 'EVENT_TRIGGERED',
    body: input.title,
    detail: `reward: ${input.rewardText}`,
    dialogue: input.dialogue,
  };
}

export function buildBossWarningView(input: { name: string; dialogue: string }) {
  return {
    heading: 'BOSS PROCESS ATTACHED',
    name: input.name,
    detail: input.dialogue,
  };
}

function formatElapsed(elapsedSec: number): string {
  const total = Math.max(0, Math.floor(elapsedSec));
  return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`;
}

function formatEvent(event: RuntimeEventSummary): string {
  const status = event.completed ? 'done' : event.active ? 'run' : 'wait';
  return `${event.id}:${status}:${event.progress}`;
}
