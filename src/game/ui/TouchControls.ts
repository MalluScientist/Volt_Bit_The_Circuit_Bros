import Phaser from 'phaser';

interface TouchControlCallbacks {
  moveLeft: (active: boolean) => void;
  moveRight: (active: boolean) => void;
  jump: (active: boolean) => void;
  attack: () => void;
  dash: () => void;
  beam: () => void;
}

interface ButtonVisual {
  root: Phaser.GameObjects.Container;
  bg: Phaser.GameObjects.Rectangle;
}

export class TouchControls {
  private activeHoldPointers = new Map<number, { release: () => void; visual: ButtonVisual }>();

  constructor(scene: Phaser.Scene, callbacks: TouchControlCallbacks) {
    const enabled = scene.sys.game.device.input.touch || window.matchMedia('(pointer: coarse)').matches;
    if (!enabled) return;

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

    this.holdButton(scene, 58, 470, '<', 72, 52, 106, 90, () => callbacks.moveLeft(true), () => callbacks.moveLeft(false));
    this.holdButton(scene, 156, 470, '>', 72, 52, 106, 90, () => callbacks.moveRight(true), () => callbacks.moveRight(false));
    this.holdButton(scene, 664, 470, 'JUMP', 84, 54, 126, 92, () => callbacks.jump(true), () => callbacks.jump(false));
    this.tapButton(scene, 774, 470, 'ATK', 72, 52, 108, 90, callbacks.attack);
    this.tapButton(scene, 872, 470, 'DASH', 78, 52, 112, 90, callbacks.dash);
    this.tapButton(scene, 872, 382, 'BEAM', 78, 46, 112, 78, callbacks.beam);
  }

  private holdButton(scene: Phaser.Scene, x: number, y: number, label: string, width: number, height: number, hitWidth: number, hitHeight: number, onDown: () => void, onUp: () => void): void {
    const visual = this.makeButton(scene, x, y, label, width, height);
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

  private tapButton(scene: Phaser.Scene, x: number, y: number, label: string, width: number, height: number, hitWidth: number, hitHeight: number, onTap: () => void): void {
    const visual = this.makeButton(scene, x, y, label, width, height);
    const zone = this.makeHitZone(scene, x, y, hitWidth, hitHeight);
    zone.on('pointerdown', () => {
      this.setPressed(visual, true);
      onTap();
    });
    zone.on('pointerup', () => this.setPressed(visual, false));
    zone.on('pointerupoutside', () => this.setPressed(visual, false));
    zone.on('pointercancel', () => this.setPressed(visual, false));
  }

  private makeButton(scene: Phaser.Scene, x: number, y: number, label: string, width: number, height: number): ButtonVisual {
    const root = scene.add.container(x, y).setScrollFactor(0).setDepth(180).setAlpha(0.64);
    const bg = scene.add.rectangle(0, 0, width, height, 0x07131b, 0.5).setStrokeStyle(2, 0x45c4ff, 0.82);
    const text = scene.add.text(0, 0, label, {
      fontFamily: 'monospace',
      fontSize: label.length > 1 ? '14px' : '18px',
      color: '#f7fff7'
    }).setOrigin(0.5);
    root.add([bg, text]);
    return { root, bg };
  }

  private makeHitZone(scene: Phaser.Scene, x: number, y: number, width: number, height: number): Phaser.GameObjects.Zone {
    return scene.add.zone(x, y, width, height)
      .setScrollFactor(0)
      .setDepth(181)
      .setInteractive({ useHandCursor: false });
  }

  private setPressed(visual: ButtonVisual, pressed: boolean): void {
    visual.root.setAlpha(pressed ? 0.95 : 0.64);
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
