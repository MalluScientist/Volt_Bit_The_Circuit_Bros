import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../constants';
import { AudioSystem } from '../systems/AudioSystem';
import { makeLevel } from '../systems/LevelFactory';
import { SaveSystem } from '../systems/SaveSystem';
import { burst, floatingText } from '../systems/ParticleSystem';
import { TrapManager } from '../systems/TrapManager';
import { HUD } from '../ui/HUD';
import { DialogToast } from '../ui/DialogToast';
import { TouchControls } from '../ui/TouchControls';
import { CharacterConfig, getCharacterConfig } from '../characters';
import { Platform } from '../objects/Platform';
import { Player } from '../objects/Player';
import { AngryLED } from '../objects/AngryLED';
import { SparkSlime } from '../objects/SparkSlime';
import { BatteryBat } from '../objects/BatteryBat';
import { GlitchBug } from '../objects/GlitchBug';
import { Enemy } from '../objects/Enemy';
import { Collectible } from '../objects/Collectible';
import { Hazard } from '../objects/Hazard';
import { Checkpoint } from '../objects/Checkpoint';
import { Boss } from '../objects/Boss';
import { DiscoDiode } from '../objects/DiscoDiode';
import { CaptainOvercharge } from '../objects/CaptainOvercharge';
import { LooseConnection } from '../objects/LooseConnection';
import { NandKnight } from '../objects/NandKnight';
import { LevelSpec } from '../types';

const BOSS_BAR_WIDTH = 356;
const BOSS_LINES: Record<number, string> = {
  1: 'Behold my full brightness mode!',
  2: 'I am fully charged and emotionally unstable!',
  3: 'You cannot hit what you cannot connect!',
  4: 'My shield logic is flawless. Probably.'
};

export abstract class BaseLevelScene extends Phaser.Scene {
  protected abstract levelId: number;
  protected spec!: LevelSpec;
  protected player!: Player;
  protected audio = new AudioSystem();
  protected hud!: HUD;
  protected toast!: DialogToast;
  protected platforms: Platform[] = [];
  protected enemies!: Phaser.Physics.Arcade.Group;
  protected collectibles!: Phaser.Physics.Arcade.Group;
  protected hazards: Hazard[] = [];
  protected checkpoint!: Checkpoint;
  protected boss?: Boss;
  protected bossStarted = false;
  protected chips = 0;
  private bossBar?: Phaser.GameObjects.Rectangle;
  private bossBarBack?: Phaser.GameObjects.Rectangle;
  private bossHpText?: Phaser.GameObjects.Text;
  private pausePanel?: Phaser.GameObjects.Container;
  private paused = false;
  private lastBossHitAt = 0;
  private completingLevel = false;
  private playerBeams!: Phaser.Physics.Arcade.Group;
  private character!: CharacterConfig;
  private bossPhaseText?: Phaser.GameObjects.Text;
  private bossPhase = 1;
  private traps?: TrapManager;
  private attempt = 1;

  create(): void {
    this.resetSceneState();
    this.spec = makeLevel(this.levelId);
    this.attempt = SaveSystem.recordAttempt(this.levelId);
    this.character = getCharacterConfig(SaveSystem.selectedCharacter());
    this.physics.world.setBounds(0, 0, this.spec.width, GAME_HEIGHT + 220);
    this.cameras.main.setBounds(0, 0, this.spec.width, GAME_HEIGHT);
    this.cameras.main.setBackgroundColor(this.spec.theme.sky);
    this.drawBackground();
    this.enemies = this.physics.add.group();
    this.collectibles = this.physics.add.group({ allowGravity: false, immovable: true });
    this.playerBeams = this.physics.add.group({ allowGravity: false });
    this.platforms = this.spec.platforms.map((p) => new Platform(this, p, this.spec.theme.ground));
    this.hazards = this.spec.hazards.map((h) => new Hazard(this, h.x, h.y, h.w, h.h, h.type));
    this.checkpoint = new Checkpoint(this, this.spec.checkpoint.x, this.spec.checkpoint.y);
    this.player = new Player(this, this.spec.start.x, this.spec.start.y, this.audio, this.character);
    this.player.checkpoint.copy(this.spec.start);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.hud = new HUD(this);
    this.toast = new DialogToast(this);
    this.traps = new TrapManager(this, this.player, this.spec.traps, {
      toast: (message) => this.toast.show(message)
    });
    new TouchControls(this, {
      moveLeft: (active) => this.player.setTouchMove('left', active),
      moveRight: (active) => this.player.setTouchMove('right', active),
      jump: (active) => this.player.setTouchJump(active),
      attack: () => this.player.requestAttack(),
      dash: () => this.player.requestDash(),
      dashReady: () => this.player.dashReady(),
      beam: () => this.fireChipBeam(),
      pause: () => this.togglePause()
    });
    this.toast.show(Phaser.Math.RND.pick(this.character.levelLines));
    this.time.delayedCall(720, () => this.toast.show(`Attempt ${this.attempt}`));
    this.time.delayedCall(1800, () => this.toast.show(this.levelId === 1 ? 'Warning: confidence exceeds recommended limit.' : this.levelId === 2 ? 'Magic smoke probability increasing.' : this.levelId === 3 ? 'Continuity restored. Somehow.' : 'Recommendation: do not argue with logic gates.'));
    this.spawnEnemies();
    this.spawnCollectibles();
    this.wirePhysics();
    this.input.keyboard!.on('keydown-ESC', () => this.togglePause());
    this.input.keyboard!.on('keydown-R', () => this.retryFromCheckpoint());
    this.input.keyboard!.on('keydown-U', () => this.fireChipBeam());
  }

  private resetSceneState(): void {
    this.platforms = [];
    this.hazards = [];
    this.boss = undefined;
    this.bossStarted = false;
    this.bossBar = undefined;
    this.bossBarBack = undefined;
    this.bossHpText = undefined;
    this.pausePanel = undefined;
    this.paused = false;
    this.lastBossHitAt = 0;
    this.completingLevel = false;
    this.chips = 0;
    this.bossPhase = 1;
    this.bossPhaseText = undefined;
    this.traps = undefined;
  }

  update(time: number): void {
    if (this.paused || this.completingLevel) return;
    this.platforms.forEach((platform) => platform.tick(time));
    this.enemies.children.each((child) => {
      if (child.active) (child as Enemy).tick(time, this.player);
      return true;
    });
    if (!this.bossStarted && this.player.x > this.spec.bossArenaX) this.startBoss();
    if (this.boss?.active && !this.boss.defeated) {
      this.boss.tick(time, this.player);
      this.constrainBossToArena();
      this.processBossBeamHits();
      this.updateBossBar();
    }
    this.recoverBossEncounter();
    this.traps?.update();
    this.handleWorldHazards();
    if (this.player.y > GAME_HEIGHT + 130) this.killPlayer('Gravity submitted a bug report.');
    this.hud.update({
      health: this.player.health,
      maxHealth: this.player.maxHealth,
      dashRatio: this.player.dashEnergy,
      dashReady: this.player.dashReady(),
      coins: this.player.coins,
      score: this.player.score,
      levelName: this.spec.theme.name,
      characterName: this.character.name,
      characterColor: this.character.color,
      powerUp: this.player.powerUp,
      chips: this.chips
    });
  }

  private drawBackground(): void {
    const g = this.add.graphics().setDepth(-10);
    g.fillStyle(0x000000, 0.12);
    g.fillRect(0, 416, this.spec.width, 124);
    g.lineStyle(1, this.spec.theme.ground, 0.1);
    for (let x = 0; x < this.spec.width; x += 240) g.lineBetween(x, 72, x, GAME_HEIGHT);
    for (let y = 120; y < GAME_HEIGHT; y += 140) g.lineBetween(0, y, this.spec.width, y);
    g.lineStyle(3, this.spec.theme.accent, 0.22);
    for (let x = 260; x < this.spec.width; x += 720) {
      g.lineBetween(x, 450, x + 160, 370);
      g.strokeCircle(x + 178, 362, 6);
    }
    for (let x = 420; x < this.spec.width; x += 900) {
      this.add.rectangle(x, 126 + (x % 90), 18, 24, this.spec.theme.accent, 0.32).setDepth(-5);
    }
  }

  private spawnEnemies(): void {
    this.spec.enemies.forEach((s) => {
      const enemy = s.type === 'led' ? new AngryLED(this, s.x, s.y) : s.type === 'slime' ? new SparkSlime(this, s.x, s.y) : s.type === 'bat' ? new BatteryBat(this, s.x, s.y) : new GlitchBug(this, s.x, s.y);
      this.enemies.add(enemy);
    });
  }

  private spawnCollectibles(): void {
    this.spec.collectibles.forEach((s) => {
      const collectible = new Collectible(this, s.x, s.y, s.type, s.id, s.power);
      this.collectibles.add(collectible);
      const body = collectible.body as Phaser.Physics.Arcade.Body;
      body.setAllowGravity(false);
      body.setImmovable(true);
      body.setVelocity(0, 0);
    });
  }

  private wirePhysics(): void {
    this.platforms.forEach((platform) => {
      this.physics.add.collider(this.player, platform, () => this.platformTouch(platform));
      this.physics.add.collider(this.enemies, platform);
    });
    this.physics.add.overlap(this.player, this.collectibles, (_, item) => this.collect(item as Collectible));
    this.physics.add.overlap(this.player, this.hazards, (_, hazard) => this.hitHazard(hazard as Hazard));
    this.physics.add.overlap(this.player, this.checkpoint, () => {
      if (!this.checkpoint.activate()) return;
      this.player.checkpoint.copy(this.spec.checkpoint);
      if (SaveSystem.load().upgrades.checkpointReboot) this.player.heal(1);
      this.toast.show('Checkpoint saved. Try not to explode.');
    });
    this.physics.add.overlap(this.player, this.enemies, (_, enemy) => this.touchEnemy(enemy as Enemy));
    this.physics.add.overlap(this.player.attackBox, this.enemies, (_, enemy) => this.attackEnemy(enemy as Enemy));
    this.physics.add.overlap(this.playerBeams, this.enemies, (beam, enemy) => this.beamEnemy(beam as Phaser.GameObjects.Rectangle, enemy as Enemy));
  }

  private platformTouch(platform: Platform): void {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (!body.blocked.down && !body.touching.down) return;
    if (platform.kind === 'boost') {
      body.setVelocityX(Math.sign(body.velocity.x || 1) * 520);
      burst(this, this.player.x, this.player.y + 18, 0x45c4ff, 8);
    }
    if (platform.kind === 'bounce') {
      body.setVelocityY(-680);
      this.audio.beep(760, 0.08, 'triangle', 0.04);
    }
  }

  private collect(item: Collectible): void {
    this.audio.pickup();
    burst(this, item.x, item.y, 0xffe05d, 8);
    if (item.collectType === 'coin') {
      this.player.coins += 1;
      this.player.score += 25;
    } else if (item.collectType === 'cell') {
      this.player.heal(1);
      this.player.score += 75;
    } else if (item.collectType === 'chip') {
      this.chips += 1;
      this.player.score += 350;
      if (item.chipId) SaveSystem.collectChip(this.levelId, item.chipId);
      this.toast.show('Debug chip acquired.');
    } else if (item.power) {
      this.player.applyPower(item.power);
      this.toast.show(`${item.power} online.`);
    }
    floatingText(this, item.x, item.y, '+');
    item.destroy();
  }

  private touchEnemy(enemy: Enemy): void {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (body.velocity.y > 80 && this.player.y < enemy.y - 8) {
      const defeated = enemy.hurt(1);
      body.setVelocityY(-360);
      if (defeated) this.player.score += enemy.scoreValue;
    } else if (this.player.takeDamage(1, enemy.x)) {
      this.killPlayer('Magic smoke detected.');
    }
  }

  private attackEnemy(enemy: Enemy): void {
    const defeated = enemy.hurt(this.player.powerUp === 'Solder Sword' ? this.player.character.attackDamage + 1 : this.player.character.attackDamage);
    if (defeated) this.player.score += enemy.scoreValue;
  }

  private beamEnemy(beam: Phaser.GameObjects.Rectangle, enemy: Enemy): void {
    const defeated = enemy.hurt(Number(beam.getData('damage') ?? 2));
    if (defeated) this.player.score += enemy.scoreValue;
    beam.destroy();
  }

  private hitHazard(hazard: Hazard): void {
    if (!hazard.armed) return;
    if (hazard.hazardType === 'explosive') {
      hazard.armed = false;
      hazard.setScale(2.2, 1.7);
      this.cameras.main.shake(130, 0.008);
      this.time.delayedCall(180, () => hazard.destroy());
    }
    if (this.player.takeDamage(1, hazard.x)) this.killPlayer(String(hazard.getData('deathMessage') ?? 'Magic smoke detected.'));
  }

  private handleWorldHazards(): void {
    this.children.each((child) => {
      const obj = child as Phaser.GameObjects.GameObject & { getData?: (key: string) => unknown; active: boolean; destroy: () => void; x?: number };
      if (!obj.getData?.('projectile') && !obj.getData?.('hazard')) return true;
      if (obj.active && this.physics.overlap(this.player, obj as Phaser.GameObjects.GameObject)) {
        if (this.player.takeDamage(Number(obj.getData('damage') ?? 1), obj.x)) this.killPlayer(String(obj.getData('deathMessage') ?? 'Magic smoke detected.'));
        if (obj.getData('projectile')) obj.destroy();
      }
      return true;
    });
  }

  private startBoss(): void {
    this.bossStarted = true;
    const x = this.spec.bossArenaX + 520;
    const y = 400;
    this.boss = this.spec.theme.boss === 'diode'
      ? new DiscoDiode(this, x, y)
      : this.spec.theme.boss === 'overcharge'
        ? new CaptainOvercharge(this, x, y)
        : this.spec.theme.boss === 'loose'
          ? new LooseConnection(this, x, y - 60)
          : new NandKnight(this, x, y - 10);
    this.platforms.forEach((platform) => this.physics.add.collider(this.boss!, platform));
    this.physics.add.overlap(this.player.attackBox, this.boss, () => this.hitBoss());
    this.physics.add.overlap(this.playerBeams, this.boss, (beam) => {
      this.beamBoss(beam as Phaser.GameObjects.Rectangle);
    });
    this.physics.add.overlap(this.player, this.boss, () => this.touchBoss());
    this.audio.boss();
    this.showBossTitle(this.boss.title);
    this.bossBarBack = this.add.rectangle(480, 60, 360, 16, 0x102530).setScrollFactor(0).setDepth(100).setStrokeStyle(2, 0xf7fff7);
    this.bossBar = this.add.rectangle(300, 60, BOSS_BAR_WIDTH, 10, 0xff3e5f).setOrigin(0, 0.5).setScrollFactor(0).setDepth(101);
    this.bossHpText = this.add.text(676, 52, '', { fontFamily: 'monospace', fontSize: '13px', color: '#f7fff7' }).setScrollFactor(0).setDepth(101);
    this.bossPhase = 1;
    this.bossPhaseText = this.add.text(480, 82, 'Phase 1', { fontFamily: 'monospace', fontSize: '14px', color: '#f7fff7' }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
    this.updateBossBar();
  }

  private touchBoss(): void {
    if (!this.boss) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (body.velocity.y > 130 && this.player.y < this.boss.y - 28) {
      body.setVelocityY(-410);
      this.hitBoss(this.player.character.attackDamage, 'stomp');
    } else if (this.player.takeDamage(1, this.boss.x)) {
      this.killPlayer('Magic smoke detected.');
    }
  }

  private beamBoss(beam: Phaser.GameObjects.Rectangle): void {
    if (!beam.active || beam.getData('spent')) return;
    beam.setData('spent', true);
    const damage = Number(beam.getData('damage') ?? this.player.character.beamDamage);
    if (this.hitBoss(damage, 'beam', 0)) {
      burst(this, beam.x, beam.y, this.player.character.accent, 14);
      this.cameras.main.shake(70, 0.003);
    }
    beam.destroy();
  }

  private processBossBeamHits(): void {
    if (!this.boss?.active || this.boss.defeated) return;
    this.playerBeams.children.each((child) => {
      const beam = child as Phaser.GameObjects.Rectangle;
      if (beam.active && !beam.getData('spent') && this.beamIntersectsBoss(beam)) {
        this.beamBoss(beam);
      }
      return true;
    });
  }

  private beamIntersectsBoss(beam: Phaser.GameObjects.Rectangle): boolean {
    if (!this.boss?.active) return false;
    if (this.physics.overlap(beam, this.boss)) return true;
    return Phaser.Geom.Intersects.RectangleToRectangle(beam.getBounds(), this.boss.getBounds());
  }

  private hitBoss(damage = 1, source: 'melee' | 'beam' | 'dash' | 'stomp' | 'hazard' | 'debug' = 'melee', cooldownMs = 260): boolean {
    if (!this.boss?.active || this.boss.defeated) return false;
    if (cooldownMs > 0 && this.time.now - this.lastBossHitAt < cooldownMs) return false;
    this.lastBossHitAt = this.time.now;
    const finalDamage = this.player.powerUp === 'Solder Sword' && source !== 'beam' ? Math.max(this.player.character.attackDamage + 1, damage) : damage;
    const defeated = this.boss.takeDamage(finalDamage, source);
    this.audio.bossHit();
    this.updateBossBar();
    if (defeated) {
      this.audio.bossDefeat();
      this.player.score += 1000;
      this.bossBar?.destroy();
      this.bossBarBack?.destroy();
      this.bossHpText?.destroy();
      this.bossPhaseText?.destroy();
      this.completeLevelSoon();
    }
    return true;
  }

  private recoverBossEncounter(): void {
    if (!this.bossStarted || this.completingLevel) return;
    if (this.boss?.defeated) {
      this.completeLevelSoon();
      return;
    }
    if (!this.boss || !this.boss.active) {
      this.resetBossEncounter();
    }
  }

  private fireChipBeam(): void {
    if (this.paused || this.completingLevel) return;
    if (this.chips < 3) {
      this.toast.show('Find all 3 debug chips to unlock BEAM.');
      return;
    }
    const beam = this.player.fireChipBeam();
    if (beam) {
      this.playerBeams.add(beam);
      floatingText(this, this.player.x, this.player.y - 28, 'BEAM', '#45c4ff');
    }
  }

  private completeLevelSoon(): void {
    if (this.completingLevel) return;
    this.completingLevel = true;
    this.resetBossObjects();
    this.physics.pause();
    this.time.delayedCall(650, () => {
      this.scene.start('LevelCompleteScene', {
        level: this.levelId,
        levelName: this.spec.theme.name,
        characterName: this.character.name,
        score: this.player.score,
        coins: this.player.coins,
        chips: Math.min(3, this.chips),
        clockShardEarned: true
      });
    });
  }

  private updateBossBar(): void {
    if (!this.boss || !this.bossBar) return;
    const ratio = Phaser.Math.Clamp(this.boss.health / this.boss.maxHealth, 0, 1);
    this.bossBar.setScale(ratio, 1);
    this.bossHpText?.setText(`${this.boss.health}/${this.boss.maxHealth}`);
    const phase = ratio <= 1 / 3 ? 3 : ratio <= 2 / 3 ? 2 : 1;
    if (phase !== this.bossPhase) {
      this.bossPhase = phase;
      this.bossPhaseText?.setText(`Phase ${phase}`);
      this.toast.show(phase === 2 ? 'Recommendation: dodge.' : 'Magic smoke probability increasing.');
    }
  }

  private constrainBossToArena(): void {
    if (!this.boss?.active) return;
    const body = this.boss.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setVelocityY(0);
    this.boss.y = Phaser.Math.Clamp(this.boss.y, 130, 405);
  }

  private showBossTitle(title: string): void {
    const label = this.add.text(480, 126, title, { fontFamily: 'monospace', fontSize: '34px', color: '#ffe05d', stroke: '#07131b', strokeThickness: 6 }).setOrigin(0.5).setScrollFactor(0).setDepth(120);
    const line = this.add.text(480, 172, BOSS_LINES[this.levelId] ?? 'Your patch notes are meaningless!', { fontFamily: 'monospace', fontSize: '17px', color: '#f7fff7', stroke: '#07131b', strokeThickness: 4 }).setOrigin(0.5).setScrollFactor(0).setDepth(120);
    this.tweens.add({ targets: label, alpha: 0, delay: 1300, duration: 550, onComplete: () => label.destroy() });
    this.tweens.add({ targets: line, alpha: 0, delay: 1550, duration: 550, onComplete: () => line.destroy() });
  }

  private killPlayer(message = 'Magic smoke detected.'): void {
    SaveSystem.recordDeath(this.levelId);
    if (this.player.health <= 0) {
      this.scene.start('GameOverScene', { level: this.levelId, score: this.player.score, message });
    } else {
      this.retryFromCheckpoint();
      this.toast.show(message);
    }
  }

  private retryFromCheckpoint(): void {
    this.resetBossEncounter();
    this.traps?.reset();
    this.player.restartAtCheckpoint();
  }

  private resetBossEncounter(): void {
    if (!this.bossStarted && !this.boss && !this.bossBar && !this.bossBarBack) return;
    if (this.boss?.defeated) return;

    this.bossStarted = false;
    this.lastBossHitAt = 0;
    this.boss?.destroy();
    this.boss = undefined;
    this.bossBar?.destroy();
    this.bossBar = undefined;
    this.bossBarBack?.destroy();
    this.bossBarBack = undefined;
    this.bossHpText?.destroy();
    this.bossHpText = undefined;
    this.bossPhaseText?.destroy();
    this.bossPhaseText = undefined;
    this.resetBossObjects();
  }

  private resetBossObjects(): void {
    this.children.each((child) => {
      const obj = child as Phaser.GameObjects.GameObject & { getData?: (key: string) => unknown; active: boolean; destroy: () => void };
      if (obj.active && (obj.getData?.('projectile') || obj.getData?.('bossObject') || obj.getData?.('playerBeam'))) obj.destroy();
      return true;
    });
  }

  private togglePause(): void {
    this.paused = !this.paused;
    if (this.paused) {
      this.physics.pause();
      this.pausePanel = this.add.container(480, 270).setScrollFactor(0).setDepth(200);
      const bg = this.add.rectangle(0, 0, 360, 180, 0x07131b, 0.92).setStrokeStyle(2, 0x45c4ff);
      const title = this.add.text(0, -48, 'Paused', { fontFamily: 'monospace', fontSize: '30px', color: '#ffe05d' }).setOrigin(0.5);
      const info = this.add.text(0, 28, 'Esc resume\nR restart checkpoint', { fontFamily: 'monospace', fontSize: '18px', color: '#f7fff7', align: 'center' }).setOrigin(0.5);
      this.pausePanel.add([bg, title, info]);
    } else {
      this.physics.resume();
      this.pausePanel?.destroy();
    }
  }
}
