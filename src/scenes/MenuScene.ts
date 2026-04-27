import Phaser from 'phaser';
import { stages, starterWeaponConfigs } from '../data/gameData';
import type { WeaponId } from '../types';
import { toHexColor, uiColors, uiFonts, uiLayout } from '../ui/theme';

export class MenuScene extends Phaser.Scene {
  private selectedWeapon: WeaponId = 'python';

  constructor() {
    super('MenuScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(uiColors.bg);
    this.drawTerminalFrame(uiLayout.menuMarginX, uiLayout.menuMarginY, width - 104, height - 84);
    this.drawBootHeader();
    this.drawWeaponSelect();
    this.drawStartCommand(width, height);

    this.input.keyboard?.once('keydown-ENTER', () => this.startGame());
    this.input.keyboard?.on('keydown-ONE', () => this.setWeapon('python'));
    this.input.keyboard?.on('keydown-TWO', () => this.setWeapon('c-cpp'));
    this.input.keyboard?.on('keydown-THREE', () => this.setWeapon('java'));
  }

  private drawBootHeader(): void {
    this.add.text(92, 82, 'JDS\nSURVIVAL', {
      fontFamily: uiFonts.mono,
      fontSize: '46px',
      color: uiColors.white,
      fontStyle: 'bold',
      lineSpacing: -7,
    });

    this.add.text(338, 90, '// SSAFY boot sequence initialized', {
      fontFamily: uiFonts.mono,
      fontSize: '18px',
      color: uiColors.comment,
    });

    this.add.text(340, 128, [
      '[00:00] OK      loaded Python Basics',
      '[00:01] OK      mounted SSAFY classroom',
      '[00:02] WARN    24 unresolved bugs detected',
      '[00:03] ERROR   boss trace appears after 92s',
    ], {
      fontFamily: uiFonts.mono,
      fontSize: '15px',
      color: uiColors.dim,
      lineSpacing: 8,
    });
  }

  private drawWeaponSelect(): void {
    this.add.text(94, 292, 'weapon_select/*', {
      fontFamily: uiFonts.mono,
      fontSize: '16px',
      color: uiColors.yellow,
    });

    starterWeaponConfigs.forEach((weapon, index) => {
      const x = 94 + index * 250;
      const isSelected = weapon.id === this.selectedWeapon;
      const card = this.add.rectangle(x, 350, 220, 108, toHexColor('sidebar'), 1).setOrigin(0, 0);
      card.setStrokeStyle(uiLayout.panelBorderWidth, isSelected ? toHexColor('teal') : toHexColor('dim'), isSelected ? 1 : 0.28);

      const label = this.add.text(x + 16, 366, `${index + 1}. ${weapon.name}`, {
        fontFamily: uiFonts.mono,
        fontSize: '18px',
        color: uiColors.white,
      });
      this.add.text(x + 16, 398, weapon.codeName, {
        fontFamily: uiFonts.mono,
        fontSize: '13px',
        color: uiColors.teal,
      });
      this.add.text(x + 16, 424, `${weapon.damage} dmg / ${weapon.cooldownMs}ms\n${isSelected ? 'selected' : 'available'}`, {
        fontFamily: uiFonts.mono,
        fontSize: '12px',
        color: isSelected ? uiColors.green : uiColors.dim,
        lineSpacing: 5,
      });

      card.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
        this.selectedWeapon = weapon.id;
        this.scene.restart();
      });
      label.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
        this.selectedWeapon = weapon.id;
        this.scene.restart();
      });
    });
  }

  private drawStartCommand(width: number, height: number): void {
    this.add.text(94, height - 174, 'jiyoon@ssafy:~/stage1$ npm run survive', {
      fontFamily: uiFonts.mono,
      fontSize: '16px',
      color: uiColors.teal,
    });

    const start = this.add.text(94, height - 126, '[ ENTER ] start debug session', {
      fontFamily: uiFonts.mono,
      fontSize: '24px',
      color: uiColors.bg,
      backgroundColor: uiColors.teal,
      padding: { left: 16, right: 16, top: 10, bottom: 10 },
    });
    start.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.startGame());

    this.add.text(width - 360, height - 132, `roadmap: ${stages.length} stages\ncurrent: ${stages[0].title}`, {
      fontFamily: uiFonts.mono,
      fontSize: '15px',
      color: uiColors.dim,
      lineSpacing: 7,
    });
  }

  private setWeapon(id: WeaponId): void {
    this.selectedWeapon = id;
    this.scene.restart();
  }

  private startGame(): void {
    this.scene.start('GameScene', { weapon: this.selectedWeapon });
  }

  private drawTerminalFrame(x: number, y: number, w: number, h: number): void {
    const g = this.add.graphics();
    g.fillStyle(toHexColor('bg'), 0.96);
    g.fillRoundedRect(x, y, w, h, uiLayout.panelRadius);
    g.lineStyle(uiLayout.panelBorderWidth, toHexColor('dim'), 0.32);
    g.strokeRoundedRect(x, y, w, h, uiLayout.panelRadius);
    g.fillStyle(toHexColor('sidebar'), 1);
    g.fillRoundedRect(x, y, w, uiLayout.titleBarHeight, uiLayout.panelRadius);
    g.fillStyle(0xff5c7a).fillCircle(x + 18, y + 17, 5);
    g.fillStyle(toHexColor('yellow')).fillCircle(x + 36, y + 17, 5);
    g.fillStyle(toHexColor('teal')).fillCircle(x + 54, y + 17, 5);
  }
}
