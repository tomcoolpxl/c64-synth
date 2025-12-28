import { EditorScene } from './EditorScene.js';

const config = {
    type: Phaser.AUTO,
    // Logical resolution: 720x480
    // REASONING:
    // A standard C64 text area is 320x200. We scale by 2 -> 640x400.
    // 720x480 gives us a comfortable border (40px side, 40px top/bottom)
    // mimicking the "safe area" of a CRT monitor.
    // Text Area (40cols * 16px): 640 wide
    // Text Area (25rows * 16px): 400 high
    // Border: 40px on sides ((720-640)/2), 40px on top/bottom ((480-400)/2)
    width: 720,
    height: 480,
    backgroundColor: '#000000',
    parent: document.body,
    render: {
        pixelArt: true, // Ensure crisp scaling
        antialias: false
    },
    scale: {
        mode: Phaser.Scale.FIT, // Scale to fit the window
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 480
    },
    scene: [EditorScene]
};

WebFont.load({
    google: {
        families: ['Sixtyfour']
    },
    active: function() {
        new Phaser.Game(config);
    }
});