# Circuit Bros: Debug Quest

A small browser game prototype for itch.io: a fun-first retro 2D action platformer set in a bright electronics fantasy world. Play as Volt, a tiny engineer-adventurer with goggles, a tool belt, and a cartoony solder slash.

The demo includes three short original levels:

- Level 1: LED Carnival
- Level 2: Battery Badlands
- Level 3: Breadboard Bazaar

Each level has platforming, enemies, hazards, collectibles, a checkpoint, hidden debug chips, and a mini boss.

## Controls

- Move: `A/D` or `Left/Right`
- Jump: `Space`, `W`, or `Up`
- Attack: `J`
- Dash: `K`
- Restart from checkpoint: `R`
- Pause: `Esc`

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
- Enemy and boss AI are intentionally simple for a first playable demo.
- There is no mobile/touch control layer yet.
