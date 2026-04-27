export const uiColors = {
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
} as const;

export type UiColorName = keyof typeof uiColors;

export const uiLayout = {
  statusBarHeight: 30,
  panelRadius: 8,
  panelBorderWidth: 1,
  menuMarginX: 52,
  menuMarginY: 42,
  titleBarHeight: 34,
} as const;

export const uiDurations = {
  instant: 120,
  quick: 180,
  standard: 320,
  dramatic: 600,
} as const;

export const uiDepths = {
  gameplay: 0,
  hud: 100,
  banner: 110,
  modal: 200,
  bossWarning: 260,
} as const;

export const uiFonts = {
  mono: 'JetBrains Mono, Space Mono, Consolas, monospace',
  fallbackMono: 'monospace',
} as const;

export function toHexColor(name: UiColorName): number {
  return Number.parseInt(uiColors[name].slice(1), 16);
}
