// Alarm sound generator using Web Audio API
class AlarmSound {
    constructor() {
        this.audioContext = null;
        this.oscillator = null;
        this.gainNode = null;
        this.isPlaying = false;
    }

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext ||
                window.webkitAudioContext)();
        }
    }

    play() {
        if (this.isPlaying) return;

        this.init();
        this.isPlaying = true;

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
        this.oscillator.stop(now + 100 * patternDuration);

        // Restart when finished (loop effect)
        this.oscillator.onended = () => {
            if (this.isPlaying) {
                this.play();
            }
        };
    }

    stop() {
        this.isPlaying = false;
        if (this.oscillator) {
            try {
                this.oscillator.stop();
                this.oscillator.disconnect();
            } catch (e) {
                // Already stopped
            }
            this.oscillator = null;
        }
        if (this.gainNode) {
            this.gainNode.disconnect();
            this.gainNode = null;
        }
    }
}

export default AlarmSound;
