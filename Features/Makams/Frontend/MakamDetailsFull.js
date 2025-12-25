import { LitElement, html } from "../../../Libraries/lit/lit.min.js";
import { MakamSegment } from "../../MakamSegments/Backend/MakamSegment.js";
import { Octave } from "../../Octaves/Backend/Octave.js";
import { Note } from "../../Notes/Backend/Note.js";
import { renderMusicSheet } from "../../MusicSheets/Backend/MusicSheetRenderer.js";

export class MakamDetailsFull extends LitElement {
  static properties = {
    makam: { type: Object },
  };

  constructor() {
    super();
    this.makam = null;
    this.activeVariantIndex = 0;
  }

  createRenderRoot() {
    return this;
  }

  show(makam) {
    if (!makam) {
      throw new Error("makam parameter is required");
    }

    this.makam = makam;
    this.activeVariantIndex = 0;
    document.body.style.overflow = "hidden";
    this.requestUpdate();
    this.updateComplete.then(() => this.#renderSheets());
  }

  #hide() {
    this.makam = null;
    document.body.style.overflow = "";
    this.requestUpdate();
  }

  #shrink() {
    const makam = this.makam;
    this.#hide();
    const shortDetails = document.querySelector("makam-details-short");
    if (shortDetails) {
      shortDetails.show(makam);
    }
  }

  #onModalClick(event) {
    if (event.target.classList.contains("modal")) {
      this.#hide();
    }
  }

  #getAllVariants() {
    const variants = [{ name: this.makam.mainVariant.name, variant: this.makam.mainVariant }];
    if (this.makam.variants && this.makam.variants.length > 0) {
      this.makam.variants.forEach((variant) => {
        variants.push({ name: variant.name, variant });
      });
    }
    return variants;
  }

  #switchVariant(index) {
    this.activeVariantIndex = index;
    this.requestUpdate();
    this.updateComplete.then(() => this.#renderSheets());
  }

  #buildNotesFromVariant(variant) {
    const allIntervals = variant.segments.flatMap((segment) => {
      const makamSegment = MakamSegment.getById(segment.id);
      return makamSegment.getIntervalsBySize(segment.size);
    });

    const basePosition = this.makam.octavePosition;
    const octaveStep = Octave.TwoOctaves.steps.find((step) => step.position === basePosition);
    const baseNoteKey = octaveStep.note.match(/^([A-G][#b]?)/)[1];

    let startOctave;
    if (basePosition < 0) {
      startOctave = 3;
    } else if (basePosition < 7) {
      startOctave = 4;
    } else {
      startOctave = 5;
    }

    const calculatedNotes = Note.calculateNormalizedNotes(baseNoteKey, allIntervals);
    const notes = [];

    let currentOctave = startOctave;
    calculatedNotes.forEach((noteKey, index) => {
      const note = new Note(noteKey);

      if (index > 0) {
        const prevNoteKey = calculatedNotes[index - 1];
        const currentSemitone = Note.getSemitone(noteKey);
        const prevSemitone = Note.getSemitone(prevNoteKey);

        if (currentSemitone < prevSemitone) {
          currentOctave = currentOctave + 1;
        }
      }

      notes.push({
        note: `${noteKey}${currentOctave}`,
        label: index === 0 ? `${note.name} ${octaveStep.label}` : note.name,
      });
    });

    return notes;
  }

  #renderSheets() {
    const variants = this.#getAllVariants();
    const activeVariant = variants[this.activeVariantIndex].variant;

    const container = this.querySelector(`#sheet-variant-${this.activeVariantIndex}`);
    if (!container) {
      return;
    }

    container.innerHTML = "";

    const notes = this.#buildNotesFromVariant(activeVariant);

    const options = {
      selections: [],
    };

    const basePosition = this.makam.octavePosition;
    let currentPosition = basePosition;
    let noteIndex = 0;

    activeVariant.segments.forEach((segment) => {
      const makamSegment = MakamSegment.getById(segment.id);
      const intervals = makamSegment.getIntervalsBySize(segment.size);
      const segmentLength = intervals.length + 1;

      if (segment.position !== undefined) {
        currentPosition = basePosition + segment.position;
      }

      options.selections.push({
        start: noteIndex,
        stop: noteIndex + segmentLength - 1,
        title: `${segment.size}x ${makamSegment.name}`,
      });

      const segmentTotalSteps = intervals.length;
      currentPosition += segmentTotalSteps;
      noteIndex += segmentLength - 1;
    });

    renderMusicSheet(container, notes, options);
  }

  #renderVariantContent(variant, variantIndex) {
    const basePosition = this.makam.octavePosition;
    let currentPosition = basePosition;

    return html`
      <div class="container-fluid">
        <!-- Segments Summary -->
        <div class="mb-4">
          <ul class="list-unstyled mb-0">
            ${variant.segments.map((segment, index) => {
              const makamSegment = MakamSegment.getById(segment.id);
              const intervals = makamSegment.getIntervalsBySize(segment.size);
              const intervalsString = intervals.join("-");

              if (segment.position !== undefined) {
                currentPosition = basePosition + segment.position;
              }

              const currentOctaveStep = Octave.TwoOctaves.steps.find(
                (step) => step.position === currentPosition
              );
              const segmentStartNote = new Note(currentOctaveStep.note.match(/^([A-G][#b]?)/)[1]);
              const segmentStartLabel = currentOctaveStep.label;

              const segmentTotalSteps = intervals.length;
              currentPosition += segmentTotalSteps;

              return html`
                <li>
                  <strong>${segmentStartNote.name} ${segmentStartLabel}</strong> - ${segment.size}x
                  ${makamSegment.name} (${intervalsString})
                </li>
              `;
            })}
          </ul>
        </div>

        <!-- Sheet Music -->
        <div class="mb-5">
          <div id="sheet-variant-${variantIndex}" class="sheet-container"></div>
        </div>
      </div>
    `;
  }

  render() {
    if (!this.makam) {
      return html``;
    }

    const isVisible = !!this.makam;

    return html`
      <div
        class="modal fade ${isVisible ? "show" : ""}"
        tabindex="-1"
        aria-modal="true"
        style="${isVisible ? "display: block;" : "display: none;"}"
        @click=${this.#onModalClick}
      >
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div
              class="modal-header d-flex align-items-center justify-content-between border-0 py-2 px-3 bg-light"
            >
              <h5 class="modal-title fw-bold mb-0 text-center flex-grow-1">${this.makam.name}</h5>

              <div class="d-flex align-items-center gap-1">
                <button
                  type="button"
                  class="btn btn-link text-dark p-1 lh-1"
                  @click="${() => this.#shrink()}"
                  title="Λιγότερα"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  style="text-decoration: none;"
                >
                  <i class="bi bi-arrows-angle-contract" style="font-size: 1.1rem;"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-link text-dark p-1 lh-1"
                  @click="${() => this.#hide()}"
                  title="Έξοδος"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  style="text-decoration: none;"
                >
                  <i class="bi bi-x-lg" style="font-size: 1.1rem;"></i>
                </button>
              </div>
            </div>

            <div class="modal-body px-3 py-3">
              ${this.#getAllVariants().length > 1
                ? html`
                    <ul class="nav nav-tabs mb-4" role="tablist">
                      ${this.#getAllVariants().map(
                        (item, index) => html`
                          <li class="nav-item" role="presentation">
                            <button
                              class="nav-link ${index === this.activeVariantIndex ? "active" : ""}"
                              type="button"
                              @click="${() => this.#switchVariant(index)}"
                            >
                              ${item.name}
                            </button>
                          </li>
                        `
                      )}
                    </ul>
                  `
                : ""}
              ${this.#renderVariantContent(
                this.#getAllVariants()[this.activeVariantIndex].variant,
                this.activeVariantIndex
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal-backdrop fade ${isVisible ? "show" : ""}"
        style="${isVisible ? "display: block;" : "display: none;"}"
      ></div>
    `;
  }
}

customElements.define("makam-details-full", MakamDetailsFull);
