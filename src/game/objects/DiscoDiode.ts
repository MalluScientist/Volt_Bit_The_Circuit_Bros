import Phaser from 'phaser';
import { Boss } from './Boss';
import { Player } from './Player';
import { Hazard } from './Hazard';
import { AngryLED } from './AngryLED';

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
    beam.setData('bossObject', true);
    this.scene.time.delayedCall(2200, () => beam.destroy());
    if (this.phase >= 2) this.summonLed(player);
    if (this.phase >= 3) this.blinkingFloor();
    this.setTint(Phaser.Math.RND.pick([0xff3e5f, 0x45c4ff, 0xffe05d]));
    this.scene.time.delayedCall(120, () => this.clearTint());
  }

  private summonLed(player: Player): void {
    const led = new AngryLED(this.scene, this.x + (player.x < this.x ? -120 : 120), 380);
    led.setData('bossObject', true);
    led.setData('hazard', true);
    led.setData('damage', 1);
    this.scene.time.delayedCall(3600, () => {
      if (led.active) led.destroy();
    });
  }

  private blinkingFloor(): void {
    const hazard = new Hazard(this.scene, this.x + Phaser.Math.Between(-170, 170), 448, 110, 14, 'beam');
    hazard.setData('bossObject', true);
    hazard.setAlpha(0.2);
    this.scene.tweens.add({ targets: hazard, alpha: 0.82, yoyo: true, repeat: 2, duration: 130 });
    this.scene.time.delayedCall(900, () => {
      if (hazard.active) hazard.destroy();
    });
  }
}
