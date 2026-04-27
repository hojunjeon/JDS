import { stages } from '../data/gameData';
import type { WeaponId } from '../types';

export type MenuScreen = 'start' | 'stage-select' | 'weapon-select' | 'game-start';

export interface MenuFlowState {
  screen: MenuScreen;
  selectedStageId: number;
  selectedWeapon: WeaponId;
}

export interface StageOption {
  id: number;
  title: string;
  theme: string;
  unlocked: boolean;
  selected: boolean;
}

export type MenuFlowEvent =
  | { type: 'start.confirm' }
  | { type: 'stage.select'; stageId: number }
  | { type: 'stage.confirm' }
  | { type: 'weapon.select'; weapon: WeaponId }
  | { type: 'weapon.confirm' }
  | { type: 'back' };

export function createMenuFlowState(): MenuFlowState {
  return {
    screen: 'start',
    selectedStageId: 1,
    selectedWeapon: 'python',
  };
}

export function getStageOptions(state: MenuFlowState): StageOption[] {
  return stages.map((stage) => ({
    id: stage.id,
    title: stage.title,
    theme: stage.theme,
    unlocked: isStageUnlocked(stage.id),
    selected: stage.id === state.selectedStageId,
  }));
}

export function reduceMenuFlow(state: MenuFlowState, event: MenuFlowEvent): MenuFlowState {
  switch (event.type) {
    case 'start.confirm':
      return { ...state, screen: 'stage-select' };
    case 'stage.select':
      if (!isStageUnlocked(event.stageId)) return state;
      return { ...state, selectedStageId: event.stageId };
    case 'stage.confirm':
      return { ...state, screen: 'weapon-select' };
    case 'weapon.select':
      return { ...state, selectedWeapon: event.weapon };
    case 'weapon.confirm':
      return { ...state, screen: 'game-start' };
    case 'back':
      return back(state);
  }
}

function back(state: MenuFlowState): MenuFlowState {
  if (state.screen === 'weapon-select') return { ...state, screen: 'stage-select' };
  if (state.screen === 'stage-select') return { ...state, screen: 'start' };
  return state;
}

function isStageUnlocked(stageId: number): boolean {
  return stageId === 1;
}
