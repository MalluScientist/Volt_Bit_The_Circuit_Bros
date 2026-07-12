import Phaser from 'phaser';

export class Button extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, text: string, onClick: () => void, width = 260, fontSize = '20px') {
    super(scene, x, y);
    this.setDepth(5);
    this.setSize(width + 36, 64);
    const bg = scene.add.rectangle(0, 0, width, 44, 0x12242d, 0.96).setStrokeStyle(2, 0x45c4ff);
    const label = scene.add.text(0, 0, text, {
      fontFamily: 'monospace',
      fontSize,
      color: '#f7fff7'
    }).setOrigin(0.5);
    this.add([bg, label]);
    scene.add.existing(this);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-(width + 36) / 2, -32, width + 36, 64),
      Phaser.Geom.Rectangle.Contains
    );

    let clicked = false;
    const setNormal = () => {
      bg.setFillStyle(0x12242d);
      bg.setStrokeStyle(2, 0x45c4ff);
      this.setScale(1);
    };
    const setActive = () => {
      bg.setFillStyle(0x1c3c48);
      bg.setStrokeStyle(2, 0xffe05d);
      this.setScale(0.98);
    };

    this.on('pointerover', setActive);
    this.on('pointerout', setNormal);
    this.on('pointerdown', setActive);
    this.on('pointerup', () => {
      if (clicked) return;
      clicked = true;
      setNormal();
      onClick();
      scene.time.delayedCall(260, () => {
        clicked = false;
      });
    });
    this.on('pointerupoutside', setNormal);
    this.on('pointercancel', setNormal);
  }
}
