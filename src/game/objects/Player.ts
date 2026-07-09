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
  touchInput = {
    left: false,
    right: false,
    jumpHeld: false
  };

  private audio: AudioSystem;
  private facing = 1;
  private attackingUntil = 0;
  private beamAvailableAt = 0;
  private doubleJumpsRemaining = 1;

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
    if (grounded) {
      this.lastGroundedAt = time;
      this.doubleJumpsRemaining = 1;
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.space!) || Phaser.Input.Keyboard.JustDown(this.keys.w) || Phaser.Input.Keyboard.JustDown(this.cursors.up!)) {
      this.jumpBufferedAt = time;
    }
    const left = this.cursors.left?.isDown || this.keys.a.isDown || this.touchInput.left;
    const right = this.cursors.right?.isDown || this.keys.d.isDown || this.touchInput.right;
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
    } else if (time - this.jumpBufferedAt < 150 && this.doubleJumpsRemaining > 0) {
      body.setVelocityY(-520);
      this.doubleJumpsRemaining -= 1;
      this.jumpBufferedAt = -999;
      this.audio.jump();
      burst(this.scene, this.x, this.y + 18, 0x45c4ff, 8);
    }
    const jumpHeld = this.cursors.space?.isDown || this.keys.w.isDown || this.cursors.up?.isDown || this.touchInput.jumpHeld;
    if (!jumpHeld && body.velocity.y < -140) body.setVelocityY(body.velocity.y + 20 * (delta / 16.6));
    this.regenerateDash(delta);
    if (Phaser.Input.Keyboard.JustDown(this.keys.k)) this.requestDash();
    if (Phaser.Input.Keyboard.JustDown(this.keys.j)) this.attack(time);
    if (this.powerUp !== 'None' && this.powerUp !== 'Fuse Shield' && time > this.powerUntil) this.powerUp = 'None';
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

  setTouchMove(direction: 'left' | 'right', active: boolean): void {
    this.touchInput[direction] = active;
  }

  setTouchJump(active: boolean): void {
    this.touchInput.jumpHeld = active;
    if (active) this.queueJump();
  }

  queueJump(): void {
    this.jumpBufferedAt = this.scene.time.now;
  }

  requestAttack(): void {
    this.attack(this.scene.time.now);
  }

  requestDash(): void {
    if (this.scene.time.now >= this.dashAvailableAt && this.dashEnergy >= this.dashCost()) this.dash(this.scene.time.now);
  }

  fireChipBeam(): Phaser.GameObjects.Rectangle | undefined {
    const time = this.scene.time.now;
    if (time < this.beamAvailableAt) return undefined;
    this.beamAvailableAt = time + 420;
    const beam = this.scene.add.rectangle(this.x + this.facing * 46, this.y + 2, 64, 10, 0x45c4ff, 0.95).setDepth(16);
    const glow = this.scene.add.rectangle(beam.x, beam.y, 82, 22, 0x45c4ff, 0.22).setDepth(15);
    this.scene.physics.add.existing(beam);
    const body = beam.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setSize(64, 10);
    body.setVelocityX(this.facing * 720);
    body.setBounce(0, 0);
    beam.setData('playerBeam', true);
    beam.setData('damage', 2);
    beam.setData('glow', glow);
    const trail = this.scene.time.addEvent({
      delay: 24,
      loop: true,
      callback: () => {
        if (!beam.active) {
          trail.remove(false);
          return;
        }
        glow.setPosition(beam.x, beam.y);
        const spark = this.scene.add.rectangle(beam.x - this.facing * 38, beam.y + Phaser.Math.Between(-4, 4), 8, 3, 0x9eeeff, 0.65).setDepth(14);
        this.scene.tweens.add({
          targets: spark,
          alpha: 0,
          x: spark.x - this.facing * 18,
          duration: 130,
          onComplete: () => spark.destroy()
        });
      }
    });
    beam.setData('trail', trail);
    beam.once(Phaser.GameObjects.Events.DESTROY, () => {
      trail.remove(false);
      glow.destroy();
    });
    this.scene.tweens.add({
      targets: [beam, glow],
      scaleX: 1.16,
      duration: 70,
      yoyo: true,
      repeat: -1
    });
    this.scene.time.delayedCall(780, () => {
      if (beam.active) beam.destroy();
    });
    this.audio.beep(1180, 0.09, 'triangle', 0.06);
    return beam;
  }

  private dash(time: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    this.isDashing = true;
    this.dashEnergy = Phaser.Math.Clamp(this.dashEnergy - this.dashCost(), 0, 1);
    body.setAllowGravity(false);
    body.setAcceleration(0, 0);
    body.setVelocity(this.facing * 640, 0);
    this.dashAvailableAt = time + 250;
    burst(this.scene, this.x - this.facing * 12, this.y, 0x45c4ff, 8);
    this.scene.time.delayedCall(170, () => {
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

  private regenerateDash(delta: number): void {
    if (this.isDashing) return;
    this.dashEnergy = Phaser.Math.Clamp(this.dashEnergy + delta / this.dashRegenTime(), 0, 1);
  }

  private dashCost(): number {
    return this.powerUp === 'Battery Boost' ? 0.3 : 0.45;
  }

  private dashRegenTime(): number {
    return this.powerUp === 'Battery Boost' ? 650 : 900;
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
