import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, GRAVITY_Y } from './constants';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { Level1Scene } from './scenes/Level1Scene';
import { Level2Scene } from './scenes/Level2Scene';
import { Level3Scene } from './scenes/Level3Scene';
import { GameOverScene } from './scenes/GameOverScene';
import { LevelCompleteScene } from './scenes/LevelCompleteScene';
import { CreditsScene } from './scenes/CreditsScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#07131b',
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: GRAVITY_Y, x: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    LevelSelectScene,
    Level1Scene,
    Level2Scene,
    Level3Scene,
    GameOverScene,
    LevelCompleteScene,
    CreditsScene
  ]
};
