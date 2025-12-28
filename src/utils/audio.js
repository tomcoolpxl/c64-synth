import { Config } from '../Config.js';

/**
 * Generates the SID frequency lookup table.
 * Uses configuration from Config.js for PAL accuracy.
 * @returns {number[]} Array of frequencies in Hz
 */
export function generateFreqTable() {
    const freqTable = [];
    let f_reg = 40;
    
    // Formula: Hz = (RegisterVal * Clock) / 2^24
    const PAL_FACTOR = Config.PAL_CLOCK_HZ / Config.SID_MAX_VAL; 
    
    for (let i = 0; i < 255; i++) {
        freqTable.push(f_reg * PAL_FACTOR);
        f_reg = f_reg * Config.BASIC_TUNING_FACTOR;
    }
    return freqTable;
}