import { C64_COLORS } from './utils/c64colors.js';
import { Config } from './Config.js';

export class C64Screen {
    constructor(scene, startX, startY, scale = 2) {
        this.scene = scene;
        this.startX = startX;
        this.startY = startY;
        this.scaleFactor = scale; 

        this.CHAR_SIZE = Config.CHAR_SIZE_PX * scale; 
        
        this.grid = []; 
        this.memory = []; 
        
        this.cursor = { x: 0, y: 0, visible: true }; 
        this.currentColorIdx = Config.COLOR_TEXT; 

        this.container = scene.add.container(startX, startY);
        this.inputActive = true;
        
        this.initBorder();
        this.initGrid();
        this.initCursorBlink();
    }

    initGrid() {
        const fontScale = this.CHAR_SIZE / Config.RENDER_FONT_SIZE;
        const style = this.getStyle(Config.COLOR_TEXT);

        for (let y = 0; y < Config.SCREEN_ROWS; y++) {
            for (let x = 0; x < Config.SCREEN_COLS; x++) {
                const text = this.scene.add.text(
                    x * this.CHAR_SIZE,
                    y * this.CHAR_SIZE,
                    ' ',
                    style
                );
                text.setPadding(0, 0, 0, 0);
                text.setFixedSize(Config.RENDER_FONT_SIZE, Config.RENDER_FONT_SIZE);
                text.setScale(fontScale);
                
                this.container.add(text);
                this.grid.push(text);
                this.memory.push({ char: ' ', colorIdx: Config.COLOR_TEXT });
            }
        }
    }
    
    getStyle(colorIdx) {
        return {
            fontFamily: '"Sixtyfour", monospace',
            fontSize: `${Config.RENDER_FONT_SIZE}px`,
            color: C64_COLORS[colorIdx],
            resolution: 1, 
            fontWeight: '400'
        };
    }

    initBorder() {
        const gameW = this.scene.scale.width;
        const gameH = this.scene.scale.height;
        
        this.border = this.scene.add.rectangle(
            -this.startX, 
            -this.startY, 
            gameW, 
            gameH, 
            parseInt(C64_COLORS[Config.COLOR_BORDER].replace('#', '0x')) 
        ).setOrigin(0,0);
        this.container.add(this.border);
        
        const screenW = Config.SCREEN_COLS * this.CHAR_SIZE;
        const screenH = Config.SCREEN_ROWS * this.CHAR_SIZE;
        
        this.bg = this.scene.add.rectangle(
            0, 
            0, 
            screenW, 
            screenH, 
            parseInt(C64_COLORS[Config.COLOR_BG].replace('#', '0x')) 
        ).setOrigin(0,0);
        this.container.add(this.bg);
    }

    initCursorBlink() {
        this.cursorTimer = this.scene.time.addEvent({
            delay: Config.CURSOR_BLINK_MS, 
            callback: () => {
                this.cursor.visible = !this.cursor.visible;
                this.renderCursorAt(this.cursor.x, this.cursor.y);
            },
            loop: true
        });
    }

    renderCursorAt(x, y) {
        const idx = y * Config.SCREEN_COLS + x;
        if (idx < 0 || idx >= this.grid.length) return;
        
        const textObj = this.grid[idx];
        const mem = this.memory[idx];
        
        if (this.cursor.visible && this.inputActive) {
            textObj.setColor(C64_COLORS[Config.COLOR_BG]); 
            textObj.setBackgroundColor(C64_COLORS[mem.colorIdx]); 
        } else {
            textObj.setColor(C64_COLORS[mem.colorIdx]);
            textObj.setBackgroundColor(null);
        }
    }

    clearCursorAt(x, y) {
        const idx = y * Config.SCREEN_COLS + x;
        if (idx < 0 || idx >= this.grid.length) return;
        
        const textObj = this.grid[idx];
        const mem = this.memory[idx];
        
        textObj.setColor(C64_COLORS[mem.colorIdx]);
        textObj.setBackgroundColor(null);
    }

    print(x, y, text, colorIdx = Config.COLOR_TEXT) {
        text = text.toUpperCase();
        for (let i = 0; i < text.length; i++) {
            if (x + i >= Config.SCREEN_COLS) break;
            this.setChar(x + i, y, text[i], colorIdx);
        }
    }
    
    // New method for arbitrary placement
    printAt(pixelX, pixelY, char, colorIdx) {
        const style = this.getStyle(colorIdx);
        const fontScale = this.CHAR_SIZE / Config.RENDER_FONT_SIZE;
        
        const t = this.scene.add.text(pixelX, pixelY, char, style);
        t.setPadding(0, 0, 0, 0);
        t.setFixedSize(Config.RENDER_FONT_SIZE, Config.RENDER_FONT_SIZE);
        t.setScale(fontScale);
        
        this.container.add(t);
        return t;
    }

    setChar(x, y, char, colorIdx) {
        const idx = y * Config.SCREEN_COLS + x;
        if (idx < 0 || idx >= this.grid.length) return;

        this.memory[idx] = { char, colorIdx };
        const textObj = this.grid[idx];
        
        textObj.setText(char);
        textObj.setColor(C64_COLORS[colorIdx]);
        textObj.setBackgroundColor(null); 
    }
    
    setColor(x, y, colorIdx) {
        const idx = y * Config.SCREEN_COLS + x;
        if (idx < 0 || idx >= this.grid.length) return;
        
        this.memory[idx].colorIdx = colorIdx;
        this.grid[idx].setColor(C64_COLORS[colorIdx]);
    }

    getChar(x, y) {
        const idx = y * Config.SCREEN_COLS + x;
        if (idx < 0 || idx >= this.memory.length) return ' ';
        return this.memory[idx].char;
    }
    
    clear() {
        for(let i=0; i<this.grid.length; i++) {
            this.memory[i] = { char: ' ', colorIdx: Config.COLOR_TEXT };
            this.grid[i].setText(' ');
            this.grid[i].setColor(C64_COLORS[Config.COLOR_TEXT]);
            this.grid[i].setBackgroundColor(null);
        }
    }

    handleInput(event) {
        if (!this.inputActive) return;
        
        const { key, code } = event;
        const maxCols = Config.SCREEN_COLS;
        const maxRows = Config.SCREEN_ROWS;

        this.clearCursorAt(this.cursor.x, this.cursor.y);

        if (code === 'ArrowUp') {
            this.cursor.y--;
            if (this.cursor.y < 0) this.cursor.y = maxRows - 1;
        } 
        else if (code === 'ArrowDown') {
            this.cursor.y++;
            if (this.cursor.y >= maxRows) this.cursor.y = 0;
        } 
        else if (code === 'ArrowLeft') {
            this.cursor.x--;
            if (this.cursor.x < 0) this.cursor.x = maxCols - 1; 
        } 
        else if (code === 'ArrowRight') {
            this.cursor.x++;
            if (this.cursor.x >= maxCols) this.cursor.x = 0; 
        } 
        
        else if (code === 'Enter') {
            this.cursor.x = 0;
            this.cursor.y++;
            if (this.cursor.y >= maxRows) this.cursor.y = 0;
        } 
        else if (code === 'Backspace') {
            this.cursor.x--;
            if (this.cursor.x < 0) {
                this.cursor.x = maxCols - 1;
                this.cursor.y--;
                if (this.cursor.y < 0) this.cursor.y = maxRows - 1;
            }
            this.setChar(this.cursor.x, this.cursor.y, ' ', this.currentColorIdx);
        } 
        else if (code === 'Delete') {
             this.setChar(this.cursor.x, this.cursor.y, ' ', this.currentColorIdx);
        }
        else if (code === 'Home') {
            this.cursor.x = 0;
            this.cursor.y = 0;
        }

        else if (key.length === 1) {
            let char = key.toUpperCase();
            if (char.match(/[ -~]/)) {
                this.setChar(this.cursor.x, this.cursor.y, char, this.currentColorIdx);
                this.cursor.x++;
                if (this.cursor.x >= maxCols) {
                    this.cursor.x = 0;
                    this.cursor.y++;
                    if (this.cursor.y >= maxRows) this.cursor.y = 0;
                }
            }
        }
        
        this.cursor.visible = true;
        this.renderCursorAt(this.cursor.x, this.cursor.y);
        
        this.cursorTimer.reset({
            delay: Config.CURSOR_BLINK_MS,
            callback: () => {
                this.cursor.visible = !this.cursor.visible;
                this.renderCursorAt(this.cursor.x, this.cursor.y);
            },
            loop: true
        });
    }
}