import { Config } from './Config.js';

/**
 * UI Helper functions for the C64 Sequencer
 */

export function createOverlay(scene, style, onStart) {
    const w = scene.scale.width;
    const h = scene.scale.height;
    const cx = w / 2;
    const cy = h / 2;

    const overlay = scene.add.container(0, 0);
    const bg = scene.add.rectangle(cx, cy, w, h, 0x000000, 0.85);
    
    // High-Res Scaling Strategy
    const fontSizePx = Config.RENDER_FONT_SIZE;
    const overlayStyle = { ...style, fontSize: `${fontSizePx}px` };
    const scale = 0.5; // Visual 32px

    const t1 = scene.add.text(20, 20, "    **** COMMODORE 64 BASIC V2 ****", overlayStyle)
        .setOrigin(0, 0.5).setScale(scale);
    const t2 = scene.add.text(20, 50, " 64K RAM SYSTEM  38911 BASIC BYTES FREE", overlayStyle)
        .setOrigin(0, 0.5).setScale(scale);
    const t3 = scene.add.text(20, 80, "READY.", overlayStyle)
        .setOrigin(0, 0.5).setScale(scale);
    
    const blink = scene.add.rectangle(20, 100, 19, 32, 0x6c5eb5).setOrigin(0, 0);
    
    scene.time.addEvent({
        delay: 333,
        callback: () => { blink.setVisible(!blink.visible); },
        loop: true
    });

    const clickTxt = scene.add.text(cx, h - 100, "CLICK TO RUN", { ...overlayStyle, color: '#ffffff' })
        .setOrigin(0.5).setScale(scale);

    overlay.add([bg, t1, t2, t3, blink, clickTxt]);
    overlay.setInteractive(new Phaser.Geom.Rectangle(0,0,w,h), Phaser.Geom.Rectangle.Contains);
    
    overlay.on('pointerdown', (pointer, localX, localY, event) => {
        event.stopPropagation();
        onStart();
        overlay.destroy();
    });

    return overlay;
}

export function createCreditLink(scene, x, y, style) {
    const creditText = scene.add.text(x, y, 'ORIGINAL CONCEPT: LFTKRYO (YOUTUBE)', style);
    creditText.setInteractive({ useHandCursor: true });
    creditText.on('pointerdown', () => {
        window.open('https://www.youtube.com/watch?v=ly5BhGOt2vE', '_blank');
    });
    return creditText;
}