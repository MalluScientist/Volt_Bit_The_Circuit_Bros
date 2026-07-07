import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../constants';
import { AudioSystem } from '../systems/AudioSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { Button } from '../ui/Button';

export class StoryScene extends Phaser.Scene {
  constructor() {
    super('StoryScene');
  }

  create(): void {
    AudioSystem.setMusicEnabled(SaveSystem.load().musicEnabled);
    AudioSystem.bindMusicUnlock(this);
    this.cameras.main.setBackgroundColor(0x07131b);
    this.drawCircuit();

    this.add.rectangle(GAME_WIDTH / 2, 292, 680, 318, 0x07131b, 0.88).setStrokeStyle(2, 0x45c4ff, 0.75);

    this.add.text(GAME_WIDTH / 2, 82, 'Before The Spark', {
      fontFamily: 'monospace',
      fontSize: '34px',
      color: '#ffe05d',
      stroke: '#07131b',
      strokeThickness: 6
    }).setOrigin(0.5);

    const story = [
      'Deep inside an old arcade board, the circuits woke up angry.',
      'Loose wires scrambled the levels.',
      'Debug chips vanished.',
      'Every diode started acting like a boss.',
      'Volt Bit and the Circuit Bros must clean the board and bring the spark back online.'
    ].join('\n\n');

    this.add.text(GAME_WIDTH / 2, 260, story, {
      fontFamily: 'monospace',
      fontSize: '17px',
      color: '#f7fff7',
      align: 'center',
      lineSpacing: 5,
      wordWrap: { width: 570 }
    }).setOrigin(0.5);

    new Button(this, GAME_WIDTH / 2, 452, 'Continue', () => {
      SaveSystem.setStorySeen();
      AudioSystem.playMusic();
      this.scene.start('MainMenuScene');
    });
  }

  private drawCircuit(): void {
    const g = this.add.graphics();
    g.lineStyle(2, 0x159947, 0.14);
    for (let x = 70; x < GAME_WIDTH; x += 170) {
      g.lineBetween(x, 138, x + 64, 188);
      g.lineBetween(x + 64, 188, x + 18, 392);
      g.strokeCircle(x + 72, 190, 5);
      g.strokeCircle(x + 18, 392, 5);
    }
    g.lineStyle(2, 0x45c4ff, 0.18);
    g.strokeRoundedRect(52, 122, GAME_WIDTH - 104, GAME_HEIGHT - 174, 12);
  }
}
