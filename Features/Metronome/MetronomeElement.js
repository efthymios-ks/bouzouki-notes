import { LitElement, html } from "../../Libraries/lit/lit.min.js";

export class MetronomeElement extends LitElement {
  static properties = {
    bpm: { type: Number },
    running: { type: Boolean, state: true },
  };

  bpm = 80;
  running = false;

  static #minBpm = 30;
  static #maxBpm = 1000;
  static #volumegain = 0.8;

  #audioContext = new window.AudioContext();
  #startTime = 0;
  #lastBeepSide = null;
  #requestId = null;

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="d-flex flex-column align-items-center justify-content-center gap-3">
        <div
          id="stick"
          class="bg-primary mx-auto"
          style="width: 0.25rem; height: 12.5rem; position: relative; transform-origin: bottom center;"
        >
          <div
            id="ball"
            class="bg-primary rounded-circle position-absolute"
            style="width: 1.25rem; height: 1.25rem; top: -0.625rem; left: 50%; transform: translateX(-50%);"
          ></div>
        </div>

        <div
          id="metronome-controls-container"
          class="d-flex flex-column justify-content-center align-items-center gap-2"
        >
          <div
            id="metronome-bpm-container"
            class="d-flex flex-column align-items-center justify-content-center"
          >
            <label for="metronome-bpm-input" class="form-label fw-bold">BPM</label>

            <div class="d-flex justify-content-center align-items-center gap-2">
              <button class="btn btn-outline-secondary" @click="${() => this.#adjustBpm(-5)}">
                −5
              </button>

              <input
                id="metronome-bpm-input"
                type="number"
                min="${MetronomeElement.#minBpm}"
                max="${MetronomeElement.#maxBpm}"
                class="form-control text-center"
                .value="${this.bpm}"
                @input="${this.#onBpmInput}"
              />

              <button class="btn btn-outline-secondary" @click="${() => this.#adjustBpm(5)}">
                +5
              </button>
            </div>
          </div>

          <div>
            <button
              id="metronome-toggle-btn"
              class="btn btn-primary"
              @click="${this.#toggleStartStop}"
            >
              ${this.running ? "Διακοπή" : "Έναρξη"}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  stop() {
    if (this.running) {
      this.#stopMetronome();
      this.requestUpdate();
    }
  }

  #onBpmInput(event) {
    const value = Math.max(
      MetronomeElement.#minBpm,
      Math.min(
        MetronomeElement.#maxBpm,
        parseInt(event.target.value, 10) || MetronomeElement.#minBpm
      )
    );
    this.bpm = value;
    this.#resetMetronome();
    this.requestUpdate();
  }

  #adjustBpm(delta) {
    this.bpm = Math.max(
      MetronomeElement.#minBpm,
      Math.min(MetronomeElement.#maxBpm, this.bpm + delta)
    );
    this.#resetMetronome();
    this.requestUpdate();
  }

  #toggleStartStop() {
    if (this.running) {
      this.#stopMetronome();
      this.requestUpdate();
    } else {
      this.#audioContext.resume().then(() => {
        this.#startMetronome();
        this.requestUpdate();
      });
    }
  }

  #startMetronome() {
    this.running = true;
    this.#startTime = performance.now();
    this.#requestId = requestAnimationFrame(this.#animate.bind(this));
  }

  #stopMetronome() {
    this.running = false;
    cancelAnimationFrame(this.#requestId);
    const stick = document.getElementById("stick");
    stick.style.transform = "rotate(0deg)";
    this.#lastBeepSide = null;
  }

  #resetMetronome() {
    const wasRunning = this.running;
    this.#stopMetronome();
    if (wasRunning) {
      this.#startMetronome();
    }
  }

  #animate(now) {
    if (!this.running) {
      return;
    }

    const stick = document.getElementById("stick");
    const beatDuration = 60000 / this.bpm;
    const swingDuration = beatDuration * 2;
    const elapsed = now - this.#startTime;
    const t = (elapsed % swingDuration) / swingDuration;
    const angle = Math.sin(t * 2 * Math.PI) * 25;
    if (stick) stick.style.transform = `rotate(${angle}deg)`;

    const side = angle > 24 ? "right" : angle < -24 ? "left" : null;
    if (side && side !== this.#lastBeepSide) {
      this.#playBeep();
      this.#lastBeepSide = side;
    }
    if (!side) {
      this.#lastBeepSide = null;
    }

    this.#requestId = requestAnimationFrame(this.#animate.bind(this));
  }

  #playBeep() {
    const oscillator = this.#audioContext.createOscillator();
    const gain = this.#audioContext.createGain();
    oscillator.frequency.value = 880;
    gain.gain.value = MetronomeElement.#volumegain;
    oscillator.connect(gain);
    gain.connect(this.#audioContext.destination);
    oscillator.start();
    oscillator.stop(this.#audioContext.currentTime + 0.05);
  }
}

customElements.define("metronome-element", MetronomeElement);
