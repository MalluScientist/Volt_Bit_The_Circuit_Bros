import Phaser from 'phaser';

export class DialogToast {
  private active?: Phaser.GameObjects.Text;

  constructor(private scene: Phaser.Scene) {}

  show(message: string): void {
    this.active?.destroy();
    this.active = this.scene.add.text(480, 92, message, {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#f7fff7',
      backgroundColor: '#102530cc',
      padding: { x: 14, y: 8 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
    this.scene.tweens.add({
      targets: this.active,
      alpha: 0,
      delay: 1500,
      duration: 500,
      onComplete: () => this.active?.destroy()
    });
  }
}
