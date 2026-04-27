import { describe, expect, it } from 'vitest';
import { uiColors, uiDepths, uiDurations, uiLayout, toHexColor } from '../src/ui/theme';

describe('JDS UI theme', () => {
  it('matches the DESIGN.md VS Code palette', () => {
    expect(uiColors).toEqual({
      bg: '#1e1e1e',
      sidebar: '#252526',
      status: '#007acc',
      white: '#d4d4d4',
      dim: '#858585',
      teal: '#4ec9b0',
      blue: '#9cdcfe',
      green: '#b5cea8',
      yellow: '#dcdcaa',
      orange: '#ce9178',
      red: '#f44747',
      comment: '#6a9955',
    });
  });

  it('exposes Phaser-friendly numeric colors', () => {
    expect(toHexColor('teal')).toBe(0x4ec9b0);
    expect(toHexColor('red')).toBe(0xf44747);
    expect(toHexColor('bg')).toBe(0x1e1e1e);
  });

  it('keeps stable dimensions and depths for production UI', () => {
    expect(uiLayout.statusBarHeight).toBe(30);
    expect(uiLayout.panelRadius).toBeLessThanOrEqual(8);
    expect(uiLayout.panelBorderWidth).toBe(1);
    expect(uiDurations.quick).toBeLessThan(uiDurations.standard);
    expect(uiDepths.modal).toBeGreaterThan(uiDepths.hud);
    expect(uiDepths.bossWarning).toBeGreaterThan(uiDepths.modal);
  });
});
