import { describe, expect, it } from 'vitest';
import { createMenuFlowState, getStageOptions, reduceMenuFlow } from '../src/ui/menuFlow';

describe('menuFlow', () => {
  it('starts on the boot screen with Stage 1 and Python selected', () => {
    const state = createMenuFlowState();

    expect(state).toEqual({
      screen: 'start',
      selectedStageId: 1,
      selectedWeapon: 'python',
    });
  });

  it('moves from start to stage select to weapon select to game start', () => {
    const stageSelect = reduceMenuFlow(createMenuFlowState(), { type: 'start.confirm' });
    const weaponSelect = reduceMenuFlow(stageSelect, { type: 'stage.confirm' });
    const selectedWeapon = reduceMenuFlow(weaponSelect, { type: 'weapon.select', weapon: 'java' });
    const gameStart = reduceMenuFlow(selectedWeapon, { type: 'weapon.confirm' });

    expect(stageSelect.screen).toBe('stage-select');
    expect(weaponSelect.screen).toBe('weapon-select');
    expect(selectedWeapon.selectedWeapon).toBe('java');
    expect(gameStart).toEqual({
      screen: 'game-start',
      selectedStageId: 1,
      selectedWeapon: 'java',
    });
  });

  it('marks later stages as locked previews without selecting them', () => {
    const state = reduceMenuFlow(createMenuFlowState(), { type: 'start.confirm' });
    const options = getStageOptions(state);
    const nextState = reduceMenuFlow(state, { type: 'stage.select', stageId: 2 });

    expect(options.map((stage) => ({
      id: stage.id,
      unlocked: stage.unlocked,
      selected: stage.selected,
    }))).toEqual([
      { id: 1, unlocked: true, selected: true },
      { id: 2, unlocked: false, selected: false },
      { id: 3, unlocked: false, selected: false },
      { id: 4, unlocked: false, selected: false },
      { id: 5, unlocked: false, selected: false },
      { id: 6, unlocked: false, selected: false },
    ]);
    expect(nextState.selectedStageId).toBe(1);
  });

  it('supports back navigation across Phase 1 screens', () => {
    const stageSelect = reduceMenuFlow(createMenuFlowState(), { type: 'start.confirm' });
    const weaponSelect = reduceMenuFlow(stageSelect, { type: 'stage.confirm' });

    expect(reduceMenuFlow(weaponSelect, { type: 'back' }).screen).toBe('stage-select');
    expect(reduceMenuFlow(stageSelect, { type: 'back' }).screen).toBe('start');
  });
});
