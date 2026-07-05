import Phaser from 'phaser';

export function burst(scene: Phaser.Scene, x: number, y: number, color = 0xffe05d, count = 12): void {
  for (let i = 0; i < count; i++) {
    const dot = scene.add.rectangle(x, y, 3, 3, color).setDepth(20);
    scene.physics.add.existing(dot);
    const body = dot.body as Phaser.Physics.Arcade.Body;
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    body.setVelocity(Math.cos(angle) * Phaser.Math.Between(60, 230), Math.sin(angle) * Phaser.Math.Between(60, 230));
    body.setAllowGravity(false);
    scene.tweens.add({
      targets: dot,
      alpha: 0,
      scale: 0,
      duration: 420,
      onComplete: () => dot.destroy()
    });
  }
}

export function floatingText(scene: Phaser.Scene, x: number, y: number, text: string, color = '#ffe05d'): void {
  const label = scene.add.text(x, y, text, {
    fontFamily: 'monospace',
    fontSize: '14px',
    color,
    stroke: '#07131b',
    strokeThickness: 3
  }).setOrigin(0.5).setDepth(50);
  scene.tweens.add({
    targets: label,
    y: y - 34,
    alpha: 0,
    duration: 800,
    ease: 'Quad.easeOut',
    onComplete: () => label.destroy()
  });
}
