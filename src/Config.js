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
    // 985248Hz is the standard PAL C64 CPU Clock.
    // This is used to derive exact frequency tables matching the hardware.
    PAL_CLOCK_HZ: 985248,
    
    // The SID chip uses a 24-bit accumulator for frequency generation.
    // 2^24 = 16777216.
    SID_MAX_VAL: 16777216,
    
    // 1.0595 is roughly the 12th root of 2, used for semitone stepping.
    // This multiplier allows us to generate a chromatic scale from a base frequency.
    BASIC_TUNING_FACTOR: 1.0595,
    
    // Sequencer Timing: 50Hz (PAL refresh) divided by 8 frames per step.
    // 1000ms / 50Hz = 20ms per frame. 20ms * 8 = 160ms per beat.
    PAL_TICK_DELAY_MS: 160, 
    
    // Cursor
    // Standard C64 cursor blink rate is approx 0.4 seconds.
    CURSOR_BLINK_MS: 400,

    // Default Song Data
    // These strings represent the visual "memory" of the sequencer tracks.
    // The sequencer reads these characters from the screen to trigger notes.
    // Spaces are rests. Letters A-Z correspond to musical notes.
    DEFAULT_TRACKS: [
        "Q   :   :   R   Q   :   :   M O ",
        "T VT:RQMO T XVTQ:M YXVTQ:M QRQO ",
        "AM AMA MHT HTH TJV JVJ VFR FRF R"
    ]
};
