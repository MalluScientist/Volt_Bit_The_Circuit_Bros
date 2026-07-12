import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../constants';
import { CHARACTER_CONFIGS, CharacterId } from '../characters';
import { SaveSystem } from '../systems/SaveSystem';
import { Button } from '../ui/Button';

interface CharacterSelectData {
  nextScene?: string;
}

export class CharacterSelectScene extends Phaser.Scene {
  private nextScene = 'Level1Scene';

  constructor() {
    super('CharacterSelectScene');
  }

  create(data: CharacterSelectData): void {
    this.nextScene = data.nextScene ?? 'Level1Scene';
    this.cameras.main.setBackgroundColor(0x07131b);
    this.drawCircuitBackdrop();

    this.add.text(GAME_WIDTH / 2, 58, 'Choose Your Circuit Bro', {
      fontFamily: 'monospace',
      fontSize: '38px',
      color: '#ffe05d',
      stroke: '#07131b',
      strokeThickness: 5
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 102, 'Both brothers can clear every level. Pick your play style.', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#f7fff7'
    }).setOrigin(0.5);

    this.drawCard('volt', 270);
    this.drawCard('bit', 690);

    new Button(this, GAME_WIDTH / 2, GAME_HEIGHT - 42, 'Back', () => this.scene.start('MainMenuScene'), 190);
  }

  private drawCard(id: CharacterId, x: number): void {
    const character = CHARACTER_CONFIGS[id];
    const unlocked = id === 'volt' || SaveSystem.isBitUnlocked();
    const selected = SaveSystem.selectedCharacter() === id && unlocked;
    const card = this.add.rectangle(x, 286, 330, 300, unlocked ? 0x102530 : 0x101014, unlocked ? 0.94 : 0.82).setStrokeStyle(3, selected ? 0xffe05d : unlocked ? character.accent : 0x5a6470, 0.9);
    this.add.text(x, 160, character.name, {
      fontFamily: 'monospace',
      fontSize: '34px',
      color: selected ? '#ffe05d' : unlocked ? '#f7fff7' : '#9aa3aa'
    }).setOrigin(0.5);
    this.add.sprite(x, 220, character.idleTexture).setScale(2.2).setAlpha(unlocked ? 1 : 0.42);
    this.add.text(x, 278, character.selectLine, {
      fontFamily: 'monospace',
      fontSize: '15px',
      color: unlocked ? '#f7fff7' : '#9aa3aa',
      align: 'center',
      wordWrap: { width: 260 }
    }).setOrigin(0.5);
    const stats = !unlocked
      ? 'LOCKED\nComplete Logic Gate Lab to unlock.\n4 battery cells after unlock.'
      : id === 'volt'
      ? 'Speed: HIGH\nHealth: 3\nAttack: quick slash\nBeam: fast cooldown'
      : 'Speed: STEADY\nHealth: 4\nAttack: heavy tool\nBeam: stronger hit';
    this.add.text(x, 354, stats, {
      fontFamily: 'monospace',
      fontSize: '15px',
      color: unlocked ? '#9bd7e8' : '#ff9d5d',
      align: 'center',
      lineSpacing: 7
    }).setOrigin(0.5);
    new Button(this, x, 440, !unlocked ? 'Locked' : selected ? 'Selected' : `Pick ${character.name}`, () => {
      if (!unlocked) return;
      SaveSystem.setSelectedCharacter(id);
      this.scene.start(this.nextScene);
    }, 220);
    card.setInteractive({ useHandCursor: true }).on('pointerup', () => {
      if (!unlocked) return;
      SaveSystem.setSelectedCharacter(id);
      this.scene.start(this.nextScene);
    });
  }

  private drawCircuitBackdrop(): void {
    const g = this.add.graphics();
    g.lineStyle(1, 0x159947, 0.18);
    for (let x = 44; x < GAME_WIDTH; x += 92) {
      g.lineBetween(x, 118, x + 44, 148);
      g.lineBetween(x + 44, 148, x + 12, GAME_HEIGHT - 78);
      g.strokeCircle(x + 44, 148, 4);
    }
    g.lineStyle(2, 0x45c4ff, 0.16);
    g.strokeRoundedRect(70, 126, GAME_WIDTH - 140, GAME_HEIGHT - 184, 10);
  }
}
