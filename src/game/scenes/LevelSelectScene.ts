import Phaser from 'phaser';
import { Button } from '../ui/Button';
import { SaveSystem } from '../systems/SaveSystem';
import { getCharacterConfig } from '../characters';

const LEVELS = [
  'LED Carnival',
  'Battery Badlands',
  'Breadboard Bazaar',
  'Logic Gate Lab',
  'Capacitor Sky City',
  'Relay Robot Factory',
  'Wi-Fi Jungle',
  'Thermal Reactor',
  'Glitch Core Citadel'
];

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectScene');
  }

  create(): void {
    const save = SaveSystem.load();
    const character = getCharacterConfig(save.selectedCharacter);
    this.add.text(480, 44, 'Level Select', { fontFamily: 'monospace', fontSize: '38px', color: '#ffe05d' }).setOrigin(0.5);
    this.add.text(480, 82, `Hero: ${character.name}   Clock Shards: ${save.clockShards.length}/8   High score: ${save.highScore}`, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#f7fff7'
    }).setOrigin(0.5);

    LEVELS.forEach((name, index) => {
      const level = index + 1;
      const implemented = level <= 3;
      const unlocked = level === 1 || save.completedLevels.includes(level - 1);
      const done = save.completedLevels.includes(level) ? '[Fixed]' : unlocked && implemented ? '[Open]' : '[Locked]';
      const chips = save.debugChips[String(level)]?.length ?? 0;
      const label = `${level}. ${name} ${done}  Chips ${chips}/3`;
      const x = index < 5 ? 270 : 690;
      const y = 138 + (index % 5) * 58;
      const play = () => {
        if (implemented && unlocked) this.scene.start('CharacterSelectScene', { nextScene: `Level${level}Scene` });
        else this.showLocked(level, implemented);
      };
      new Button(this, x, y, label, play, 390);
    });
    new Button(this, 300, 486, 'Change Character', () => this.scene.start('CharacterSelectScene', { nextScene: 'LevelSelectScene' }), 260);
    new Button(this, 660, 486, 'Back', () => this.scene.start('MainMenuScene'), 180);
  }

  private showLocked(level: number, implemented: boolean): void {
    const message = implemented ? 'Restore the previous zone first.' : `Level ${level} arrives after Milestone 2.`;
    this.add.text(480, 526, message, {
      fontFamily: 'monospace',
      fontSize: '15px',
      color: '#ffe05d',
      backgroundColor: '#102530cc',
      padding: { x: 10, y: 6 }
    }).setOrigin(0.5).setDepth(20);
  }
}
