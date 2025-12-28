# C64 Assembly Sequencer Port

## Project Overview
A web-based emulation of a C64 musical sequencer using Phaser 3 and Web Audio API.

## Architecture

### Modules (`src/`)
*   **`main.js`**: Entry point. Configures Phaser game instance.
*   **`Config.js`**: Central configuration (Constants, Layout, Audio settings).
*   **`EditorScene.js`**: Main Scene. Manages the high-level state (INTRO vs SEQUENCER), the C64Screen instance, and the Sequencer engine.
*   **`C64Screen.js`**: Handles the visual emulation of the C64 text mode (40x25 grid), cursor logic, and input handling. Maps screen memory to visual Text objects.
*   **`C64Sequencer.js`**: The Audio Engine. Reads directly from `C64Screen` memory to trigger Web Audio oscillators. Implements SID voice logic (Triangle, Pulse, Saw/Noise).
*   **`ui.js`**: Helper functions for creating the "Overlay" elements (though largely superseded by EditorScene logic).
*   **`utils/audio.js`**: Generates the frequency lookup table using accurate PAL clock math.
*   **`utils/c64colors.js`**: Defines the "Pepto" C64 color palette.

## Key Technical Details
*   **Screen Memory:** The sequencer reads notes from the visual grid, mimicking the original assembly code that read from Video RAM.
*   **Font Rendering:** Uses "Sixtyfour" font at 64px size, scaled down (0.25) to fit 16px grid cells. This ensures crisp pixel rendering without blur.
*   **Timing:**
    *   **Audio:** 50Hz PAL Clock (div 8) = ~160ms per step.
    *   **Cursor:** 400ms blink interval (standard C64).
    *   **Pitch:** Derived from PAL clock (985248Hz) and BASIC multiplier (1.0595).

## Usage
Serve the directory with a local web server (e.g., `npx http-server .`) and open in a browser.