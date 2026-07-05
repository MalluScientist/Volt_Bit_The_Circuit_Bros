import { Enemy } from './Enemy';
import { Player } from './Player';

export class SparkSlime extends Enemy {
  private dir = -1;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy-slime');
    this.scoreValue = 90;
    this.setVelocityX(-70);
    this.setSize(28, 18);
  }

  tick(_time: number, _player: Player): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.left || body.blocked.right || Math.abs(this.x - this.spawnX) > 130) this.dir *= -1;
    body.setVelocityX(70 * this.dir);
    this.setFlipX(this.dir > 0);
  }
}
