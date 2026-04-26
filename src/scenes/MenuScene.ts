import Phaser from 'phaser';
import { stages, starterWeaponConfigs } from '../data/gameData';
import type { WeaponId } from '../types';

export class MenuScene extends Phaser.Scene {
  private selectedWeapon: WeaponId = 'python';

  constructor() {
    super('MenuScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#07090f');
    this.drawTerminalFrame(52, 42, width - 104, height - 84);

    this.add.text(92, 82, 'JY_SURVIVAL', {
      fontFamily: 'monospace',
      fontSize: '42px',
      color: '#d7dee8',
      fontStyle: 'bold',
    });
    this.add.text(94, 136, '김지윤의 디버그 서바이벌 // Codex renewal', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#65d6ad',
    });
    this.add.text(94, 190, [
      '$ npm run survive',
      '> fix bug waves, rescue events, defeat Jang Seonhyeong',
      '> roadmap loaded: Stage 1-6',
    ], {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#9aa8bd',
      lineSpacing: 10,
    });

    this.add.text(94, 298, 'select starter weapon', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#f5c542',
    });

    starterWeaponConfigs.forEach((weapon, index) => {
      const x = 94 + index * 250;
      const card = this.add.rectangle(x, 350, 220, 98, 0x111827, 1).setOrigin(0, 0);
      card.setStrokeStyle(1, weapon.id === this.selectedWeapon ? 0x65d6ad : 0x2f3b52);
      const label = this.add.text(x + 16, 366, `${index + 1}. ${weapon.name}`, {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#d7dee8',
      });
      this.add.text(x + 16, 398, weapon.codeName, {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#65d6ad',
      });
      this.add.text(x + 16, 424, `${weapon.damage} dmg / ${weapon.cooldownMs}ms`, {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#9aa8bd',
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

    const start = this.add.text(94, height - 118, '[ ENTER ] start Stage 1', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#05070d',
      backgroundColor: '#65d6ad',
      padding: { left: 16, right: 16, top: 10, bottom: 10 },
    });
    start.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.startGame());

    this.add.text(width - 360, height - 130, `current roadmap: ${stages.length} stages`, {
      fontFamily: 'monospace',
      fontSize: '15px',
      color: '#9aa8bd',
    });

    this.input.keyboard?.once('keydown-ENTER', () => this.startGame());
    this.input.keyboard?.on('keydown-ONE', () => this.setWeapon('python'));
    this.input.keyboard?.on('keydown-TWO', () => this.setWeapon('c-cpp'));
    this.input.keyboard?.on('keydown-THREE', () => this.setWeapon('java'));
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
    g.fillStyle(0x0b1020, 0.96);
    g.fillRoundedRect(x, y, w, h, 8);
    g.lineStyle(1, 0x2f3b52);
    g.strokeRoundedRect(x, y, w, h, 8);
    g.fillStyle(0x171d2e, 1);
    g.fillRoundedRect(x, y, w, 34, 8);
    g.fillStyle(0xff5c7a).fillCircle(x + 18, y + 17, 5);
    g.fillStyle(0xf5c542).fillCircle(x + 36, y + 17, 5);
    g.fillStyle(0x65d6ad).fillCircle(x + 54, y + 17, 5);
  }
}
