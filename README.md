# Circuit Bros: Debug Quest

A small browser game prototype for itch.io: a fun-first retro 2D action platformer set in a bright electronics fantasy world. Choose between Volt, a fast reckless solder-sword hero, and Bit, a sturdier brother with a heavier debug tool.

The demo includes three short original levels:

- Level 1: LED Carnival
- Level 2: Battery Badlands
- Level 3: Breadboard Bazaar

Each level has platforming, enemies, hazards, collectibles, a checkpoint, hidden debug chips, and a mini boss.

## Current Milestone Status

- Milestone 1 complete: character configs, Volt/Bit selection, save migration, HUD/menu flow, and both characters playable in the existing levels.
- Milestone 2 complete: current three-level polish pass with stronger boss feedback, improved level-complete summary, dialogue, checkpoint polish, and mobile touch control improvements.
- Levels 4-9 are listed in level select as future locked campaign entries and should be added after the current prototype remains stable.

## Controls

- Move: `A/D` or `Left/Right`
- Jump: `Space`, `W`, or `Up`
- Double jump: press jump again in the air
- Attack: `J`
- Dash: `K`
- Debug Beam: `U` after collecting all 3 debug chips in a level
- Restart from checkpoint: `R`
- Pause: `Esc`
- Touch devices: on-screen move, jump, attack, dash, beam, and pause buttons

## Characters

- Volt: higher speed, stronger dash mobility, faster attack timing, 3 health.
- Bit: slower movement, 4 health, stronger attack and chip beam, heavier timing.

The selected character is saved in `localStorage` and can be changed from the main menu or level select.

## Run Locally

```bash
npm install
npm run dev
```

Open the local Vite URL in your browser.

## Build

```bash
npm run build
```

The static itch.io-ready build is generated in `dist/`, with `dist/index.html` at the root.

## Preview Build

```bash
npm run preview
```

## itch.io Upload

1. Run `npm run build`.
2. Zip the contents of `dist/`, not the parent folder.
3. Upload the zip to an itch.io HTML5 project.
4. Set the project to run in the browser.

## Asset Notes

All current art is original generated placeholder pixel-style art made in code. Sound effects are simple generated tones through the Web Audio API. No paid assets, copyrighted sprites, music, Nintendo names, or Nintendo assets are used.

## Known Prototype Limitations

- Art and animation are placeholder-quality and intended to be replaced.
- Levels are programmatic rather than tilemap-authored.
- Enemy and boss AI are intentionally simple and should be expanded level by level.
- Mobile controls are present, but should still be tested on real devices before upload.
