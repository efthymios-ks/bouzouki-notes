import { LitElement, html } from "../../Libraries/lit/lit.min.js";

export class MetronomeElement extends LitElement {
  static properties = {};

  #bpm = 100;
  #minBpm = 1;
  #maxBpm = 320;
  #intervalId = null;
  #currentBeat = 0;
  #subdivision = 1;
  #timeSignature = "4/4";

  #audioContext = new (window.AudioContext || window.webkitAudioContext)();

  #bpmSteps = [1, 5];
  #timeSignatureOptions = [
    { label: "1/4", value: "1/4", states: ["2"] },
    { label: "2/4", value: "2/4", states: ["2", "1"] },
    { label: "3/4", value: "3/4", states: ["2", "1", "1"] },
    { label: "4/4", value: "4/4", states: ["2", "1", "1", "1"] },
    { label: "5/4", value: "5/4", states: ["2", "1", "1", "1", "1"] },
    { label: "6/4", value: "6/4", states: ["2", "1", "1", "1", "1", "1"] },
    { label: "3/8", value: "3/8", states: ["2", "1", "1"] },
    { label: "5/8", value: "5/8", states: ["2", "1", "1", "1", "1"] },
    { label: "6/8", value: "6/8", states: ["2", "1", "1", "1", "1", "1"] },
    { label: "7/8", value: "7/8", states: ["2", "1", "1", "1", "1", "1", "1"] },
    { label: "9/8", value: "9/8", states: ["2", "1", "1", "1", "1", "1", "1", "1", "1"] },
    {
      label: "12/8",
      value: "12/8",
      states: ["2", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
    },
  ];

  #subdivisionOptions = [
    { icon: "1/8", value: 1 },
    { icon: "1/16", value: 2 },
    { icon: "1/32", value: 3 },
    { icon: "1/64", value: 4 },
    { icon: "1/128", value: 5 },
  ];

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("navSectionChanged", this.#onNavSectionChanged);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("navSectionChanged", this.#onNavSectionChanged);
  }

  updated(changedProps) {
    super.updated?.(changedProps);
    this.#renderBars();
  }

  render() {
    return html`
      <div class="container text-center">
        <div class="d-flex justify-content-center align-items-center mb-4">
          <div
            id="visual"
            class="d-flex flex-wrap justify-content-center gap-2 w-100"
            style="min-height: auto;"
          ></div>
        </div>

        <div class="mb-3">
          <div class="d-flex justify-content-center align-items-center gap-2 mb-2 flex-nowrap">
            <div class="btn-group">
              ${[...this.#bpmSteps]
                .sort((a, b) => b - a)
                .map(
                  (step) =>
                    html`<button
                      class="btn btn-outline-secondary"
                      @click=${() => this.#adjustBpm(-step)}
                    >
                      −${step}
                    </button>`
                )}
            </div>

            <input
              type="number"
              class="form-control text-center"
              style="width: 6rem; min-width: 4rem;"
              .value=${this.#bpm}
              min=${this.#minBpm}
              max=${this.#maxBpm}
              @input=${this.#onBpmInput}
            />

            <div class="btn-group">
              ${[...this.#bpmSteps]
                .sort((a, b) => a - b)
                .map(
                  (step) =>
                    html`<button
                      class="btn btn-outline-secondary"
                      @click=${() => this.#adjustBpm(step)}
                    >
                      +${step}
                    </button>`
                )}
            </div>
          </div>

          <input
            type="range"
            class="form-range"
            min=${this.#minBpm}
            max=${this.#maxBpm}
            .value=${this.#bpm}
            @input=${this.#onBpmSliderInput}
          />
        </div>

        <div>
          <label class="form-label fw-bold">Μέτρο</label>
          <div class="d-flex flex-wrap gap-2 justify-content-center mb-3">
            ${this.#timeSignatureOptions.map(
              (ts) => html`
                <button
                  class="btn btn-outline-secondary tile ${ts.value === this.#timeSignature
                    ? "active"
                    : ""}"
                  @click=${() => this.#setTimeSignature(ts.value)}
                >
                  ${ts.label}
                </button>
              `
            )}
          </div>
        </div>

        <div>
          <label class="form-label fw-bold">Υποδιαίρεση</label>
          <div class="d-flex flex-wrap gap-2 justify-content-center">
            ${this.#subdivisionOptions.map(
              (opt) => html`
                <button
                  class="btn btn-outline-secondary tile ${opt.value === this.#subdivision
                    ? "active"
                    : ""}"
                  @click=${() => this.#setSubdivision(opt.value)}
                >
                  ${opt.icon}
                </button>
              `
            )}
          </div>
        </div>

        <button class="btn btn-primary my-4" @click=${this.#toggleStartStop}>
          ${this.#intervalId ? "Διακοπή" : "Έναρξη"}
        </button>
      </div>
    `;
  }

  #onNavSectionChanged = (event) => {
    const isVisible = event.detail === this.id || this.closest(`#${event.detail}`) !== null;
    if (!isVisible && this.#intervalId) {
      this.#stopMetronome();
      this.requestUpdate();
    }
  };

  #onBpmInput(e) {
    const value = parseInt(e.target.value, 10) || this.#minBpm;
    this.#bpm = Math.max(this.#minBpm, Math.min(this.#maxBpm, value));
    this.requestUpdate();
    this.#resetMetronome();
  }

  #onBpmSliderInput(e) {
    this.#bpm = parseInt(e.target.value, 10);
    this.requestUpdate();
    this.#resetMetronome();
  }

  #adjustBpm(delta) {
    this.#bpm = Math.max(this.#minBpm, Math.min(this.#maxBpm, this.#bpm + delta));
    this.requestUpdate();
    this.#resetMetronome();
  }

  #setTimeSignature(value) {
    this.#timeSignature = value;
    this.requestUpdate();
    this.#resetMetronome();
  }

  #setSubdivision(value) {
    this.#subdivision = value;
    this.requestUpdate();
    this.#resetMetronome();
  }

  #toggleStartStop() {
    if (this.#intervalId) {
      this.#stopMetronome();
    } else {
      this.#audioContext.resume().then(() => {
        this.#startMetronome();
      });
    }
  }

  #startMetronome() {
    const intervalMs = (60 * 1000) / (this.#bpm * this.#subdivision);
    this.#currentBeat = 0;
    this.#intervalId = setInterval(() => this.#tick(), intervalMs);
    this.requestUpdate();
  }

  #stopMetronome() {
    clearInterval(this.#intervalId);
    this.#intervalId = null;
    this.#updateActiveBar(-1);
    this.requestUpdate();
  }

  #resetMetronome() {
    const playing = !!this.#intervalId;
    this.#stopMetronome();
    this.#renderBars();
    if (playing) {
      this.#audioContext.resume().then(() => {
        this.#startMetronome();
      });
    }
  }

  #tick() {
    const [beatsPerMeasure] = this.#timeSignature.split("/").map(Number);
    const totalSubBeats = beatsPerMeasure * this.#subdivision;

    const activeIndex = Math.floor(this.#currentBeat / this.#subdivision);
    const isDownbeat = this.#currentBeat % this.#subdivision === 0;

    const visual = this.querySelector("#visual");
    const activeBar = visual?.children[activeIndex];
    const state = activeBar?.dataset.state || "1";

    this.#playBeep(isDownbeat, state);
    this.#updateActiveBar(activeIndex);

    this.#currentBeat = (this.#currentBeat + 1) % totalSubBeats;
  }

  #playBeep(isDownbeat, state) {
    const oscillator = this.#audioContext.createOscillator();
    const gain = this.#audioContext.createGain();

    if (state === "2" && isDownbeat) {
      oscillator.frequency.value = 660; // higher beep only on first beat of state 2
    } else if (state === "2") {
      oscillator.frequency.value = 440; // normal beep for other beats in state 2
    } else {
      oscillator.frequency.value = 440; // normal beep for state 1
    }

    gain.gain.value = 0.2;
    oscillator.connect(gain);
    gain.connect(this.#audioContext.destination);
    oscillator.start();
    oscillator.stop(this.#audioContext.currentTime + 0.05);
  }

  #renderBars() {
    const beatsPerMeasure = Number(this.#timeSignature.split("/")[0]);
    const tsObj = this.#timeSignatureOptions.find((ts) => ts.value === this.#timeSignature);
    const states = tsObj?.states || [];

    const visual = this.querySelector("#visual");
    if (!visual) {
      return;
    }

    visual.innerHTML = "";
    for (let i = 0; i < beatsPerMeasure; i++) {
      const bar = document.createElement("div");
      bar.className =
        "bg-secondary rounded d-flex align-items-center justify-content-center text-center text-white fs-1";
      bar.dataset.index = i;
      bar.dataset.state = states[i] || "1";
      bar.style.width = "3rem";
      bar.style.minHeight = "10rem";
      bar.style.transition = "background-color 0.1s";
      bar.style.cursor = "pointer";
      bar.textContent = bar.dataset.state;

      bar.addEventListener("click", () => {
        bar.dataset.state = bar.dataset.state === "1" ? "2" : "1";
        bar.textContent = bar.dataset.state;
      });

      visual.appendChild(bar);
    }
  }

  #updateActiveBar(activeIndex) {
    const visual = this.querySelector("#visual");
    if (!visual) {
      return;
    }

    [...visual.children].forEach((bar, i) => {
      bar.classList.toggle("bg-danger", i === activeIndex);
      bar.classList.toggle("bg-secondary", i !== activeIndex);
      bar.textContent = bar.dataset.state;
    });
  }
}

customElements.define("metronome-element", MetronomeElement);
