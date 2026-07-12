import Phaser from 'phaser';
import { Button } from '../ui/Button';
import { SaveSystem } from '../systems/SaveSystem';
import { getCharacterConfig } from '../characters';
import { ProgressionSystem, LevelProgress } from '../systems/ProgressionSystem';

export class LevelSelectScene extends Phaser.Scene {
  private lockedMessage?: Phaser.GameObjects.Text;

  constructor() {
    super('LevelSelectScene');
  }

  create(): void {
    const save = SaveSystem.load();
    const character = getCharacterConfig(save.selectedCharacter);
    this.add.text(480, 44, 'Level Select', { fontFamily: 'monospace', fontSize: '38px', color: '#ffe05d' }).setOrigin(0.5);
    this.add.text(480, 82, `Hero: ${character.name}   Clock Shards: ${ProgressionSystem.shardText(save)}   High score: ${save.highScore}`, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#f7fff7'
    }).setOrigin(0.5);

    ProgressionSystem.levelProgress(save).forEach((progress, index) => {
      const label = `${progress.level.id}. ${progress.level.shortName} ${progress.stateLabel} ${progress.chips}/3`;
      const x = index < 5 ? 240 : 720;
      const y = 138 + (index % 5) * 58;
      const play = () => {
        if (progress.level.implemented && progress.unlocked && progress.level.sceneKey) this.scene.start(progress.level.sceneKey);
        else this.showLocked(progress);
      };
      new Button(this, x, y, label, play, 330, '13px');
    });
    new Button(this, 300, 486, 'Change Character', () => this.scene.start('CharacterSelectScene', { nextScene: 'LevelSelectScene' }), 260);
    new Button(this, 660, 486, 'Back', () => this.scene.start('MainMenuScene'), 180);
  }

  private showLocked(progress: LevelProgress): void {
    const message = ProgressionSystem.lockedMessage(progress);
    this.lockedMessage?.destroy();
    this.lockedMessage = this.add.text(480, 526, message, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffe05d',
      backgroundColor: '#102530cc',
      padding: { x: 10, y: 6 },
      wordWrap: { width: 760 }
    }).setOrigin(0.5).setDepth(20);
  }
}
