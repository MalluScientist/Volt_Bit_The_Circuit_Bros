import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    this.input.addPointer(5);
    this.scene.start('PreloadScene');
  }
}
