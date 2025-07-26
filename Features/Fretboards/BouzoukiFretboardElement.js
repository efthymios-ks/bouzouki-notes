import { LitElement, html } from "../../Libraries/lit/lit.min.js";
import { Chord } from "../Chords/Chord.js";
import { Note } from "../Notes/Note.js";
import { Scale } from "../Scales/Scale.js";
import "./FretboardElement.js";

export class BouzoukiFretboardElement extends LitElement {
  static properties = {
    selectedChordLayout: { type: String },
    selectedBaseNote: { type: String },
    selectedItemKey: { type: String },
    selectedItemType: { type: String },
  };

  static #typeEnum = Object.freeze({
    SCALE: "Scale",
    CHORD: "Chord",
  });

  static #predefinedChordLayouts = Object.freeze(["D-A-F-C", "D-A-D"]);

  static #allScales = Object.freeze(
    Scale.getAll("D").flatMap((scale) =>
      scale.variants.map((scaleVariant, scaleVariantIndex) => ({
        key: BouzoukiFretboardElement.serializeScaleKey(scale.id, scaleVariantIndex),
        name:
          scale.name === scaleVariant.name ? scale.name : `${scale.name} - ${scaleVariant.name}`,
        notes: scaleVariant.notes,
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
  #selectFretFunction = (stringNumber, stringNote, fretNumber, fretNote) => {
    return this.#selectednotes.some((note) => note === fretNote);
  };

  constructor() {
    super();
    this.selectedChordLayout = BouzoukiFretboardElement.#predefinedChordLayouts[0];
    this.selectedBaseNote = "D";
    this.selectedItemKey = BouzoukiFretboardElement.#allScales[0].key;
    this.selectedItemType = BouzoukiFretboardElement.#typeEnum.SCALE;

    this.onSelectionChanged();
  }

  createRenderRoot() {
    return this;
  }

  static serializeScaleKey(scaleId, scaleVariantIndex) {
    return `${scaleId}_${scaleVariantIndex}`;
  }

  static deserializeScaleKey(scaleKey) {
    const [scaleId, scaleVariantIndex] = scaleKey.split("_");
    return {
      scaleId,
      scaleVariantIndex: parseInt(scaleVariantIndex, 10),
    };
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
    if (this.selectedItemType === BouzoukiFretboardElement.#typeEnum.CHORD) {
      const chord = `${this.selectedBaseNote}${this.selectedItemKey}`;
      this.#selectednotes = Chord.getNotes(chord);
      return;
    }

    if (this.selectedItemType === BouzoukiFretboardElement.#typeEnum.SCALE) {
      const { scaleId, scaleVariantIndex } = BouzoukiFretboardElement.deserializeScaleKey(
        this.selectedItemKey
      );

      const scale = Scale.getAll(this.selectedBaseNote).find((scale) => scale.id === scaleId);
      if (!scale) {
        this.#selectednotes = [];
        return;
      }

      const scaleVariant = scale.variants[scaleVariantIndex];
      if (!scaleVariant) {
        this.#selectednotes = [];
        return;
      }

      this.#selectednotes = scaleVariant.notes;
      return;
    }

    throw new Error(`Unsupported item type: ${this.selectedItemType}`);
  }

  controlsHtml() {
    const chords = BouzoukiFretboardElement.#allChords.map((chord) => ({
      type: BouzoukiFretboardElement.#typeEnum.CHORD,
      key: chord.key,
      name: `Συγχορδία ${chord.name}`,
    }));

    const scales = BouzoukiFretboardElement.#allScales.map((variant) => ({
      type: BouzoukiFretboardElement.#typeEnum.SCALE,
      key: variant.key,
      name: `Δρόμος ${variant.name}`,
    }));

    const notesOptions = [...chords, ...scales].map(
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
              ${BouzoukiFretboardElement.#predefinedChordLayouts.map(
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

        <div class="overflow-x-auto">
          <fretboard-element
            .selectFretFunction=${this.#selectFretFunction}
            .chordLayout=${this.selectedChordLayout.split("-")}
          ></fretboard-element>
        </div>
      </div>
    `;
  }
}

customElements.define("bouzouki-fretboard-element", BouzoukiFretboardElement);
