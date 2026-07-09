import Phaser from 'phaser';
import { Boss } from './Boss';
import { Player } from './Player';
import { Hazard } from './Hazard';
import { Platform } from './Platform';

export class LooseConnection extends Boss {
  private sockets: Phaser.Math.Vector2[];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'boss-loose', 'The Loose Connection');
    this.maxHealth = this.health = 9;
    this.sockets = [
      new Phaser.Math.Vector2(x - 180, y),
      new Phaser.Math.Vector2(x, y - 80),
      new Phaser.Math.Vector2(x + 180, y)
    ];
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
  }

  tick(time: number, _player: Player): void {
    if (time < this.nextAttack) return;
    this.nextAttack = time + (this.phase === 1 ? 1450 : this.phase === 2 ? 1100 : 850);
    const socket = Phaser.Math.RND.pick(this.sockets);
    this.setPosition(socket.x, socket.y);
    this.setAlpha(0.35);
    this.scene.time.delayedCall(160, () => this.setAlpha(1));
    const shock = new Hazard(this.scene, socket.x, socket.y + 78, 94, 16, 'shock');
    shock.setData('bossObject', true);
    this.scene.time.delayedCall(720, () => shock.destroy());
    const platform = new Platform(this.scene, { x: socket.x, y: socket.y + 20, w: 86, h: 14, kind: 'glitch' }, 0x8e6bff);
    platform.setData('bossObject', true);
    this.scene.time.delayedCall(1400, () => platform.destroy());
    if (this.phase >= 3) this.spawnGlitchClone(socket);
  }

  private spawnGlitchClone(socket: Phaser.Math.Vector2): void {
    const clone = this.scene.add.rectangle(socket.x + Phaser.Math.RND.pick([-92, 92]), socket.y, 46, 50, 0x8e6bff, 0.35).setStrokeStyle(2, 0xf7fff7, 0.4);
    this.scene.physics.add.existing(clone);
    const body = clone.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setVelocityX(clone.x < this.x ? -120 : 120);
    clone.setData('projectile', true);
    clone.setData('bossObject', true);
    clone.setData('damage', 1);
    this.scene.time.delayedCall(1100, () => {
      if (clone.active) clone.destroy();
    });
  }
}
