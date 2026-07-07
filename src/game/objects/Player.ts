import Phaser from 'phaser';
import { PowerUpType } from '../types';
import { AudioSystem } from '../systems/AudioSystem';
import { burst } from '../systems/ParticleSystem';

type PlayerState = 'idle' | 'run' | 'jump' | 'fall' | 'attack';

export class Player extends Phaser.Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  keys: Record<'a' | 'd' | 'w' | 'j' | 'k' | 'r' | 'esc', Phaser.Input.Keyboard.Key>;
  health = 5;
  maxHealth = 5;
  coins = 0;
  score = 0;
  powerUp: PowerUpType = 'None';
  powerUntil = 0;
  hasShield = false;
  checkpoint = new Phaser.Math.Vector2(80, 320);
  attackBox: Phaser.GameObjects.Rectangle;
  invulnerableUntil = 0;
  lastGroundedAt = 0;
  jumpBufferedAt = -999;
  dashAvailableAt = 0;
  dashEnergy = 1;
  isDashing = false;
  state: PlayerState = 'idle';

  private audio: AudioSystem;
  private facing = 1;
  private attackingUntil = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, audio: AudioSystem) {
    super(scene, x, y, 'volt-idle');
    this.audio = audio;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(false);
    this.setSize(24, 34).setOffset(4, 2);
    this.setDragX(1700);
    this.setMaxVelocity(420, 780);
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.keys = {
      a: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      d: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      w: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      j: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.J),
      k: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.K),
      r: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R),
      esc: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    };
    this.attackBox = scene.add.rectangle(x, y, 34, 24, 0x45c4ff, 0.25).setVisible(false);
    scene.physics.add.existing(this.attackBox);
    (this.attackBox.body as Phaser.Physics.Arcade.Body).setAllowGravity(false).setEnable(false);
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    const body = this.body as Phaser.Physics.Arcade.Body;
    const grounded = body.blocked.down || body.touching.down;
    const accel = this.powerUp === 'Battery Boost' ? 1700 : 1300;
    const max = this.powerUp === 'Battery Boost' ? 330 : 270;
    if (grounded) this.lastGroundedAt = time;
    if (Phaser.Input.Keyboard.JustDown(this.cursors.space!) || Phaser.Input.Keyboard.JustDown(this.keys.w) || Phaser.Input.Keyboard.JustDown(this.cursors.up!)) {
      this.jumpBufferedAt = time;
    }
    const left = this.cursors.left?.isDown || this.keys.a.isDown;
    const right = this.cursors.right?.isDown || this.keys.d.isDown;
    if (!this.isDashing) {
      if (left) {
        body.setAccelerationX(-accel);
        this.facing = -1;
      } else if (right) {
        body.setAccelerationX(accel);
        this.facing = 1;
      } else {
        body.setAccelerationX(0);
      }
      body.setMaxVelocity(max, 780);
    }
    if (time - this.jumpBufferedAt < 150 && time - this.lastGroundedAt < 140) {
      body.setVelocityY(-570);
      this.jumpBufferedAt = -999;
      this.lastGroundedAt = -999;
      this.audio.jump();
    }
    const jumpHeld = this.cursors.space?.isDown || this.keys.w.isDown || this.cursors.up?.isDown;
    if (!jumpHeld && body.velocity.y < -140) body.setVelocityY(body.velocity.y + 20 * (delta / 16.6));
    if (Phaser.Input.Keyboard.JustDown(this.keys.k) && time >= this.dashAvailableAt) this.dash(time);
    if (Phaser.Input.Keyboard.JustDown(this.keys.j)) this.attack(time);
    if (this.powerUp !== 'None' && this.powerUp !== 'Fuse Shield' && time > this.powerUntil) this.powerUp = 'None';
    if (this.powerUp === 'Battery Boost') this.dashAvailableAt = Math.min(this.dashAvailableAt, time + 450);
    this.dashEnergy = Phaser.Math.Clamp(1 - Math.max(0, this.dashAvailableAt - time) / this.dashCooldown(), 0, 1);
    this.attackBox.setPosition(this.x + this.facing * (this.powerUp === 'Solder Sword' ? 34 : 26), this.y + 2);
    if (time > this.attackingUntil) {
      this.attackBox.setVisible(false);
      (this.attackBox.body as Phaser.Physics.Arcade.Body).setEnable(false);
    }
    this.setFlipX(this.facing < 0);
    this.updateState(grounded);
    this.setAlpha(time < this.invulnerableUntil && Math.floor(time / 80) % 2 === 0 ? 0.45 : 1);
  }

  takeDamage(amount = 1, knockbackFrom?: number): boolean {
    const time = this.scene.time.now;
    if (time < this.invulnerableUntil) return false;
    if (this.hasShield || this.powerUp === 'Fuse Shield') {
      this.hasShield = false;
      this.powerUp = 'None';
      this.invulnerableUntil = time + 700;
      burst(this.scene, this.x, this.y, 0x45c4ff, 16);
      return false;
    }
    this.health -= amount;
    this.invulnerableUntil = time + 1300;
    const dir = knockbackFrom === undefined || this.x >= knockbackFrom ? 1 : -1;
    this.setVelocity(260 * dir, -260);
    this.audio.hit();
    burst(this.scene, this.x, this.y, 0xff3e5f, 12);
    return this.health <= 0;
  }

  heal(amount = 1): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  applyPower(power: PowerUpType): void {
    this.powerUp = power;
    if (power === 'Fuse Shield') this.hasShield = true;
    this.powerUntil = this.scene.time.now + 9000;
  }

  restartAtCheckpoint(): void {
    this.setPosition(this.checkpoint.x, this.checkpoint.y);
    this.setVelocity(0, 0);
    this.health = Math.max(1, this.health);
  }

  private dash(time: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    this.isDashing = true;
    body.setAllowGravity(false);
    body.setAcceleration(0, 0);
    body.setVelocity(this.facing * 560, 0);
    this.dashAvailableAt = time + this.dashCooldown();
    burst(this.scene, this.x - this.facing * 12, this.y, 0x45c4ff, 8);
    this.scene.time.delayedCall(150, () => {
      if (!this.active) return;
      this.isDashing = false;
      body.setAllowGravity(true);
    });
  }

  private attack(time: number): void {
    this.attackingUntil = time + 150;
    this.state = 'attack';
    this.setTexture('volt-attack');
    const body = this.attackBox.body as Phaser.Physics.Arcade.Body;
    this.attackBox.setSize(this.powerUp === 'Solder Sword' ? 64 : 42, 26).setVisible(true);
    body.setSize(this.powerUp === 'Solder Sword' ? 64 : 42, 26).setEnable(true);
    this.audio.beep(700, 0.05);
  }

  private dashCooldown(): number {
    return this.powerUp === 'Battery Boost' ? 650 : 1050;
  }

  private updateState(grounded: boolean): void {
    if (this.scene.time.now < this.attackingUntil) return;
    const vy = (this.body as Phaser.Physics.Arcade.Body).velocity.y;
    const vx = Math.abs((this.body as Phaser.Physics.Arcade.Body).velocity.x);
    if (!grounded && vy < 0) this.setTexture('volt-jump');
    else if (!grounded) this.setTexture('volt-fall');
    else if (vx > 35) this.setTexture('volt-run');
    else this.setTexture('volt-idle');
  }
}
