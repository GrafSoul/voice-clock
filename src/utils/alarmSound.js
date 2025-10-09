// Alarm sound generator using Web Audio API
class AlarmSound {
    constructor() {
        this.audioContext = null;
        this.oscillator = null;
        this.gainNode = null;
        this.isPlaying = false;
        this.loopTimeoutId = null;
    }

    init() {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext ||
                    window.webkitAudioContext)();
            }
            return true;
        } catch (error) {
            console.error('Failed to initialize AudioContext:', error);
            return false;
        }
    }

    play() {
        if (this.isPlaying) return;

        if (!this.init()) {
            console.error('Cannot play alarm: AudioContext initialization failed');
            return;
        }

        this.isPlaying = true;

        try {
            // Create oscillator for beep sound
            this.oscillator = this.audioContext.createOscillator();
            this.gainNode = this.audioContext.createGain();

            // Connect nodes
            this.oscillator.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);

            // Set frequency (classic alarm beep: 800Hz)
            this.oscillator.frequency.value = 800;
            this.oscillator.type = 'sine';

            // Create beeping pattern
            const now = this.audioContext.currentTime;
            const beepDuration = 0.2; // 200ms beep
            const pauseDuration = 0.2; // 200ms pause
            const patternDuration = beepDuration + pauseDuration;
            const totalDuration = 100 * patternDuration;

            // Repeating beep pattern
            for (let i = 0; i < 100; i++) {
                const startTime = now + i * patternDuration;
                const endTime = startTime + beepDuration;

                this.gainNode.gain.setValueAtTime(0, startTime);
                this.gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
                this.gainNode.gain.setValueAtTime(0.3, endTime - 0.01);
                this.gainNode.gain.linearRampToValueAtTime(0, endTime);
            }

            this.oscillator.start(now);
            this.oscillator.stop(now + totalDuration);

            // Use timeout instead of onended for safer loop
            this.loopTimeoutId = setTimeout(() => {
                if (this.isPlaying) {
                    // Clean up current oscillator before creating new one
                    if (this.oscillator) {
                        try {
                            this.oscillator.disconnect();
                        } catch (e) {
                            // Already disconnected
                        }
                        this.oscillator = null;
                    }
                    if (this.gainNode) {
                        try {
                            this.gainNode.disconnect();
                        } catch (e) {
                            // Already disconnected
                        }
                        this.gainNode = null;
                    }
                    // Restart with a fresh oscillator
                    this.isPlaying = false;
                    this.play();
                }
            }, totalDuration * 1000);
        } catch (error) {
            console.error('Failed to play alarm sound:', error);
            this.isPlaying = false;
        }
    }

    stop() {
        this.isPlaying = false;
        
        // Clear any pending loop timeout
        if (this.loopTimeoutId) {
            clearTimeout(this.loopTimeoutId);
            this.loopTimeoutId = null;
        }
        
        if (this.oscillator) {
            try {
                this.oscillator.stop();
                this.oscillator.disconnect();
            } catch (e) {
                // Already stopped or disconnected
                console.warn('Oscillator cleanup warning:', e.message);
            }
            this.oscillator = null;
        }
        if (this.gainNode) {
            try {
                this.gainNode.disconnect();
            } catch (e) {
                // Already disconnected
                console.warn('GainNode cleanup warning:', e.message);
            }
            this.gainNode = null;
        }
    }
}

export default AlarmSound;
