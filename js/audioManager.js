// ============================================================================
// SWEET DREAMS - TIỆM BÁNH NGỌT
// AudioManager: Web Audio API SFX + Cozy Pastel Music Loop
// ============================================================================

window.AudioManager = class AudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.musicEnabled = true;
    this.volume = 0.55;
    this.bgmTimer = null;
    this.noteIdx = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.musicEnabled && !this.bgmTimer) {
      this.startBGM();
    }
  }

  setEnabled(val) {
    this.enabled = !!val;
    if (!this.enabled) {
      this.stopBGM();
    } else if (this.musicEnabled) {
      this.startBGM();
    }
  }

  setMusicEnabled(val) {
    this.musicEnabled = !!val;
    if (!this.musicEnabled) {
      this.stopBGM();
    } else if (this.enabled) {
      this.startBGM();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, Number(val)));
  }

  _playTone(freq, duration = 0.12, type = 'sine', volScale = 0.25, delay = 0) {
    if (!this.enabled || !this.ctx || this.volume <= 0) return;
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    const v = Math.max(0.001, this.volume * volScale);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(v, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playDoorBell() {
    this.init();
    this._playTone(880, 0.16, 'triangle', 0.22, 0);
    this._playTone(1174.66, 0.26, 'triangle', 0.22, 0.11);
  }

  playOrderPop() {
    this.init();
    this._playTone(523.25, 0.08, 'sine', 0.2, 0);
    this._playTone(659.25, 0.12, 'sine', 0.2, 0.06);
  }

  playIngredientDrop() {
    this.init();
    this._playTone(420, 0.09, 'sine', 0.22, 0);
    this._playTone(600, 0.08, 'triangle', 0.18, 0.04);
  }

  playEggCrack() {
    this.init();
    // Crisp shell crack followed by soft drop
    this._playTone(1350, 0.035, 'square', 0.14, 0);
    this._playTone(980, 0.04, 'triangle', 0.16, 0.035);
    this._playTone(320, 0.12, 'sine', 0.18, 0.18);
    this._playTone(460, 0.09, 'sine', 0.14, 0.24);
  }

  playPourPowder() {
    this.init();
    if (!this.enabled || !this.ctx || this.volume <= 0) return;
    // Soft filtered noise burst simulating pouring flour/sugar
    const dur = 0.36;
    const bufSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufSize) * Math.PI);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1400;
    filter.Q.value = 0.9;
    const gain = this.ctx.createGain();
    gain.gain.value = Math.max(0.001, this.volume * 0.16);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    src.start();
  }

  playPourLiquid() {
    this.init();
    [340, 410, 490, 560].forEach((f, idx) => {
      this._playTone(f, 0.09, 'sine', 0.14, idx * 0.07);
    });
  }

  playButterDrop() {
    this.init();
    this._playTone(210, 0.09, 'sine', 0.22, 0.16);
    this._playTone(280, 0.07, 'sine', 0.14, 0.27);
  }

  playWhisk() {
    this.init();
    this._playTone(280 + Math.random() * 110, 0.08, 'triangle', 0.11, 0);
  }

  playOvenTick() {
    this.init();
    this._playTone(220, 0.05, 'sine', 0.08, 0);
  }

  playOvenDing() {
    this.init();
    this._playTone(1046.5, 0.25, 'triangle', 0.28, 0);
    this._playTone(1318.5, 0.35, 'triangle', 0.25, 0.12);
  }

  playFrosting() {
    this.init();
    this._playTone(540, 0.1, 'sine', 0.18, 0);
    this._playTone(720, 0.12, 'sine', 0.16, 0.05);
  }

  playToppingPop() {
    this.init();
    this._playTone(660 + Math.random() * 140, 0.08, 'sine', 0.2, 0);
  }

  playBoxClose() {
    this.init();
    this._playTone(392, 0.09, 'triangle', 0.2, 0);
    this._playTone(523.25, 0.14, 'triangle', 0.22, 0.08);
  }

  playCoins() {
    this.init();
    this._playTone(987.77, 0.09, 'sine', 0.22, 0);
    this._playTone(1318.51, 0.22, 'sine', 0.25, 0.08);
  }

  playSuccess() {
    this.init();
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      this._playTone(f, 0.22, 'triangle', 0.22, i * 0.08);
    });
  }

  playError() {
    this.init();
    this._playTone(240, 0.14, 'sawtooth', 0.15, 0);
    this._playTone(185, 0.2, 'sawtooth', 0.15, 0.1);
  }

  playClick() {
    this.init();
    this._playTone(620, 0.04, 'sine', 0.12, 0);
  }

  startBGM() {
    if (this.bgmTimer || !this.enabled || !this.musicEnabled) return;
    // Gentle C-major pentatonic bakery music box melody
    const melody = [523.25, 659.25, 783.99, 659.25, 880, 783.99, 659.25, 587.33, 523.25, 587.33, 659.25, 783.99, 659.25, 523.25, 587.33, 523.25];
    this.bgmTimer = setInterval(() => {
      if (!this.enabled || !this.musicEnabled || !this.ctx || this.ctx.state !== 'running') return;
      const freq = melody[this.noteIdx % melody.length];
      this._playTone(freq, 0.38, 'sine', 0.055, 0);
      this.noteIdx++;
    }, 620);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
};

