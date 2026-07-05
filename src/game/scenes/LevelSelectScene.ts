import Phaser from 'phaser';
import { Button } from '../ui/Button';
import { SaveSystem } from '../systems/SaveSystem';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectScene');
  }

  create(): void {
    const save = SaveSystem.load();
    this.add.text(480, 86, 'Level Select', { fontFamily: 'monospace', fontSize: '44px', color: '#ffe05d' }).setOrigin(0.5);
    [
      ['Level 1: LED Carnival', 'Level1Scene'],
      ['Level 2: Battery Badlands', 'Level2Scene'],
      ['Level 3: Breadboard Bazaar', 'Level3Scene']
    ].forEach(([label, scene], index) => {
      const done = save.completedLevels.includes(index + 1) ? '  [Fixed]' : '';
      new Button(this, 480, 180 + index * 64, `${label}${done}`, () => this.scene.start(scene), 390);
    });
    this.add.text(480, 402, `High score: ${save.highScore}`, { fontFamily: 'monospace', fontSize: '18px', color: '#f7fff7' }).setOrigin(0.5);
    new Button(this, 480, 466, 'Back', () => this.scene.start('MainMenuScene'));
  }
}
