import { LitElement, html } from "../../../Libraries/lit/lit.min.js";
import { Note } from "../../Notes/Backend/Note.js";
import { Makam } from "../Backend/Makam.js";
import { Octave } from "../../Octaves/Backend/Octave.js";
import { Interval } from "../../Intervals/Backend/Interval.js";

export class MakamFinderPage extends LitElement {
  static properties = {
    selectedNotes: { type: Array },
    foundResults: { type: Array },
  };

  constructor() {
    super();
    this.selectedNotes = [];
    this.foundResults = [];
  }

  createRenderRoot() {
    return this;
  }

  render() {
    const notesHtml = Note.sharpNotes.map((noteKey) => {
      const note = new Note(noteKey);
      const isActive = this.selectedNotes.includes(noteKey);
      const isActiveClasses = isActive ? "active btn-primary" : "btn-outline-primary";

      return html`
        <button
          type="button"
          class="makam-finder-note btn d-flex flex-column align-items-center ${isActiveClasses}"
          @click=${() => this.#toggleNoteSelection(noteKey)}
        >
          ${note.toPrintableString()}
        </button>
      `;
    });

    return html`
      <div class="d-flex flex-wrap justify-content-center align-items-center gap-3 mb-3">
        <div class="badge bg-primary text-white fw-semibold rounded px-2 py-1">
          ${this.selectedNotes.length} νότ${this.selectedNotes.length === 1 ? "α" : "ες"}
        </div>

        <button
          class="btn btn-sm btn-outline-secondary"
          @click=${this.#clearSelection}
          ?disabled=${this.selectedNotes.length === 0}
        >
          Καθαρισμός
        </button>
      </div>

      <div class="d-flex flex-wrap justify-content-center gap-2 mb-4">${notesHtml}</div>

      <div class="mt-4">
        ${this.foundResults.length === 0 && this.selectedNotes.length > 0
          ? html`<p class="text-muted text-center">Δεν βρέθηκαν μακάμ</p>`
          : this.foundResults.length > 0
          ? html`
              <h5 class="text-center mb-3">Βρέθηκαν πιθανά μακάμ</h5>
              <div class="d-flex flex-wrap justify-content-center gap-2">
                ${this.foundResults.map((result) => this.#renderMakamMatch(result))}
              </div>
            `
          : ""}
      </div>
    `;
  }

  #renderMakamMatch(result) {
    return html`
      <div class="card" style="min-width: 20rem; max-width: 25rem;">
        <div class="card-body py-2 px-3">
          <div class="fw-bold">
            ${result.makam.name}
            ${result.variant.isMain
              ? ""
              : html` - <span class="fw-normal">${result.variant.name}</span>`}
          </div>
          <div class="small">
            <span class="text-secondary">Τονική:</span> ${result.tonic}
            <span class="badge bg-info text-dark ms-2"
              >${result.matchedNotes}/${result.totalNotes}</span
            >
          </div>
          <div class="small text-muted">
            <span class="text-secondary">Νότες:</span>
            ${result.makamNotes.map((n) => Note.toPrintableString(n)).join(", ")}
          </div>
          <div class="small text-muted">
            <span class="text-secondary">Διαστήματα:</span>
            ${result.variant.intervals.map((interval) => Interval.getName(interval)).join("-")}
          </div>
        </div>
      </div>
    `;
  }

  #toggleNoteSelection(noteKey) {
    const index = this.selectedNotes.indexOf(noteKey);

    if (index > -1) {
      this.selectedNotes = [
        ...this.selectedNotes.slice(0, index),
        ...this.selectedNotes.slice(index + 1),
      ];
    } else {
      this.selectedNotes = [...this.selectedNotes, noteKey];
    }

    this.#findMakams();
    this.requestUpdate();
  }

  #clearSelection() {
    this.selectedNotes = [];
    this.foundResults = [];
    this.requestUpdate();
  }

  #findMakams() {
    if (this.selectedNotes.length === 0) {
      this.foundResults = [];
      return;
    }

    const allMakams = Makam.getAll();
    const results = [];

    // For each makam and variant, try all 12 possible tonics
    allMakams.forEach((makam) => {
      let mainVariantMatched = false;

      // First check main variant
      const mainVariant = makam.mainVariant;
      Note.sharpNotes.forEach((tonic) => {
        const makamNotes = Note.intervalsToNotes(tonic, mainVariant.intervals);

        // Count how many makam notes are in selected notes (including duplicates)
        const matchedNotes = makamNotes.filter((note) => this.selectedNotes.includes(note)).length;

        // Only include if at least 7 notes match
        if (matchedNotes >= 7) {
          // Calculate the actual tonic based on octavePosition
          const baseStep = Octave.TwoOctaves.getStepByPosition(mainVariant.octavePosition);
          const actualTonic = baseStep.note.match(/^([A-G][#b]?)/)[1];
          const isTonicMatch = tonic === actualTonic;

          mainVariantMatched = true;
          results.push({
            makam,
            variant: mainVariant,
            tonic: Note.toPrintableString(tonic),
            actualTonic,
            isTonicMatch,
            makamNotes,
            matchedNotes,
            totalNotes: makamNotes.length,
            matchPercentage: (matchedNotes / makamNotes.length) * 100,
          });
        }
      });

      // If main variant matched, skip child variants
      if (mainVariantMatched) {
        return;
      }

      // Check child variants only if main variant didn't match
      makam.variants.forEach((variant) => {
        Note.sharpNotes.forEach((tonic) => {
          const makamNotes = Note.intervalsToNotes(tonic, variant.intervals);

          // Count how many makam notes are in selected notes (including duplicates)
          const matchedNotes = makamNotes.filter((note) =>
            this.selectedNotes.includes(note)
          ).length;

          // Only include if at least 7 notes match
          if (matchedNotes >= 7) {
            // Calculate the actual tonic based on octavePosition
            const baseStep = Octave.TwoOctaves.getStepByPosition(variant.octavePosition);
            const actualTonic = baseStep.note.match(/^([A-G][#b]?)/)[1];
            const isTonicMatch = tonic === actualTonic;

            results.push({
              makam,
              variant,
              tonic: Note.toPrintableString(tonic),
              actualTonic,
              isTonicMatch,
              makamNotes,
              matchedNotes,
              totalNotes: makamNotes.length,
              matchPercentage: (matchedNotes / makamNotes.length) * 100,
            });
          }
        });
      });
    });

    results.sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }

      if (a.variant.isMain !== b.variant.isMain) {
        return a.variant.isMain ? -1 : 1;
      }

      if (a.isTonicMatch !== b.isTonicMatch) {
        return a.isTonicMatch ? -1 : 1;
      }

      return 0;
    });

    // Filter to only show 100% matches
    this.foundResults = results.filter((r) => r.matchPercentage === 100);
  }
}

customElements.define("makam-finder-page", MakamFinderPage);
