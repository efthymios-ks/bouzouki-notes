import { LitElement, html } from "../../../Libraries/lit/lit.min.js";
import { Chord } from "../../Chords/Backend/Chord.js";
import { Note } from "../../Notes/Backend/Note.js";
import { Makam } from "../../Makams/Backend/Makam.js";
import { Interval } from "../../Intervals/Backend/Interval.js";
import "./FretboardVisualizer.js";

export class BouzoukiFretboardPage extends LitElement {
  static properties = {
    selectedChordLayout: { type: String },
    selectedBaseNote: { type: String },
    selectedItemKey: { type: String },
    selectedItemType: { type: String },
  };

  static #typeEnum = Object.freeze({
    MAKAM: "Makam",
    CHORD: "Chord",
  });

  static #predefinedChordLayouts = Object.freeze(["D-A-F-C", "D-A-D"]);

  static #allMakams = Object.freeze(
    Makam.getAll().flatMap((makam) =>
      makam.allVariants
        .filter((variant) => variant.isMain)
        .map((variant) => ({
          key: `${makam.id}_${variant.id}`,
          name: variant.name === makam.name ? makam.name : `${makam.name} - ${variant.name}`,
          makam: makam,
          variant: variant,
        }))
    )
  );

  static #allChords = Object.freeze(
    Chord.getAll().map((chord) => ({
      key: chord.key,
      name: chord.name,
    }))
  );

  #selectednotes = [];
  #selectedIntervals = [];
  #selectFretFunction = (stringNumber, stringNote, fretNumber, fretNote) => {
    return this.#selectednotes.some((note) => note === fretNote);
  };

  constructor() {
    super();
    this.selectedChordLayout = BouzoukiFretboardPage.#predefinedChordLayouts[0];
    this.selectedBaseNote = "D";
    this.selectedItemKey = BouzoukiFretboardPage.#allMakams[0].key;
    this.selectedItemType = BouzoukiFretboardPage.#typeEnum.MAKAM;

    this.onSelectionChanged();
  }

  createRenderRoot() {
    return this;
  }

  onInputChange(event) {
    this.selectedChordLayout = event.target.value;
  }

  onSelectLayout(layout, event) {
    event.preventDefault();
    this.selectedChordLayout = layout;
  }

  onBaseNoteChange(event) {
    this.selectedBaseNote = event.target.value;
    this.onSelectionChanged();
  }

  onItemSelectionChange(event) {
    const selectedOption = event.target.selectedOptions[0];
    this.selectedItemKey = selectedOption.value;
    this.selectedItemType = selectedOption.getAttribute("type");
    this.onSelectionChanged();
  }

  onSelectionChanged() {
    if (this.selectedItemType === BouzoukiFretboardPage.#typeEnum.CHORD) {
      const chord = `${this.selectedBaseNote}${this.selectedItemKey}`;
      this.#selectednotes = Chord.getNotes(chord);
      this.#selectedIntervals = [];
      return;
    }

    if (this.selectedItemType === BouzoukiFretboardPage.#typeEnum.MAKAM) {
      const makamItem = BouzoukiFretboardPage.#allMakams.find(
        (m) => m.key === this.selectedItemKey
      );
      if (!makamItem) {
        this.#selectednotes = [];
        this.#selectedIntervals = [];
        return;
      }

      // Get notes based on the selected base note using intervals
      const intervals = makamItem.variant.intervals;
      this.#selectednotes = Note.intervalsToNormalizedNotes(this.selectedBaseNote, intervals);
      this.#selectedIntervals = intervals.map((i) => Interval.getName(i));
      return;
    }

    throw new Error(`Unsupported item type: ${this.selectedItemType}`);
  }

  controlsHtml() {
    const chords = BouzoukiFretboardPage.#allChords.map((chord) => ({
      type: BouzoukiFretboardPage.#typeEnum.CHORD,
      key: chord.key,
      name: `Συγχορδία ${chord.name}`,
    }));

    const makams = BouzoukiFretboardPage.#allMakams.map((makam) => ({
      type: BouzoukiFretboardPage.#typeEnum.MAKAM,
      key: makam.key,
      name: `Μακάμ ${makam.name}`,
    }));

    const notesOptions = [...chords, ...makams].map(
      (item) =>
        html`<option
          value="${item.key}"
          type="${item.type}"
          ?selected=${item.key === this.selectedItemKey && item.type === this.selectedItemType}
        >
          ${item.name}
        </option>`
    );

    return html`
      <div class="controls-container d-flex flex-wrap align-items-center gap-3 mb-3">
        <div class="chord-layout-input-container d-flex align-items-center gap-2">
          <label for="chord-layout-input" class="form-label small fw-bold mb-0">Κούρδισμα:</label>
          <div class="input-group input-group-sm flex-grow-1">
            <input
              type="text"
              id="chord-layout-input"
              class="form-control"
              placeholder="π.χ. D-A-F-C"
              .value=${this.selectedChordLayout}
              @input=${this.onInputChange}
            />
            <button
              class="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style="font-size: 0.85rem;"
            ></button>
            <ul class="dropdown-menu dropdown-menu-end">
              ${BouzoukiFretboardPage.#predefinedChordLayouts.map(
                (layout) => html`
                  <li>
                    <a
                      href="#"
                      class="dropdown-item small"
                      @click=${(e) => this.onSelectLayout(layout, e)}
                      >${layout}</a
                    >
                  </li>
                `
              )}
            </ul>
          </div>
        </div>

        <div class="note-sequence-input-container d-flex align-items-center gap-2">
          <label for="note-sequence-dropdown" class="form-label small fw-bold mb-0">Νότες:</label>
          <select
            id="note-sequence-dropdown"
            class="form-select form-select-sm"
            @change=${this.onItemSelectionChange}
          >
            ${notesOptions}
          </select>
        </div>

        <div class="base-note-input-container d-flex align-items-center gap-2">
          <label for="base-note-dropdown" class="form-label small fw-bold mb-0">Τονική:</label>
          <select
            id="base-note-dropdown"
            class="form-select form-select-sm"
            @change=${this.onBaseNoteChange}
          >
            ${Note.sharpNotes.map(
              (note) => html`
                <option value="${note}" ?selected=${note === this.selectedBaseNote}>
                  ${Note.toPrintableString(note)}
                </option>
              `
            )}
          </select>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="fretboard-container">
        ${this.controlsHtml()}

        <div class="notes-intervals-display mb-3 p-3 bg-light border rounded">
          <div class="row">
            <div class="col-md-6 mb-2 mb-md-0">
              <strong class="small">Νότες:</strong>
              <span class="ms-2">
                ${this.#selectednotes.length > 0
                  ? this.#selectednotes.map((note) => Note.toPrintableString(note)).join(", ")
                  : "—"}
              </span>
            </div>
            ${this.#selectedIntervals.length > 0
              ? html`
                  <div class="col-md-6">
                    <strong class="small">Διαστήματα:</strong>
                    <span class="ms-2">${this.#selectedIntervals.join("-")}</span>
                  </div>
                `
              : ""}
          </div>
        </div>

        <div class="overflow-x-auto">
          <fretboard-visualizer
            .selectFretFunction=${this.#selectFretFunction}
            .chordLayout=${this.selectedChordLayout.split("-")}
          ></fretboard-visualizer>
        </div>
      </div>
    `;
  }
}

customElements.define("bouzouki-fretboard-page", BouzoukiFretboardPage);
