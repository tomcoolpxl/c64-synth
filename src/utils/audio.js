import { Config } from '../Config.js';

/**
 * Generates the SID frequency lookup table.
 * Uses configuration from Config.js for PAL accuracy.
 * 
 * MATH:
 * The SID chip doesn't use Hertz directly. It uses a 16-bit frequency register.
 * Fout = (Fn * Fclk) / 16777216
 * We pre-calculate these Hz values for all 255 visual steps.
 * 
 * @returns {number[]} Array of frequencies in Hz
 */
export function generateFreqTable() {
    const freqTable = [];
    let f_reg = 40;
    
    // Formula: Hz = (RegisterVal * Clock) / 2^24
    const PAL_FACTOR = Config.PAL_CLOCK_HZ / Config.SID_MAX_VAL; 
    
    for (let i = 0; i < 255; i++) {
        freqTable.push(f_reg * PAL_FACTOR);
        // Multiply by 12th root of 2 to get the next semitone
        f_reg = f_reg * Config.BASIC_TUNING_FACTOR;
    }
    return freqTable;
}