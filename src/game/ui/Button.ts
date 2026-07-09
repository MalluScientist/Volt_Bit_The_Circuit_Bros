import Phaser from 'phaser';

export class Button extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, text: string, onClick: () => void, width = 260) {
    super(scene, x, y);
    const bg = scene.add.rectangle(0, 0, width, 44, 0x12242d, 0.96).setStrokeStyle(2, 0x45c4ff);
    const label = scene.add.text(0, 0, text, {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#f7fff7'
    }).setOrigin(0.5);
    this.add([bg, label]);
    this.setSize(width, 56).setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -28, width, 56),
      Phaser.Geom.Rectangle.Contains
    );
    this.on('pointerover', () => {
      bg.setFillStyle(0x1c3c48);
      bg.setStrokeStyle(2, 0xffe05d);
    });
    this.on('pointerout', () => {
      bg.setFillStyle(0x12242d);
      bg.setStrokeStyle(2, 0x45c4ff);
    });
    this.on('pointerdown', onClick);
    scene.add.existing(this);
  }
}
