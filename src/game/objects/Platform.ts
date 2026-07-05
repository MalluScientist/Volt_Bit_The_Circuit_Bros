import Phaser from 'phaser';
import { PlatformSpec } from '../types';

export class Platform extends Phaser.GameObjects.Rectangle {
  kind: NonNullable<PlatformSpec['kind']>;
  baseX: number;
  baseY: number;
  active = true;

  constructor(scene: Phaser.Scene, spec: PlatformSpec, color: number) {
    const fill = spec.kind === 'boost' ? 0x45c4ff : spec.kind === 'bounce' ? 0xff3e5f : spec.kind === 'glitch' ? 0x8e6bff : color;
    super(scene, spec.x, spec.y, spec.w, spec.h, fill, 1);
    this.kind = spec.kind ?? 'solid';
    this.baseX = spec.x;
    this.baseY = spec.y;
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setStrokeStyle(2, 0xf3a33a);
  }

  tick(time: number): void {
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    if (this.kind === 'blink') {
      this.active = Math.floor(time / 900) % 2 === 0;
      this.setAlpha(this.active ? 1 : 0.22);
      body.enable = this.active;
    } else if (this.kind === 'moving') {
      this.x = this.baseX + Math.sin(time / 900 + this.baseX) * 90;
      body.updateFromGameObject();
    } else if (this.kind === 'glitch') {
      this.active = Math.floor((time + this.baseX) / 720) % 3 !== 0;
      this.setAlpha(this.active ? 0.9 : 0.15);
      body.enable = this.active;
    } else if (this.kind === 'bridge') {
      this.setAlpha(0.78 + Math.sin(time / 180) * 0.18);
    }
  }
}
