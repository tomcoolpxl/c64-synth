import { C64Sequencer } from './C64Sequencer.js';
import { C64Screen } from './C64Screen.js';
import { C64_COLORS } from './utils/c64colors.js';
import { Config } from './Config.js';

export class EditorScene extends Phaser.Scene {
    constructor() {
        super('EditorScene');
        this.sequencer = null;
        this.c64 = null;
        this.state = 'INTRO'; // INTRO or SEQUENCER
        this.prevStep = -1; // Track playhead position
        this.creditsGroup = []; // Track credit text objects to clear them if needed
    }

    create() {
        // --- INIT C64 SCREEN ---
        const screenW = Config.SCREEN_COLS * Config.CHAR_SIZE_PX * 2; 
        const screenH = Config.SCREEN_ROWS * Config.CHAR_SIZE_PX * 2; 
        const startX = (this.scale.width - screenW) / 2;
        const startY = (this.scale.height - screenH) / 2;

        this.c64 = new C64Screen(this, startX, startY, 2);
        
        // --- GLOBAL INPUT ---
        this.input.keyboard.on('keydown', (e) => this.handleGlobalKey(e));
        this.input.on('pointerdown', () => this.handleGlobalClick());

        // --- START INTRO ---
        this.showIntro();
    }

    showIntro() {
        this.state = 'INTRO';
        this.c64.inputActive = false;
        this.c64.clear();
        this.clearCredits(); // Clear any existing credits
        this.c64.cursor.visible = false;

        this.c64.print(4, 1, "**** COMMODORE 64 BASIC V2 ****", Config.COLOR_TEXT);
        this.c64.print(1, 3, "64K RAM SYSTEM  38911 BASIC BYTES FREE", Config.COLOR_TEXT);
        this.c64.print(0, 5, "READY.", Config.COLOR_TEXT);
        
        const prompt = "CLICK OR PRESS KEY TO CONTINUE";
        const x = Math.floor((40 - prompt.length) / 2);
        this.c64.print(x, 12, prompt, Config.COLOR_HIGHLIGHT); 

        this.c64.cursor.x = 0;
        this.c64.cursor.y = 6;
        this.c64.cursor.visible = true;
        this.c64.inputActive = false; 
    }

    startSequencer() {
        if (this.state === 'SEQUENCER') return;
        this.state = 'SEQUENCER';
        
        this.sequencer = new C64Sequencer(this, this.c64);
        this.sequencer.start();

        this.c64.clear();
        this.c64.inputActive = true;
        
        // --- POPULATE SONG ---
        this.c64.print(0, Config.ROW_HEADER, "80 REM", Config.COLOR_TEXT); 
        this.c64.print(Config.SEQ_COL_OFFSET, Config.ROW_HEADER, "+---+---+---+---+---+---+---+---", Config.COLOR_TEXT); 

        Config.DEFAULT_TRACKS.forEach((trackStr, i) => {
            const row = Config.ROW_TRACK_1 + i;
            this.c64.print(0, row, `${81 + i} REM`, Config.COLOR_TEXT);
            this.c64.print(Config.SEQ_COL_OFFSET, row, trackStr.padEnd(32, ' '), Config.COLOR_TEXT); 
        });

        this.c64.print(0, Config.ROW_FOOTER_1, "84 REM", Config.COLOR_TEXT);
        this.c64.print(0, Config.ROW_FOOTER_2, "85 REM", Config.COLOR_TEXT);
        this.c64.print(Config.SEQ_COL_OFFSET, Config.ROW_FOOTER_2, "  B D   G I K   N P   S U W   Z ", Config.COLOR_TEXT);
        this.c64.print(0, Config.ROW_FOOTER_3, "86 REM", Config.COLOR_TEXT);
        this.c64.print(Config.SEQ_COL_OFFSET, Config.ROW_FOOTER_3, " A C E F H J L M O Q R T V X Y", Config.COLOR_TEXT);

        this.c64.print(0, Config.ROW_READY, "READY.", Config.COLOR_TEXT);
        this.c64.cursor.x = 0;
        this.c64.cursor.y = Config.ROW_CURSOR_START;

        this.c64.print(0, 14, "*** C64 ASM SEQUENCER ***", Config.COLOR_TEXT);
        this.c64.print(0, 16, "ARROWS: MOVE CURSOR", Config.COLOR_TEXT);
        this.c64.print(0, 17, "A-Z   : WRITE NOTE", Config.COLOR_TEXT);
        this.c64.print(0, 18, "SPACE : DELETE NOTE", Config.COLOR_TEXT);
        this.c64.print(0, 19, "ENTER : RETURN", Config.COLOR_TEXT);

        // Credits (Exactly 1 Line Gap)
        this.renderBorderText("ORIGINAL CONCEPT: LFTKRYO (YOUTUBE)", C64_COLORS[Config.COLOR_CREDIT]);

        // Sequencer Events
        this.prevStep = -1;
        this.events.on('step', (step) => {
            const COL_OFFSET = Config.SEQ_COL_OFFSET;
            
            if (this.prevStep !== -1) {
                const prevCol = COL_OFFSET + this.prevStep;
                this.c64.setColor(prevCol, Config.ROW_HEADER, Config.COLOR_TEXT); 
            }
            
            const col = COL_OFFSET + step;
            this.c64.setColor(col, Config.ROW_HEADER, Config.COLOR_HIGHLIGHT); 
            
            this.prevStep = step;
        });

        this.events.on('stop', () => {
            if (this.prevStep !== -1) {
                const COL_OFFSET = Config.SEQ_COL_OFFSET;
                const prevCol = COL_OFFSET + this.prevStep;
                this.c64.setColor(prevCol, Config.ROW_HEADER, Config.COLOR_TEXT);
                this.prevStep = -1;
            }
        });
    }

    renderBorderText(text, colorHex) {
        const FONT_SIZE = Config.RENDER_FONT_SIZE;
        const CHAR_SIZE = this.c64.CHAR_SIZE;
        const SCALE = CHAR_SIZE / FONT_SIZE;
        
        // Relative Y: Grid Height + 1 Line Gap
        const relY = (this.c64.ROWS * CHAR_SIZE) + CHAR_SIZE; 
        const relX = 0; // Relative to container start

        const style = {
            fontFamily: '"Sixtyfour", monospace',
            fontSize: `${FONT_SIZE}px`,
            color: colorHex,
            resolution: 1, 
            fontWeight: '400'
        };

        this.clearCredits(); // Ensure no dupes

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const t = this.add.text(
                relX + (i * CHAR_SIZE),
                relY,
                char,
                style
            );
            t.setPadding(0, 0, 0, 0);
            t.setFixedSize(FONT_SIZE, FONT_SIZE);
            t.setScale(SCALE);
            
            t.setInteractive({ useHandCursor: true });
            t.on('pointerdown', () => {
                 window.open('https://www.youtube.com/watch?v=ly5BhGOt2vE', '_blank');
            });
            
            this.c64.container.add(t); // Add to C64 Container
            this.creditsGroup.push(t);
        }
    }
    
    clearCredits() {
        this.creditsGroup.forEach(t => t.destroy());
        this.creditsGroup = [];
    }

    handleGlobalKey(e) {
        if (this.state === 'INTRO') {
            this.startSequencer();
        } else {
            if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
                // e.preventDefault(); 
            }
            this.c64.handleInput(e);
        }
    }

    handleGlobalClick() {
        if (this.state === 'INTRO') {
            this.startSequencer();
        } else {
            if (this.sequencer.isPlaying) {
                this.sequencer.stop();
            }
            this.showIntro();
        }
    }
}
