# C64 Assembly Sequencer Port

## Project Overview
A web-based emulation of a C64 musical sequencer using Phaser 3 and Web Audio API. It replicates the experience of running a machine-code sequencer from the BASIC prompt.

## Architecture

### Modules (`src/`)
*   **`main.js`**: Entry point. Configures Phaser game instance and high-res scaling.
*   **`Config.js`**: Central configuration (Constants, Layout, Audio settings, Colors).
*   **`EditorScene.js`**: Main Scene. Manages the state machine (`INTRO` vs `SEQUENCER`). Handles shell interaction (`RUN` command, Syntax Error logic) and transitions.
*   **`C64Screen.js`**: "Virtual Machine" display.
    *   Manages 40x25 grid of Text objects.
    *   Handles Cursor logic (Blink, Inverse Video, Wrapping).
    *   Exposes `getLine`, `newLine`, `printAt` for shell behavior.
*   **`C64Sequencer.js`**: Audio Engine. Reads directly from `C64Screen` visual memory to trigger oscillators.
*   **`utils/audio.js`**: Generates frequency tables using precise PAL clock math.
*   **`utils/c64colors.js`**: Defines the "Pepto" C64 palette.

## Key Technical Details
*   **Interactive Shell:** The "Intro" is not a static image but a live grid. Pressing `ENTER` reads the text at the cursor line. `RUN` triggers the Sequencer state; other text triggers `?SYNTAX ERROR`.
*   **Screen Memory:** The sequencer logic reads notes from the visual grid (Row/Column mapping), mimicking the original assembly code that read from Video RAM.
*   **Font Rendering:** Uses "Sixtyfour" font at 64px, scaled to 0.25 (16px visual). This bypasses browser anti-aliasing artifacts on small pixel fonts.
*   **Timing:**
    *   **Audio:** 50Hz PAL Clock (div 8) = ~160ms per step.
    *   **Cursor:** 400ms blink interval (standard C64).
    *   **Pitch:** Derived from PAL clock (985248Hz).

## Usage
Serve the directory with a local web server (e.g., `npx http-server .`) and open in a browser.
