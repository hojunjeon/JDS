import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    this.createCircleTexture('player', 0x4fc3f7, 16, 0x0ff0d0);
    this.createCircleTexture('projectile', 0xd7dee8, 5);
    this.createCircleTexture('boss', 0xff5c7a, 34, 0xffffff);
    this.scene.start('MenuScene');
  }

  private createCircleTexture(key: string, color: number, radius: number, stroke?: number): void {
    const gfx = this.add.graphics();
    gfx.fillStyle(color, 1);
    gfx.fillCircle(radius + 2, radius + 2, radius);
    if (stroke) {
      gfx.lineStyle(2, stroke, 1);
      gfx.strokeCircle(radius + 2, radius + 2, radius);
    }
    gfx.generateTexture(key, radius * 2 + 4, radius * 2 + 4);
    gfx.destroy();
  }
}
