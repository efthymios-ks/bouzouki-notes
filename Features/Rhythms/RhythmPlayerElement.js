import { LitElement, html } from "../../Libraries/lit/lit.min.js";

export class RhythmPlayerElement extends LitElement {
  static properties = {
    bpm: { type: Number },
    running: { type: Boolean, state: true },
    rhythm: { type: Array },
    selectedIndex: { type: Number },
  };

  bpm = 85;
  running = false;

  static #minBpm = 30;
  static #maxBpm = 1000;
  static #volumegain = 0.8;

  #audioContext = new window.AudioContext();
  #loopTimeouts = [];

  // Quote = Bass
  rhythmOptions = [
    { label: "Χασάπικο 2/4", value: "8 8' 8 8'" },
    { label: "Βαλς 3/4", value: "4 4' 4'" },
    { label: "Τσιφτετέλι 4/4", value: "8 4' 8' 4 4'" },
    { label: "Μπαγιόν 4/4", value: "4 8' 8' 4 4'" },
    { label: "Καλαματιανός 7/8", value: "8 8' 8' 8 8' 8 8'" },
    { label: "Μαντηλάτος 7/8", value: "8 8' 8 8' 8 8' 8'" },

    { label: "Πεντάρι 3+2 (5/8)", value: "8 8' 8' 8 8'" },
    { label: "Πεντάρι 2+3 (5/8)", value: "8 8' 8 8' 8'" },
    { label: "Εξάρι (6/8)", value: "8 8' 8' 8 8' 8'" },
    { label: "Επτάρι 3+2+2 (7/8)", value: "8 8' 8' 8 8' 8 8'" },
    { label: "Επτάρι 2+2+3 (7/8)", value: "8 8' 8 8' 8 8' 8'" },

    { label: "Καρσιλαμάς 1 (9/8)", value: "4 8' 8' 4 8' 8' 8'" },
    { label: "Καρσιλαμάς 2 (9/8)", value: "8 8' 8 8' 8 8' 8 8' 8'" },

    { label: "Νέο Ζεϊμπέκικο 9/8", value: "8 4' 8' 4 4' 8 4' 8' 4 4' 4'" },
    { label: "Παλιό Ζεϊμπέκικο 9/8", value: "4 8' 8' 4 4' 4 8' 8' 4 4' 4'" },
    { label: "Νέο Απτάλικο 9/8", value: "4 4' 4' 8 4' 8' 4 4' 8 4' 8'" },
    { label: "Παλιό Απτάλικο 9/8", value: "4 4' 4' 4 8' 8' 4 4' 4 8' 8'" },
  ];

  selectedIndex = 0;
  rhythm = [];

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="d-flex flex-column align-items-center justify-content-center gap-3">
        <div
          id="controls-container"
          class="d-flex flex-column justify-content-center align-items-center gap-2"
        >
          <div
            id="bpm-container"
            class="d-flex flex-column align-items-center justify-content-center"
          >
            <label for="bpm-input" class="form-label fw-bold">BPM</label>

            <div class="d-flex justify-content-center align-items-center gap-2">
              <button class="btn btn-outline-secondary" @click="${() => this.#adjustBpm(-5)}">
                −5
              </button>

              <input
                id="bpm-input"
                type="number"
                min="${RhythmPlayerElement.#minBpm}"
                max="${RhythmPlayerElement.#maxBpm}"
                class="form-control text-center"
                .value="${this.bpm}"
                @blur="${this.#onBpmInput}"
              />

              <button class="btn btn-outline-secondary" @click="${() => this.#adjustBpm(5)}">
                +5
              </button>
            </div>
          </div>

          <div
            id="rhythm-container"
            class="d-flex flex-column align-items-center justify-content-center"
          >
            <label for="rhythm-select" class="form-label fw-bold">Ρυθμός</label>

            <select
              id="rhythm-select"
              class="form-select mb-3"
              @change="${this.#onRhythmChange}"
              .value="${this.selectedIndex}"
            >
              ${this.rhythmOptions.map(
                (opt, idx) => html`<option value="${idx}">${opt.label}</option>`
              )}
            </select>
          </div>

          <div>
            <button id="toggle-btn" class="btn btn-primary" @click="${this.#toggleStartStop}">
              ${this.running ? "Διακοπή" : "Έναρξη"}
            </button>
          </div>
        </div>

        <div id="visualizer" class="d-flex flex-wrap gap-2 justify-content-center">
          ${this.rhythm.map((note, index) => {
            const isRest = note.startsWith("R");
            const altAccent = note.endsWith("'");
            const borderClass = isRest
              ? "border-danger"
              : altAccent
              ? "border-secondary"
              : "border-primary";

            return html`
              <div
                id="note-${index}"
                class="card border-2 text-center ${borderClass}"
                style="width: 3.5rem; user-select: none; cursor: default;"
              >
                <div class="card-body p-2 m-0">${note.replace("'", "")}</div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  firstUpdated() {
    this.#setRhythmByIndex(this.selectedIndex);
  }

  stop() {
    this.#stopRhythm();
    this.requestUpdate();
  }

  #onBpmInput(event) {
    const value = Math.max(
      RhythmPlayerElement.#minBpm,
      Math.min(
        RhythmPlayerElement.#maxBpm,
        parseInt(event.target.value, 10) || RhythmPlayerElement.#minBpm
      )
    );
    this.bpm = value;
    this.requestUpdate();
  }

  #adjustBpm(delta) {
    this.bpm = Math.max(
      RhythmPlayerElement.#minBpm,
      Math.min(RhythmPlayerElement.#maxBpm, this.bpm + delta)
    );
    this.#resetRhythm();
    this.requestUpdate();
  }

  #onRhythmChange(event) {
    const index = parseInt(event.target.value, 10);
    this.#setRhythmByIndex(index);
  }

  #setRhythmByIndex(index) {
    this.selectedIndex = index;
    this.rhythm = this.rhythmOptions[index]?.value.split(" ") ?? [];
    this.#resetRhythm();
    this.requestUpdate();
  }

  #toggleStartStop() {
    if (this.running) {
      this.#stopRhythm();
    } else {
      this.#audioContext.resume().then(() => this.#startRhythm());
    }
    this.requestUpdate();
  }

  #startRhythm() {
    if (!this.rhythm.length) return;
    this.running = true;
    this.#playLoop();
  }

  #stopRhythm() {
    this.running = false;
    this.#loopTimeouts.forEach(clearTimeout);
    this.#loopTimeouts = [];
    this.#clearHighlights();
  }

  #resetRhythm() {
    const wasRunning = this.running;
    this.#stopRhythm();
    if (wasRunning) this.#startRhythm();
  }

  #clearHighlights() {
    this.rhythm.forEach((note, index) => {
      const noteElement = this.renderRoot.querySelector(`#note-${index}`);
      if (noteElement) {
        noteElement.classList.remove("bg-primary", "bg-secondary", "bg-danger", "text-white");
        noteElement.classList.remove("border-primary", "border-secondary", "border-danger");
        const isRest = note.startsWith("R");
        const altAccent = note.endsWith("'");

        if (isRest) {
          noteElement.classList.add("border-danger");
        } else if (altAccent) {
          noteElement.classList.add("border-secondary");
        } else {
          noteElement.classList.add("border-primary");
        }
      }
    });
  }

  #playLoop() {
    if (!this.rhythm.length) {
      return;
    }

    const beatDurationMs = 60000 / this.bpm;
    let totalTime = 0;

    this.#clearHighlights();
    this.#loopTimeouts.forEach(clearTimeout);
    this.#loopTimeouts = [];

    this.rhythm.forEach((note, index) => {
      const isRest = note.startsWith("R");
      const altAccent = note.endsWith("'");
      const base = note.replace(/[^0-9]/g, "");
      const durationInBeats = 4 / parseInt(base);

      const timeout = setTimeout(() => {
        this.#clearHighlights();

        const noteElement = this.renderRoot.querySelector(`#note-${index}`);
        if (noteElement) {
          noteElement.classList.remove(
            "bg-primary",
            "bg-secondary",
            "bg-danger",
            "text-white",
            "border-primary",
            "border-secondary",
            "border-danger"
          );

          if (isRest) {
            noteElement.classList.add("bg-danger", "text-white", "border-danger");
          } else if (altAccent) {
            noteElement.classList.add("bg-secondary", "text-white", "border-secondary");
          } else {
            noteElement.classList.add("bg-primary", "text-white", "border-primary");
          }
        }

        if (!isRest) {
          this.#playBeep(!altAccent);
        }
      }, totalTime);

      this.#loopTimeouts.push(timeout);
      totalTime += durationInBeats * beatDurationMs;
    });

    const loopEndTimeout = setTimeout(() => {
      this.#clearHighlights();
      if (this.running) {
        this.#playLoop();
      }
    }, totalTime);

    this.#loopTimeouts.push(loopEndTimeout);
  }

  #playBeep(accent = false) {
    const oscillator = this.#audioContext.createOscillator();
    const gain = this.#audioContext.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = accent ? 800 : 1200;
    gain.gain.setValueAtTime(RhythmPlayerElement.#volumegain, this.#audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.#audioContext.currentTime + 0.1);
    oscillator.connect(gain).connect(this.#audioContext.destination);
    oscillator.start();
    oscillator.stop(this.#audioContext.currentTime + 0.1);
  }
}

customElements.define("rhythm-player-element", RhythmPlayerElement);
