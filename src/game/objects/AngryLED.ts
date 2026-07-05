import { Enemy } from './Enemy';
import { Player } from './Player';

export class AngryLED extends Enemy {
  private nextHop = 0;
  private nextCharge = 1200;
  private charging = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy-led');
    this.scoreValue = 120;
    this.setSize(22, 22);
  }

  tick(time: number, player: Player): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (time > this.nextCharge && !this.charging) {
      this.charging = true;
      this.setTint(0xffe05d);
      this.scene.time.delayedCall(450, () => {
        if (!this.active) return;
        body.setVelocityX(player.x < this.x ? -210 : 210);
        this.clearTint();
        this.nextCharge = time + 2200;
        this.charging = false;
      });
    }
    if (time > this.nextHop && body.blocked.down) {
      body.setVelocityY(-260);
      this.nextHop = time + 850;
    }
  }
}
