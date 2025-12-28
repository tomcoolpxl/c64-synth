import { generateFreqTable } from './utils/audio.js';
import { Config } from './Config.js';

/**
 * C64 SEQUENCER PORT - AUDIO ENGINE
 * Handles the Web Audio API context, oscillators, and timing.
 * Reads directly from the C64Screen virtual memory.
 */
export class C64Sequencer {
    constructor(scene, screenRef) {
        this.scene = scene;
        this.screen = screenRef; 
        
        // Track Configuration mapped to Screen Rows
        this.TRACK_CONFIG = [
            { 
                row: Config.ROW_TRACK_1, 
                mask: 82, 
                type: 'triangle', 
                vol: 0.35, 
                attack: 0.05, 
                release: 1.5, 
                mode: 'standard' 
            },
            { 
                row: Config.ROW_TRACK_2, 
                mask: 70, 
                type: 'square', 
                vol: 0.2, 
                attack: 0.01, 
                release: 0.1, 
                mode: 'standard' 
            },
            { 
                row: Config.ROW_TRACK_3, 
                mask: 46, 
                type: 'sawtooth', 
                vol: 0.3, 
                attack: 0.02, 
                release: 0.2, 
                mode: 'bass_snare' 
            }
        ];

        this.context = null;
        this.oscs = [];
        this.isPlaying = false;
        this.currentStep = 0;
        this.freqTable = generateFreqTable();
        this.timer = null;
    }

    start() {
        if (this.isPlaying) return;
        
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!this.context) this.context = new AudioContext();
        
        const bSize = this.context.sampleRate * 2;
        this.noiseBuffer = this.context.createBuffer(1, bSize, this.context.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < bSize; i++) data[i] = Math.random() * 2 - 1;

        this.context.resume().then(() => {
            this.setupVoices();
            this.isPlaying = true;
            this.timer = this.scene.time.addEvent({
                delay: Config.PAL_TICK_DELAY_MS,
                callback: this.playStep,
                callbackScope: this,
                loop: true
            });
        });
    }

    stop() {
        if (!this.isPlaying) return;
        if (this.timer) this.timer.remove();
        
        this.oscs.forEach(v => {
            try {
                v.osc.stop();
                v.osc.disconnect();
                if(v.noiseSrc) {
                    v.noiseSrc.stop();
                    v.noiseSrc.disconnect();
                }
            } catch(e) {} 
        });
        this.oscs = [];
        
        this.isPlaying = false;
        this.currentStep = 0;
        this.scene.events.emit('stop');
    }

    setupVoices() {
        this.oscs = [];
        this.TRACK_CONFIG.forEach(track => {
            const gain = this.context.createGain();
            gain.gain.value = 0;
            gain.connect(this.context.destination);
            let osc = this.context.createOscillator();
            let noiseSrc = null, noiseGain = null;

            if (track.mode === 'bass_snare') {
                osc.type = 'sawtooth';
                osc.connect(gain);
                
                noiseSrc = this.context.createBufferSource();
                noiseSrc.buffer = this.noiseBuffer;
                noiseSrc.loop = true;
                noiseGain = this.context.createGain();
                noiseGain.gain.value = 0;
                
                noiseSrc.connect(noiseGain);
                noiseGain.connect(gain);
                noiseSrc.start();
            } 
            else if (track.type === 'square') {
                osc.type = 'square';
                // Lowpass to simulate the warm SID pulse sound
                const filter = this.context.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 3500;
                osc.connect(filter);
                filter.connect(gain);
            } 
            else {
                osc.type = track.type;
                osc.connect(gain);
            }
            osc.start();
            this.oscs.push({ osc, gain, noiseGain, noiseSrc, track });
        });
    }

    playStep() {
        if (this.currentStep >= Config.SEQ_STEPS) this.currentStep = 0;
        const now = this.context.currentTime;
        
        this.oscs.forEach((v) => {
            // Read directly from Screen Memory
            const col = Config.SEQ_COL_OFFSET + this.currentStep;
            const char = this.screen.getChar(col, v.track.row);
            
            const screenCode = (char && char.trim()) ? (char.toUpperCase().charCodeAt(0) - 64) : 32;

            if (screenCode < 1 || screenCode > 26) { 
                if (v.track.mode === 'bass_snare') {
                    v.osc.frequency.setValueAtTime(0, now);
                    v.noiseGain.gain.setValueAtTime(0.5, now);
                    v.gain.gain.cancelScheduledValues(now);
                    v.gain.gain.setValueAtTime(0.3, now);
                    v.gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                } else {
                    v.gain.gain.cancelScheduledValues(now);
                    v.gain.gain.setTargetAtTime(0, now, v.track.release * 0.2);
                }
            } 
            else { 
                if (v.track.mode === 'bass_snare') v.noiseGain.gain.setValueAtTime(0, now);
                
                const idx = screenCode + v.track.mask;
                if (idx < this.freqTable.length) {
                    v.osc.frequency.setValueAtTime(this.freqTable[idx], now);
                    v.gain.gain.cancelScheduledValues(now);
                    v.gain.gain.setValueAtTime(v.gain.gain.value, now);
                    v.gain.gain.linearRampToValueAtTime(v.track.vol, now + v.track.attack);
                }
            }
        });
        this.scene.events.emit('step', this.currentStep);
        this.currentStep++;
    }
}
