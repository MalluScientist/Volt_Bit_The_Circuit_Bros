import Phaser from 'phaser';
import { SaveSystem } from '../systems/SaveSystem';

interface TouchControlCallbacks {
  moveLeft: (active: boolean) => void;
  moveRight: (active: boolean) => void;
  jump: (active: boolean) => void;
  attack: () => void;
  dash: () => void;
  dashReady?: () => boolean;
  beam: () => void;
  pause: () => void;
}

interface ButtonVisual {
  root: Phaser.GameObjects.Container;
  bg: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
}

export class TouchControls {
  private activeHoldPointers = new Map<number, { release: () => void; visual: ButtonVisual }>();

  constructor(scene: Phaser.Scene, callbacks: TouchControlCallbacks) {
    const enabled = scene.sys.game.device.input.touch || window.matchMedia('(pointer: coarse)').matches;
    if (!enabled) return;

    const settings = SaveSystem.load().settings;
    const scale = Phaser.Math.Clamp(settings.touchSize, 0.85, 1.35);
    const opacity = Phaser.Math.Clamp(settings.touchOpacity, 0.35, 0.95);
    const leftActions = settings.leftHandedTouch;
    const moveX = leftActions ? 726 : 58;
    const moveX2 = leftActions ? 824 : 156;
    const actionX = leftActions ? 88 : 664;
    const attackX = leftActions ? 198 : 774;
    const dashX = leftActions ? 296 : 872;
    const beamX = leftActions ? 296 : 872;

    scene.input.topOnly = false;
    scene.input.addPointer(6);
    const releasePointer = (pointer: Phaser.Input.Pointer) => this.releasePointer(pointer.id);
    scene.input.on('pointerup', releasePointer);
    scene.input.on('pointercancel', releasePointer);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.input.off('pointerup', releasePointer);
      scene.input.off('pointercancel', releasePointer);
      this.releaseAll();
    });

    this.holdButton(scene, moveX, 470, '<', 72 * scale, 52 * scale, 118 * scale, 96 * scale, opacity, () => callbacks.moveLeft(true), () => callbacks.moveLeft(false));
    this.holdButton(scene, moveX2, 470, '>', 72 * scale, 52 * scale, 118 * scale, 96 * scale, opacity, () => callbacks.moveRight(true), () => callbacks.moveRight(false));
    this.holdButton(scene, actionX, 470, 'JUMP', 88 * scale, 56 * scale, 136 * scale, 100 * scale, opacity, () => callbacks.jump(true), () => callbacks.jump(false));
    this.tapButton(scene, attackX, 470, 'ATK', 76 * scale, 54 * scale, 118 * scale, 96 * scale, opacity, callbacks.attack);
    const dashVisual = this.tapButton(scene, dashX, 470, 'DASH', 98 * scale, 64 * scale, 142 * scale, 112 * scale, opacity, callbacks.dash);
    scene.events.on(Phaser.Scenes.Events.UPDATE, () => {
      const ready = callbacks.dashReady?.() ?? false;
      dashVisual.bg.setStrokeStyle(ready ? 3 : 2, ready ? 0x77ff4f : 0x45c4ff, ready ? 0.95 : 0.82);
      dashVisual.root.setScale(ready ? 1.06 : 1);
      dashVisual.label.setColor(ready ? '#77ff4f' : '#f7fff7');
    });
    this.tapButton(scene, beamX, 382, 'BEAM', 82 * scale, 48 * scale, 122 * scale, 84 * scale, opacity, callbacks.beam);
    this.tapButton(scene, 914, 46, 'II', 54 * scale, 42 * scale, 82 * scale, 70 * scale, opacity, callbacks.pause);
  }

  private holdButton(scene: Phaser.Scene, x: number, y: number, label: string, width: number, height: number, hitWidth: number, hitHeight: number, opacity: number, onDown: () => void, onUp: () => void): void {
    const visual = this.makeButton(scene, x, y, label, width, height, opacity);
    const zone = this.makeHitZone(scene, x, y, hitWidth, hitHeight);
    zone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.releasePointer(pointer.id);
      this.activeHoldPointers.set(pointer.id, { release: onUp, visual });
      this.setPressed(visual, true);
      onDown();
    });
    zone.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      this.releasePointer(pointer.id);
    });
    zone.on('pointerupoutside', (pointer: Phaser.Input.Pointer) => {
      this.releasePointer(pointer.id);
    });
  }

  private tapButton(scene: Phaser.Scene, x: number, y: number, label: string, width: number, height: number, hitWidth: number, hitHeight: number, opacity: number, onTap: () => void): ButtonVisual {
    const visual = this.makeButton(scene, x, y, label, width, height, opacity);
    const zone = this.makeHitZone(scene, x, y, hitWidth, hitHeight);
    zone.on('pointerdown', () => {
      this.setPressed(visual, true);
      onTap();
    });
    zone.on('pointerup', () => this.setPressed(visual, false));
    zone.on('pointerupoutside', () => this.setPressed(visual, false));
    zone.on('pointercancel', () => this.setPressed(visual, false));
    return visual;
  }

  private makeButton(scene: Phaser.Scene, x: number, y: number, label: string, width: number, height: number, opacity: number): ButtonVisual {
    const root = scene.add.container(x, y).setScrollFactor(0).setDepth(180).setAlpha(opacity).setData('opacity', opacity);
    const bg = scene.add.rectangle(0, 0, width, height, 0x07131b, 0.5).setStrokeStyle(2, 0x45c4ff, 0.82);
    const text = scene.add.text(0, 0, label, {
      fontFamily: 'monospace',
      fontSize: label.length > 1 ? '14px' : '18px',
      color: '#f7fff7'
    }).setOrigin(0.5);
    root.add([bg, text]);
    return { root, bg, label: text };
  }

  private makeHitZone(scene: Phaser.Scene, x: number, y: number, width: number, height: number): Phaser.GameObjects.Zone {
    return scene.add.zone(x, y, width, height)
      .setScrollFactor(0)
      .setDepth(181)
      .setInteractive({ useHandCursor: false });
  }

  private setPressed(visual: ButtonVisual, pressed: boolean): void {
    visual.root.setAlpha(pressed ? 0.95 : Number(visual.root.getData('opacity') ?? 0.64));
    visual.bg.setFillStyle(pressed ? 0x123447 : 0x07131b, pressed ? 0.74 : 0.5);
  }

  private releasePointer(pointerId: number): void {
    const active = this.activeHoldPointers.get(pointerId);
    if (!active) return;
    active.release();
    this.setPressed(active.visual, false);
    this.activeHoldPointers.delete(pointerId);
  }

  private releaseAll(): void {
    this.activeHoldPointers.forEach((active) => {
      active.release();
      this.setPressed(active.visual, false);
    });
    this.activeHoldPointers.clear();
  }
}
