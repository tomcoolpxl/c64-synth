import { C64_COLOR_MAP } from './utils/c64colors.js';

export const Config = {
    // Screen Layout
    SCREEN_COLS: 40,
    SCREEN_ROWS: 25,
    CHAR_SIZE_PX: 8,
    RENDER_FONT_SIZE: 64,
    
    // Colors (Indices)
    COLOR_BG: C64_COLOR_MAP.BLUE,         // 6
    COLOR_BORDER: C64_COLOR_MAP.LIGHTBLUE,// 14
    COLOR_TEXT: C64_COLOR_MAP.LIGHTBLUE,  // 14
    COLOR_HIGHLIGHT: C64_COLOR_MAP.WHITE, // 1
    COLOR_GRID: C64_COLOR_MAP.LIGHTBLUE,  // 14
    COLOR_CREDIT: C64_COLOR_MAP.BLUE,     // 6

    // Sequencer
    SEQ_STEPS: 32,
    SEQ_COL_OFFSET: 7,
    
    // Track Layout (Row Indices)
    ROW_HEADER: 2,
    ROW_TRACK_1: 3,
    ROW_TRACK_2: 4,
    ROW_TRACK_3: 5,
    ROW_FOOTER_1: 6,
    ROW_FOOTER_2: 7,
    ROW_FOOTER_3: 8,
    ROW_READY: 10,
    ROW_CURSOR_START: 11,

    // Audio / PAL Config
    PAL_CLOCK_HZ: 985248,
    SID_MAX_VAL: 16777216,
    BASIC_TUNING_FACTOR: 1.0595,
    PAL_TICK_DELAY_MS: 160, // 50Hz / 8
    
    // Cursor
    CURSOR_BLINK_MS: 400,

    // Default Song Data
    DEFAULT_TRACKS: [
        "Q   :   :   R   Q   :   :   M O ",
        "T VT:RQMO T XVTQ:M YXVTQ:M QRQO ",
        "AM AMA MHT HTH TJV JVJ VFR FRF R"
    ]
};
