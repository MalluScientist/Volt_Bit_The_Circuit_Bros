import Phaser from 'phaser';
import { Button } from '../ui/Button';

export class CreditsScene extends Phaser.Scene {
  constructor() {
    super('CreditsScene');
  }

  create(): void {
    this.add.text(480, 86, 'Credits', { fontFamily: 'monospace', fontSize: '44px', color: '#ffe05d' }).setOrigin(0.5);
    this.add.text(480, 210, 'Circuit Bros: Debug Quest\nOriginal prototype with generated placeholder art and tone-based SFX.\nElectronics theme, characters, enemies, bosses, and levels are original.', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#f7fff7',
      align: 'center',
      lineSpacing: 12
    }).setOrigin(0.5);
    new Button(this, 480, 420, 'Main Menu', () => this.scene.start('MainMenuScene'));
  }
}
