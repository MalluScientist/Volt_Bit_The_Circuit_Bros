import Phaser from 'phaser';
import { Boss } from './Boss';
import { Player } from './Player';

export class DiscoDiode extends Boss {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'boss-diode', 'Disco Diode');
    this.maxHealth = this.health = 9;
  }

  tick(time: number, player: Player): void {
    if (time < this.nextAttack) return;
    this.nextAttack = time + (this.phase === 1 ? 1400 : this.phase === 2 ? 1050 : 800);
    const beam = this.scene.add.rectangle(this.x, this.y - 10, 18, 8, 0xffe05d);
    this.scene.physics.add.existing(beam);
    const body = beam.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setVelocityX(player.x < this.x ? -300 : 300);
    beam.setData('damage', 1);
    beam.setData('projectile', true);
    this.scene.time.delayedCall(2200, () => beam.destroy());
    this.setTint(Phaser.Math.RND.pick([0xff3e5f, 0x45c4ff, 0xffe05d]));
    this.scene.time.delayedCall(120, () => this.clearTint());
  }
}
