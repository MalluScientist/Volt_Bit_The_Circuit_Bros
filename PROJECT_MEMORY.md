# Project Memory

This file preserves working context for future Codex sessions in this repository.

## Project

- Repository: `Volt_Bit_The_Circuit_Bros`
- Game title used for publishing: `Circuit Bros: Debug Quest`
- Stack: Vite, TypeScript, Phaser
- Target build: browser-playable HTML game for itch.io
- Itch.io viewport: `960x540`
- Release status: prototype / demo

## Current Game Shape

- Three playable levels:
  - Level 1: `LED Carnival`
  - Level 2: `Battery Badlands`
  - Level 3: `Breadboard Bazaar`
- Core systems include platforming, enemies, hazards, collectibles, checkpoints, mini bosses, HUD, menus, touch controls, generated placeholder art, and Web Audio generated sound effects.
- Volt and Bit are now separate selectable characters backed by shared character configs. Volt is faster with lower health; Bit is slower with more health and stronger attacks.
- Level select lists the planned 9-level campaign, but only Levels 1-3 are implemented after the Milestone 1/2 pass.
- Current art is code-generated placeholder pixel-style art.
- No paid assets, copyrighted sprites, music, Nintendo names, or Nintendo assets are used.

## Recent Work Captured In Git

Recent commits before this memory note:

- `df96c1d` - Fix boss health bar updates
- `298dacd` - Fix touch menu input and boss recovery
- `aaf532c` - Fix boss beam impact behavior
- `88eb2ca` - Improve mobile touch controls
- `e47db01` - Match player health to HUD hearts

## Publishing Artifacts

Itch.io page notes are stored in `ITCH_PROJECT_PAGE_DETAILS.txt`.

Generated upload archives currently present:

- `volt-bit-itch.zip`
- `volt-bit-itch-update.zip`
- `volt-bit-itch-mobile-controls-update.zip`
- `volt-bit-itch-beam-boss-fix.zip`
- `volt-bit-itch-touch-menu-boss-recovery.zip`
- `volt-bit-itch-boss-healthbar-fix.zip`
- `volt-bit-itch-milestone-2.zip`

Screenshots and issue captures are kept in `screenshots/`.

## Useful Publishing Details

- Upload file: `volt-bit-itch-milestone-2.zip`
- Project type: HTML
- Browser play: yes
- Embed in page: yes
- Fullscreen button: yes
- Suggested pricing: free or name your own price
- Tagline: `Debug first, ask questions later.`

## Controls

- Move: `A` / `D` or Left / Right
- Jump: Space, `W`, or Up
- Attack: `J`
- Dash: `K`
- Restart from checkpoint: `R`
- Pause: Esc

## Notes For Future Work

- Next intended work is Milestone 3: shared systems for expansion, locked progression polish, Clock Shard/upgrades display, and cleaner patterns for adding levels 4-9.
- Keep the first-screen game experience focused on playability, not marketing copy.
- Preserve the existing Vite / Phaser / TypeScript structure unless there is a concrete reason to change it.
- Programmatic levels and placeholder art are known prototype limitations.
- If changing gameplay behavior, run the project locally and verify desktop plus mobile/touch interactions where relevant.
