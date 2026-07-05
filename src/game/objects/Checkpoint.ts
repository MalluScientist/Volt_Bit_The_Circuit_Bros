import Phaser from 'phaser';

export class Checkpoint extends Phaser.Physics.Arcade.Sprite {
  activated = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'checkpoint');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
  }

  activate(): void {
    if (this.activated) return;
    this.activated = true;
    this.setTint(0xffe05d);
  }
}
