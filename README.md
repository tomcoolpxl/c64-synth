# C64 Assembly Sequencer Port

A JavaScript port of the C64 BASIC/Assembly musical sequencer originally by [lftkryo](https://www.youtube.com/@lftkryo), running on Phaser 3.

## Features

*   **Authentic C64 Emulation:**
    *   40x25 Character Grid.
    *   "Pepto" Color Palette.
    *   64px "Sixtyfour" pixel font scaled for authentic rendering.
    *   Accurate PAL timing (50Hz / 400ms cursor blink).
*   **Sequencer:**
    *   3-Voice SID Emulation (Triangle, Pulse, Hybrid Saw/Noise).
    *   Interactive editing (Arrows to move, A-Z to write notes).
    *   Visual playhead on the grid header.
*   **Architecture:**
    *   Modular ES6 design.
    *   Screen RAM simulation.

## Controls

*   **Intro:** Click or Press Key to start.
*   **Sequencer:**
    *   **Arrow Keys:** Move Cursor (Wraps around screen).
    *   **A-Z:** Enter Note.
    *   **Space:** Delete Note.
    *   **Click Screen:** Stop and return to Intro.

## Credits

*   Original Concept: [lftkryo](https://www.youtube.com/@lftkryo)
*   Original Code/Logic: [Linus Åkesson](https://linusakesson.net/)