import Phaser from 'phaser';
import { Enemy } from './Enemy';
import { Player } from './Player';

export class GlitchBug extends Enemy {
  private nextBurst = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy-bug');
    this.scoreValue = 170;
    this.health = 2;
  }

  tick(time: number, _player: Player): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (time > this.nextBurst) {
      body.setVelocity(Phaser.Math.Between(-170, 170), Phaser.Math.Between(-280, -90));
      this.nextBurst = time + Phaser.Math.Between(700, 1300);
      this.setTint(Phaser.Math.RND.pick([0x45c4ff, 0xff3e5f, 0x77ff4f]));
      this.scene.time.delayedCall(120, () => this.clearTint());
    }
  }
}
