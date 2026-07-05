import { Enemy } from './Enemy';
import { Player } from './Player';

export class BatteryBat extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy-bat');
    this.scoreValue = 150;
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
  }

  tick(time: number, _player: Player): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(Math.sin(time / 900 + this.spawnX) * 95);
    body.setVelocityY(Math.sin(time / 260 + this.spawnY) * 55);
  }
}
