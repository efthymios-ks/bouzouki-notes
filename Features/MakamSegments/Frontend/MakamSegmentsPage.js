import { LitElement, html, css } from "../../../Libraries/lit/lit.min.js";
import { MakamSegment } from "../Backend/MakamSegment.js";
import { Octave } from "../../Octaves/Backend/Octave.js";
import { OctaveRange } from "../../Octaves/Backend/OctaveRange.js";
import { Note } from "../../Notes/Backend/Note.js";
import { Interval } from "../../Intervals/Backend/Interval.js";
import { render as renderMusicSheet } from "../../MusicSheets/Backend/MusicSheetRenderer.js";

export class MakamSegmentsPage extends LitElement {
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
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="accordion" id="makamSegmentsAccordion">
        ${this.#renderDisDiapason()} ${this.#renderSegments()}
      </div>
    `;
  }

  firstUpdated() {
    // Render octave range sheets in accordion
    const lowOctaveSheet = this.querySelector("#accordion-octave-range-low");
    renderMusicSheet(lowOctaveSheet, this.#buildSheetOptionsFromOctaveRange(OctaveRange.Low));

    const midOctaveSheet = this.querySelector("#accordion-octave-range-mid");
    renderMusicSheet(midOctaveSheet, this.#buildSheetOptionsFromOctaveRange(OctaveRange.Mid));

    const highOctaveSheet = this.querySelector("#accordion-octave-range-high");
    renderMusicSheet(highOctaveSheet, this.#buildSheetOptionsFromOctaveRange(OctaveRange.High));

    // Render makam segment sheets
    this.#segments.forEach((segment, segmentIndex) => {
      const segmentHeaderIndex = this.#getSegmentHeaderIndex(segmentIndex);
      segment.placements.forEach((placement, placementIndex) => {
        const segmentSheet = this.querySelector(`#sheet-${segmentHeaderIndex}-${placementIndex}`);
        if (!segmentSheet) {
          throw new Error(`Container not found for sheet-${segmentHeaderIndex}-${placementIndex}`);
        }

        renderMusicSheet(segmentSheet, this.#buildSheetOptionsFromPlacement(placement, segment));
      });
    });
  }

  #getSegmentHeaderIndex(index) {
    return index + 1; // Adjust index since Δις διαπασών is now index 0
  }

  #renderDisDiapason() {
    const remarks = html`
      <ul class="mb-4">
        <li>Το δις διαπασών είναι η φυσική κλίμακα (ματζόρε) σε έκταση δύο οκτάβων.</li>
        <li>Τα ονόματα των βαθμίδων φαίνονται κάτω από κάθε νότα.</li>
        <li>Τα μακάμ κυρίως αναπτύσσονται στη μεσαία περιοχή.</li>
      </ul>
    `;

    const ranges = {
      low: OctaveRange.Low,
      mid: OctaveRange.Mid,
      high: OctaveRange.High,
    };

    const rangesHtml = Object.keys(ranges).map(
      (key) => html`<div class="mb-4">
        <h5 class="mb-3">${ranges[key].name}</h5>
        <div id="accordion-octave-range-${key}" class="mb-3"></div>
      </div>`
    );

    return html` <div class="accordion-item">
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
        <div class="accordion-body">${remarks} ${rangesHtml}</div>
      </div>
    </div>`;
  }

  #renderSegments() {
    function renderSegmentBody(segment, headerIndex) {
      const intervals = html` <h5 class="mb-3">Διαστήματα</h5>
        <ul>
          ${segment.intervals.map(
            (intervalArray) => html`
              <li>
                ${intervalArray.length + 1}x
                ${intervalArray.map((interval) => Interval.getName(interval)).join("-")}
              </li>
            `
          )}
        </ul>`;

      const leadingInterval = html` <h5 class="mb-3 mt-4">
        Προσαγωγέας: ${Interval.getLongName(segment.leadingInterval)}
      </h5>`;

      const placements =
        segment.placements.length > 0
          ? html`
              <h5 class="mb-3 mt-4">Θέσεις</h5>

              <div id="carousel-${headerIndex}" class="carousel slide carousel-dark">
                <div class="carousel-inner">
                  ${segment.placements.map((placement, placementIndex) => {
                    Octave.validatePosition(placement.octavePosition);
                    return html`
                      <div class="carousel-item ${placementIndex === 0 ? "active" : ""}">
                        <div class="text-center">
                          <h6 class="mb-3">
                            ${placement.octavePosition === segment.baseStep
                              ? html`<span class="badge bg-primary">Βασική θέση</span>`
                              : ""}
                          </h6>
                          <div
                            id="sheet-${headerIndex}-${placementIndex}"
                            class="music-sheet mb-3"
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
                        data-bs-target="#carousel-${headerIndex}"
                        data-bs-slide="prev"
                      >
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Προηγούμενο</span>
                      </button>
                      <button
                        class="carousel-control-next"
                        type="button"
                        data-bs-target="#carousel-${headerIndex}"
                        data-bs-slide="next"
                      >
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Επόμενο</span>
                      </button>
                    `
                  : ""}
              </div>
            `
          : "";

      const remarks = segment.remarks.length
        ? html`
            <h5 class="mb-3 mt-4">Σημειώσεις</h5>
            <ul class="mt-2">
              ${segment.remarks.map((note) => html`<li>${note}</li>`)}
            </ul>
          `
        : "";

      return html`${intervals} ${leadingInterval} ${placements} ${remarks}`;
    }

    return html`${this.#segments.map((segment, index) => {
      const headerIndex = this.#getSegmentHeaderIndex(index);
      return html`
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading${headerIndex}">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapse${headerIndex}"
              aria-expanded="false"
              aria-controls="collapse${headerIndex}"
            >
              ${segment.name}
            </button>
          </h2>

          <div
            id="collapse${headerIndex}"
            class="accordion-collapse collapse"
            aria-labelledby="heading${headerIndex}"
            data-bs-parent="#makamSegmentsAccordion"
          >
            <div class="accordion-body">${renderSegmentBody(segment, headerIndex)}</div>
          </div>
        </div>
      `;
    })}`;
  }

  #buildSheetOptionsFromOctaveRange(octaveRange) {
    const notes = Octave.TwoOctaves.steps
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

    return {
      notes: notes,
    };
  }

  #buildSheetOptionsFromPlacement(placement, segment) {
    const startStep = Octave.TwoOctaves.getStepByPosition(placement.octavePosition);
    const intervalValues = segment.getIntervalsBySize(placement.length);

    const baseNote = startStep.note.match(/^([A-G])/)[1];
    const calculatedNotes = Note.intervalsToNormalizedNotes(baseNote, intervalValues);
    const startingOctave = Octave.getOctave(placement.octavePosition).notationNumber;

    const notes = [];

    // Leading note
    const leadingNote = new Note(Note.transpose(baseNote, -segment.leadingInterval));
    let leadingNoteOctave = startingOctave;
    if (Note.countSemitones(leadingNote.key) > Note.countSemitones(baseNote)) {
      leadingNoteOctave = startingOctave - 1;
    }

    // Add segment notes
    let currentOctave = startingOctave;
    let previousSemitone = null;
    const segmentNotes = calculatedNotes.map((noteKey, index) => {
      const semitone = Note.countSemitones(noteKey);
      if (previousSemitone !== null && semitone < previousSemitone) {
        currentOctave++;
      }

      previousSemitone = semitone;

      return {
        note: `${noteKey}${currentOctave}`,
        label:
          index === 0 ? `${new Note(noteKey).name} ${startStep.label}` : new Note(noteKey).name,
      };
    });

    // Add notes
    notes.push({
      note: `${leadingNote.key}${leadingNoteOctave}`,
      label: `(${leadingNote.name})`,
    });

    notes.push(...segmentNotes);

    return {
      notes: notes,
      texts: {
        0: "Προσαγωγέας",
      },
    };
  }
}

customElements.define("makam-segments-page", MakamSegmentsPage);
