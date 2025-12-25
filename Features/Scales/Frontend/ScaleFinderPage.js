import { LitElement, html } from "../../../Libraries/lit/lit.min.js";
import { Note } from "../../Notes/Backend/Note.js";
import { Scale } from "../Backend/Scale.js";
import "./ScaleCards.js";

export class ScaleFinderPage extends LitElement {
  static properties = {};

  #selectedNotes;
  #foundScales;

  constructor() {
    super();
    this.#selectedNotes = [];
    this.#foundScales = [];
  }

  createRenderRoot() {
    return this;
  }

  render() {
    const selectedCount = this.#selectedNotes.length;
    const selectionClass = selectedCount === 7 ? "bg-success" : "bg-danger";

    const notesHtml = Note.sharpNotes.map((noteKey) => {
      const note = new Note(noteKey);
      const isActive = this.#selectedNotes.includes(noteKey);
      const isActiveClasses = isActive ? "active btn-primary" : "btn-outline-primary";

      return html`
        <button
          type="button"
          class="scale-finder-note btn d-flex flex-column align-items-center ${isActiveClasses}"
          @click=${() => this.#toggleNoteSelection(noteKey)}
        >
          ${note.toPrintableString()}
        </button>
      `;
    });

    return html`
      <div class="d-flex flex-wrap justify-content-center align-items-center gap-3 mb-3">
        <div class="badge text-white fw-semibold rounded px-2 py-1 ${selectionClass}">
          ${selectedCount}/7
        </div>

        <button
          class="btn btn-sm btn-outline-secondary"
          @click=${this.#clearSelection}
          id="scale-finder-clear-btn"
        >
          Καθαρισμός
        </button>
      </div>

      <div id="scale-finder-notesContainer" class="d-flex flex-wrap justify-content-center gap-2">
        ${notesHtml}
      </div>

      <div id="scale-finder-results" class="mt-4">
        ${this.#foundScales.length === 0 && this.#selectedNotes.length === 7
          ? html`<p class="text-muted text-center">Δεν βρέθηκαν δρόμοι</p>`
          : html`<scale-cards
              .scales=${this.#foundScales}
              .tonic=${this.#selectedNotes[0] || ""}
            ></scale-cards>`}
      </div>
    `;
  }

  #toggleNoteSelection(noteKey) {
    const index = this.#selectedNotes.indexOf(noteKey);

    if (index > -1) {
      this.#selectedNotes = [
        ...this.#selectedNotes.slice(0, index),
        ...this.#selectedNotes.slice(index + 1),
      ];
    } else if (this.#selectedNotes.length < 7) {
      this.#selectedNotes = [...this.#selectedNotes, noteKey];
    } else {
      return;
    }

    if (this.#selectedNotes.length === 7) {
      this.#foundScales = Scale.findScales(this.#selectedNotes);
    } else {
      this.#foundScales = [];
    }

    this.requestUpdate();
  }

  #clearSelection() {
    this.#selectedNotes = [];
    this.#foundScales = [];
    this.requestUpdate();
  }
}

customElements.define("scale-finder-page", ScaleFinderPage);
