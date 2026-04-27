import { describe, expect, it } from 'vitest';
import { createMenuFlowState } from '../src/ui/menuFlow';
import { renderMenuOverlayHtml } from '../src/ui/menuOverlay';

describe('menuOverlay', () => {
  it('renders the start screen as an IDE boot layout', () => {
    const html = renderMenuOverlayHtml(createMenuFlowState());

    expect(html).toContain('data-screen="start"');
    expect(html).toContain('Explorer');
    expect(html).toContain('JDS');
    expect(html).toContain('Mission Briefing');
    expect(html).toContain('start debug');
  });

  it('renders the stage select pipeline', () => {
    const html = renderMenuOverlayHtml({ ...createMenuFlowState(), screen: 'stage-select' });

    expect(html).toContain('data-screen="stage-select"');
    expect(html).toContain('Stage Pipeline');
    expect(html).toContain('stage_01.python');
    expect(html).toContain('LOCKED');
    expect(html).toContain('continue to weapon select');
  });

  it('renders the weapon select source-file arsenal', () => {
    const html = renderMenuOverlayHtml({ ...createMenuFlowState(), screen: 'weapon-select' });

    expect(html).toContain('data-screen="weapon-select"');
    expect(html).toContain('Weapon Select');
    expect(html).toContain('Python.py');
    expect(html).toContain('C_Cpp.c');
    expect(html).toContain('Java.class');
    expect(html).toContain('start Stage 1');
  });
});
