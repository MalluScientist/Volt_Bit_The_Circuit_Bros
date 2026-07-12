import Phaser from 'phaser';
import { TrapSpec } from '../types';
import { Player } from '../objects/Player';
import { AudioSystem } from './AudioSystem';

interface TrapRuntime {
  spec: TrapSpec;
  triggered: boolean;
  spent: boolean;
  version: number;
  objects: Phaser.GameObjects.GameObject[];
}

interface TrapCallbacks {
  toast: (message: string) => void;
}

const TRAP_MESSAGES: Record<TrapSpec['type'], string> = {
  breakTrace: 'Trace integrity failed.',
  popSolderSpike: 'Solder point taken.',
  batteryBurst: 'Battery filed a complaint.',
  glitchPlatform: 'Platform trust revoked.',
  fakeExit: 'Exit relocated for your inconvenience.',
  dropSocket: 'Breadboard said no.',
  dashBreakBlock: 'Cracked trace: dash approved.',
  movingGoal: 'The exit had other plans.',
  suspiciousCoin: 'Suspicious component confirmed.'
};

export class TrapManager {
  private traps: TrapRuntime[] = [];
  private audio = new AudioSystem();
  private touchForgiveness: number;

  constructor(private scene: Phaser.Scene, private player: Player, specs: TrapSpec[], private callbacks: TrapCallbacks) {
    this.touchForgiveness = scene.sys.game.device.input.touch || window.matchMedia('(pointer: coarse)').matches ? 1.25 : 1;
    this.traps = specs.map((spec) => ({ spec, triggered: false, spent: false, version: 0, objects: [] }));
    this.traps.forEach((trap) => this.createTrapVisuals(trap));
  }

  update(): void {
    this.traps.forEach((trap) => {
      if (trap.spent && trap.spec.once) return;
      if (trap.triggered) return;
      if (trap.spec.type === 'dashBreakBlock') return;
      if (this.playerInTrigger(trap.spec)) this.trigger(trap);
    });
  }

  reset(): void {
    this.traps.forEach((trap) => {
      trap.objects.forEach((obj) => {
        if (obj.active) obj.destroy();
      });
      trap.objects = [];
      trap.triggered = false;
      trap.spent = false;
      trap.version += 1;
      this.createTrapVisuals(trap);
    });
  }

  private createTrapVisuals(trap: TrapRuntime): void {
    const { spec } = trap;
    if (spec.type === 'dashBreakBlock') {
      const block = this.scene.add.rectangle(spec.x, spec.y, spec.width ?? 58, spec.height ?? 58, 0x123447, 0.92)
        .setStrokeStyle(3, 0x45c4ff, 0.9)
        .setData('trapId', spec.id);
      this.scene.physics.add.existing(block, true);
      const cracks = this.scene.add.graphics().setDepth(block.depth + 1);
      cracks.lineStyle(2, 0xf7fff7, 0.65);
      cracks.lineBetween(spec.x - 18, spec.y - 20, spec.x + 4, spec.y - 4);
      cracks.lineBetween(spec.x + 4, spec.y - 4, spec.x - 8, spec.y + 18);
      cracks.lineBetween(spec.x + 8, spec.y - 22, spec.x + 20, spec.y + 16);
      this.scene.physics.add.overlap(this.player, block, () => {
        if (this.player.isDashing) this.breakDashBlock(trap, block, cracks);
      });
      this.scene.tweens.add({ targets: block, alpha: 0.72, yoyo: true, repeat: -1, duration: 560 });
      trap.objects.push(block, cracks);
    }
  }

  private trigger(trap: TrapRuntime): void {
    trap.triggered = true;
    const delay = (trap.spec.warningDelay ?? 450) * this.touchForgiveness;
    const version = trap.version;
    this.warn(trap);
    this.scene.time.delayedCall(delay, () => {
      if (trap.version === version) this.activate(trap);
    });
  }

  private warn(trap: TrapRuntime): void {
    this.audio.beep(trap.spec.type === 'batteryBurst' ? 220 : 620, 0.06, 'square', 0.035);
    if (trap.spec.type === 'dashBreakBlock') return;
    const width = trap.spec.width ?? (trap.spec.type === 'batteryBurst' ? 120 : 72);
    const height = trap.spec.height ?? (trap.spec.type === 'batteryBurst' ? 64 : 18);
    const warning = this.scene.add.rectangle(trap.spec.x, trap.spec.y, width, height, 0xff3e5f, 0.18)
      .setStrokeStyle(2, 0xffa33a, 0.75)
      .setDepth(30);
    this.scene.tweens.add({ targets: warning, alpha: 0.55, yoyo: true, repeat: 2, duration: 90 });
    this.scene.time.delayedCall(360, () => {
      if (warning.active) warning.destroy();
    });
  }

  private activate(trap: TrapRuntime): void {
    if (trap.spent) return;
    trap.spent = true;
    const { spec } = trap;
    if (spec.type === 'breakTrace' || spec.type === 'glitchPlatform' || spec.type === 'dropSocket') {
      this.spawnHazard(spec.x, spec.y, spec.width ?? 110, spec.height ?? 22, TRAP_MESSAGES[spec.type], 520);
      this.callbacks.toast(TRAP_MESSAGES[spec.type]);
      return;
    }

    if (spec.type === 'fakeExit' || spec.type === 'movingGoal') {
      trap.objects.forEach((obj) => {
        if (spec.type === 'movingGoal' && 'x' in obj) this.scene.tweens.add({ targets: obj, x: Number((obj as { x: number }).x) + 120, duration: 260 });
      });
      this.spawnHazard(spec.x, spec.y + 32, spec.width ?? 96, 18, TRAP_MESSAGES[spec.type], 900);
      this.callbacks.toast(TRAP_MESSAGES[spec.type]);
      return;
    }

    if (spec.type === 'suspiciousCoin') {
      this.spawnHazard(spec.x, spec.y, 96, 72, TRAP_MESSAGES[spec.type], 260);
      this.callbacks.toast(TRAP_MESSAGES[spec.type]);
      return;
    }

    if (spec.type === 'popSolderSpike') {
      this.spawnHazard(spec.x, spec.y, spec.width ?? 96, spec.height ?? 28, TRAP_MESSAGES[spec.type], 900);
      this.callbacks.toast(TRAP_MESSAGES[spec.type]);
      return;
    }

    if (spec.type === 'batteryBurst') {
      this.spawnHazard(spec.x, spec.y, spec.width ?? 150, spec.height ?? 90, TRAP_MESSAGES[spec.type], 320);
      this.scene.cameras.main.shake(110, 0.005);
      this.callbacks.toast(TRAP_MESSAGES[spec.type]);
    }
  }

  private spawnHazard(x: number, y: number, width: number, height: number, message: string, lifetime: number): void {
    const hazard = this.scene.add.rectangle(x, y, width, height, 0xff3e5f, 0.72).setStrokeStyle(3, 0xffa33a, 0.95);
    this.scene.physics.add.existing(hazard, true);
    hazard.setData('hazard', true);
    hazard.setData('damage', 1);
    hazard.setData('deathMessage', message);
    hazard.setData('bossObject', true);
    this.scene.tweens.add({ targets: hazard, alpha: 0.35, yoyo: true, repeat: -1, duration: 80 });
    this.scene.time.delayedCall(lifetime, () => {
      if (hazard.active) hazard.destroy();
    });
  }

  private breakDashBlock(trap: TrapRuntime, block: Phaser.GameObjects.Rectangle, cracks: Phaser.GameObjects.Graphics): void {
    if (trap.spent) return;
    trap.spent = true;
    this.audio.beep(980, 0.08, 'triangle', 0.06);
    this.callbacks.toast(String(trap.spec.params?.message ?? TRAP_MESSAGES.dashBreakBlock));
    this.scene.tweens.add({
      targets: block,
      alpha: 0,
      scaleX: 1.2,
      scaleY: 0.7,
      duration: 140,
      onComplete: () => {
        block.destroy();
        cracks.destroy();
      }
    });
  }

  private playerInTrigger(spec: TrapSpec): boolean {
    const width = spec.triggerWidth ?? spec.width ?? 80;
    const height = spec.triggerHeight ?? spec.height ?? 80;
    const x = spec.triggerX ?? spec.x;
    const y = spec.triggerY ?? spec.y;
    return Phaser.Geom.Rectangle.Contains(
      new Phaser.Geom.Rectangle(x - width / 2, y - height / 2, width, height),
      this.player.x,
      this.player.y
    );
  }
}
