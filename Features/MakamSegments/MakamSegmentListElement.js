import { LitElement, html, css } from "../../Libraries/lit/lit.min.js";
import { MakamSegment } from "./MakamSegment.js";
import { renderMusicSheet } from "../MusicSheets/MusicSheetRenderer.js";
import { Octave } from "../Octaves/Octave.js";
import { Note } from "../Notes/Note.js";
import { Interval } from "../Intervals/Interval.js";
import { OctaveRange } from "../Octaves/OctaveRange.js";

export class MakamSegmentListElement extends LitElement {
  static styles = css`
    .carousel-item .sheet-container {
      padding: 0 60px; /* Add padding to avoid overlap with controls */
    }

    @media (max-width: 768px) {
      .carousel-item .sheet-container {
        padding: 0 50px; /* Less padding on mobile */
      }
    }
  `;

  #segments = [];

  constructor() {
    super();
    this.#segments = MakamSegment.getAll();

    this.#segments = this.#segments;
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <!-- Makam Segments Accordion -->
      <div class="accordion" id="makamSegmentsAccordion">
        <!-- Δις διαπασών accordion item -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingDisDiapason">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseDisDiapason"
              aria-expanded="false"
              aria-controls="collapseDisDiapason"
            >
              Δις διαπασών
            </button>
          </h2>
          <div
            id="collapseDisDiapason"
            class="accordion-collapse collapse"
            aria-labelledby="headingDisDiapason"
            data-bs-parent="#makamSegmentsAccordion"
          >
            <div class="accordion-body">
              <ul class="mb-4">
                <li>Το δις διαπασών είναι η φυσική κλίμακα (ματζόρε) σε έκταση δύο οκτάβων.</li>
                <li>Τα ονόματα των βαθμίδων φαίνονται κάτω από κάθε νότα.</li>
                <li>Τα μακάμ κυρίως αναπτύσσονται στη μεσαία περιοχή.</li>
              </ul>

              <!-- Χαμηλή περιοχή -->
              <div class="mb-4">
                <h5 class="mb-3">${OctaveRange.Low.name}</h5>
                <div id="accordion-octave-range-low" class="sheet-container mb-3"></div>
              </div>

              <!-- Μέση περιοχή -->
              <div class="mb-4">
                <h5 class="mb-3">${OctaveRange.Mid.name}</h5>
                <div id="accordion-octave-range-mid" class="sheet-container mb-3"></div>
              </div>

              <!-- Υψηλή περιοχή -->
              <div class="mb-4">
                <h5 class="mb-3">${OctaveRange.High.name}</h5>
                <div id="accordion-octave-range-high" class="sheet-container mb-3"></div>
              </div>
            </div>
          </div>
        </div>

        ${this.#segments.map((segment, index) => {
          const actualIndex = index + 1; // Adjust index since Δις διαπασών is now index 0
          return html`
            <div class="accordion-item">
              <h2 class="accordion-header" id="heading${actualIndex}">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse${actualIndex}"
                  aria-expanded="false"
                  aria-controls="collapse${actualIndex}"
                >
                  ${segment.name}
                </button>
              </h2>
              <div
                id="collapse${actualIndex}"
                class="accordion-collapse collapse"
                aria-labelledby="heading${actualIndex}"
                data-bs-parent="#makamSegmentsAccordion"
              >
                <div class="accordion-body">
                  <!-- Διαστήματα -->
                  <h5 class="mb-3">Διαστήματα</h5>
                  <ul>
                    ${segment.intervals.map(
                      (intervalArray, intervalIndex) => html`
                        <li>
                          ${intervalArray.length + 1}x
                          ${intervalArray.map((interval) => Interval.getName(interval)).join("-")}
                        </li>
                      `
                    )}
                  </ul>

                  <!-- Προσαγωγέας -->
                  <h5 class="mb-3 mt-4">
                    Προσαγωγέας: ${Interval.getName(segment.leadingInterval)}
                  </h5>

                  <!-- Θέσεις -->
                  ${segment.placements.length > 0
                    ? html`
                        <h5 class="mb-3 mt-4">Θέσεις</h5>
                        <div
                          id="carousel-${actualIndex}"
                          class="carousel slide carousel-dark"
                          data-bs-ride="carousel"
                          data-bs-interval="10000"
                        >
                          <div class="carousel-inner">
                            ${segment.placements.map((placement, placementIndex) => {
                              const step = Octave.TwoOctaves.steps.find(
                                (step) => step.position === placement.octavePosition
                              );
                              if (!step) {
                                console.error(
                                  `Missing octave step for position ${placement.octavePosition} in segment ${segment.name}`
                                );
                              }
                              return html`
                                <div class="carousel-item ${placementIndex === 0 ? "active" : ""}">
                                  <div class="text-center">
                                    <h6 class="mb-3">
                                      ${placement.length}x στο ${step.label}
                                      ${placementIndex === 0
                                        ? html`<span class="badge bg-primary ms-2"
                                            >Βασική θέση</span
                                          >`
                                        : ""}
                                    </h6>
                                    <div
                                      id="sheet-${actualIndex}-${placementIndex}"
                                      class="sheet-container mb-3"
                                    ></div>
                                  </div>
                                </div>
                              `;
                            })}
                          </div>
                          ${segment.placements.length > 1
                            ? html`
                                <button
                                  class="carousel-control-prev"
                                  type="button"
                                  data-bs-target="#carousel-${actualIndex}"
                                  data-bs-slide="prev"
                                >
                                  <span
                                    class="carousel-control-prev-icon"
                                    aria-hidden="true"
                                  ></span>
                                  <span class="visually-hidden">Προηγούμενο</span>
                                </button>
                                <button
                                  class="carousel-control-next"
                                  type="button"
                                  data-bs-target="#carousel-${actualIndex}"
                                  data-bs-slide="next"
                                >
                                  <span
                                    class="carousel-control-next-icon"
                                    aria-hidden="true"
                                  ></span>
                                  <span class="visually-hidden">Επόμενο</span>
                                </button>
                              `
                            : ""}
                        </div>
                      `
                    : ""}
                  ${segment.notes.length
                    ? html`<ul class="mt-2">
                        ${segment.notes.map((note) => html`<li>${note}</li>`)}
                      </ul>`
                    : ""}
                </div>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  firstUpdated() {
    window.renderSheet = renderMusicSheet;

    // Render octave range sheets in accordion
    const lowContainer = this.querySelector("#accordion-octave-range-low");
    if (lowContainer) {
      const lowNotes = this.buildNotesFromOctaveRange(OctaveRange.Low);
      renderMusicSheet(lowContainer, lowNotes);
    }

    const midContainer = this.querySelector("#accordion-octave-range-mid");
    if (midContainer) {
      const midNotes = this.buildNotesFromOctaveRange(OctaveRange.Mid);
      renderMusicSheet(midContainer, midNotes);
    }

    const highContainer = this.querySelector("#accordion-octave-range-high");
    if (highContainer) {
      const highNotes = this.buildNotesFromOctaveRange(OctaveRange.High);
      renderMusicSheet(highContainer, highNotes);
    }

    // Render makam segment sheets
    this.#segments.forEach((segment, index) => {
      const actualIndex = index + 1; // Adjust for Δις διαπασών being index 0
      segment.placements.forEach((placement, pIndex) => {
        const container = this.querySelector(`#sheet-${actualIndex}-${pIndex}`);
        if (container) {
          const notes = this.buildNotesFromPlacement(placement);
          renderMusicSheet(container, notes);
        }
      });
    });
  }

  buildNotesFromOctaveRange(octaveRange) {
    return Octave.TwoOctaves.steps
      .filter((step) => {
        if (octaveRange.equals(OctaveRange.Low)) {
          return step.position >= -4 && step.position <= -1;
        } else if (octaveRange.equals(OctaveRange.Mid)) {
          return step.position >= 0 && step.position <= 7;
        } else if (octaveRange.equals(OctaveRange.High)) {
          return step.position >= 8 && step.position <= 11;
        }
        return false;
      })
      .map((step) => {
        const noteKey = step.note.match(/^([A-G])/)[1];
        const note = new Note(noteKey);

        return {
          note: step.note,
          label: `${note.name} ${step.label}`,
        };
      });
  }

  buildNotesFromPlacement(placement) {
    const start = placement.octavePosition;
    const end = start + placement.length;

    return Octave.TwoOctaves.steps
      .filter((step) => step.position >= start && step.position < end)
      .map((step, index) => {
        const noteKey = step.note.match(/^([A-G])/)[1];
        const note = new Note(noteKey);

        return {
          note: step.note,
          label: index === 0 ? `${note.name} ${step.label}` : step.label,
        };
      });
  }
}

customElements.define("makam-segment-list-element", MakamSegmentListElement);
