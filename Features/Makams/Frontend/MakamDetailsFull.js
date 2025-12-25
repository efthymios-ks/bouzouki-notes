import { LitElement, html } from "../../../Libraries/lit/lit.min.js";
import { MakamSegment } from "../../MakamSegments/Backend/MakamSegment.js";
import { Octave } from "../../Octaves/Backend/Octave.js";
import { Note } from "../../Notes/Backend/Note.js";
import { Interval } from "../../Intervals/Backend/Interval.js";
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

  #collectIntervalsFromSegments(segments) {
    return segments.flatMap((segment) => {
      const makamSegment = MakamSegment.getById(segment.id);
      return segment.intervals || makamSegment.getIntervalsBySize(segment.size);
    });
  }

  #calculateStartPosition(variant) {
    const basePosition = this.makam.octavePosition;
    const firstSegment = variant.segments[0];

    if (firstSegment?.position !== undefined) {
      return basePosition + firstSegment.position;
    }

    return basePosition;
  }

  #calculatePositions(variant, makamStartPosition, totalSteps) {
    const isDescending = !variant.isAscending;

    if (isDescending) {
      const displayStartPosition = makamStartPosition + totalSteps;
      Octave.validatePosition(displayStartPosition, `for descending variant '${variant.name}'`);

      return {
        displayStartPosition,
        calculationPosition: makamStartPosition,
      };
    }

    return {
      displayStartPosition: makamStartPosition,
      calculationPosition: makamStartPosition,
    };
  }

  #getStartOctave(position) {
    if (position < 0) return 3;
    if (position < 7) return 4;
    return 5;
  }

  #calculateSegmentEdges(variant) {
    const segmentEdgeIndices = new Set([0]);
    const segmentsToProcess = variant.isAscending
      ? variant.segments
      : [...variant.segments].reverse();
    let noteIndex = 0;

    segmentsToProcess.forEach((segment) => {
      const makamSegment = MakamSegment.getById(segment.id);
      const intervals = segment.intervals || makamSegment.getIntervalsBySize(segment.size);
      noteIndex += intervals.length;
      segmentEdgeIndices.add(noteIndex);
    });

    return segmentEdgeIndices;
  }

  #createNoteLabel(note, index, currentNotePosition, segmentEdgeIndices, variant) {
    if (!segmentEdgeIndices.has(index)) {
      return note.name;
    }

    const noteOctaveStep = Octave.TwoOctaves.steps.find(
      (step) => step.position === currentNotePosition
    );

    if (!noteOctaveStep) {
      throw new Error(
        `Invalid position ${currentNotePosition} for note at index ${index} in variant '${variant.name}'`
      );
    }

    return `${note.name} ${noteOctaveStep.label}`;
  }

  #processNotes(calculatedNotes, startOctave, displayStartPosition, segmentEdgeIndices, variant) {
    const isDescending = !variant.isAscending;
    const notes = [];
    let currentOctave = startOctave;
    let currentNotePosition = displayStartPosition;

    calculatedNotes.forEach((noteKey, index) => {
      const note = new Note(noteKey);

      if (index > 0) {
        const prevNoteKey = calculatedNotes[index - 1];
        const currentSemitone = Note.getSemitone(noteKey);
        const prevSemitone = Note.getSemitone(prevNoteKey);

        if (isDescending) {
          if (currentSemitone > prevSemitone) {
            currentOctave--;
          }
          currentNotePosition--;
        } else {
          if (currentSemitone < prevSemitone) {
            currentOctave++;
          }
          currentNotePosition++;
        }
      }

      const label = this.#createNoteLabel(
        note,
        index,
        currentNotePosition,
        segmentEdgeIndices,
        variant
      );

      notes.push({
        note: `${noteKey}${currentOctave}`,
        label,
      });
    });

    return notes;
  }

  #buildNotesFromVariant(variant) {
    const allIntervals = this.#collectIntervalsFromSegments(variant.segments);
    const makamStartPosition = this.#calculateStartPosition(variant);
    const totalSteps = allIntervals.length;

    const { displayStartPosition, calculationPosition } = this.#calculatePositions(
      variant,
      makamStartPosition,
      totalSteps
    );

    Octave.validatePosition(calculationPosition, `for variant '${variant.name}'`);

    const calcOctaveStep = Octave.TwoOctaves.steps.find(
      (step) => step.position === calculationPosition
    );
    const calcNoteKey = calcOctaveStep.note.match(/^([A-G][#b]?)/)[1];
    const startOctave = this.#getStartOctave(displayStartPosition);
    const segmentEdgeIndices = this.#calculateSegmentEdges(variant);

    let calculatedNotes = Note.calculateNormalizedNotes(calcNoteKey, allIntervals);

    if (!variant.isAscending) {
      calculatedNotes = calculatedNotes.reverse();
    }

    return this.#processNotes(
      calculatedNotes,
      startOctave,
      displayStartPosition,
      segmentEdgeIndices,
      variant
    );
  }

  #buildSheetSelections(variant) {
    const selections = [];
    const basePosition = this.makam.octavePosition;
    let currentPosition = basePosition;
    let noteIndex = 0;

    const segmentsToProcess = variant.isAscending
      ? variant.segments
      : [...variant.segments].reverse();

    segmentsToProcess.forEach((segment) => {
      const makamSegment = MakamSegment.getById(segment.id);
      const intervals = segment.intervals || makamSegment.getIntervalsBySize(segment.size);
      const segmentLength = intervals.length + 1;

      if (segment.position !== undefined) {
        currentPosition = basePosition + segment.position;
      }

      const segmentSize = segment.size || intervals.length + 1;
      selections.push({
        start: noteIndex,
        stop: noteIndex + segmentLength - 1,
        title: `${segmentSize}x ${makamSegment.name}`,
      });

      noteIndex += segmentLength - 1;
    });

    return selections;
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
    const selections = this.#buildSheetSelections(activeVariant);

    renderMusicSheet(container, notes, { selections });
  }

  #renderSegmentSummary(variant) {
    const basePosition = this.makam.octavePosition;
    const direction = variant.isAscending ? 1 : -1;
    const segmentsToProcess = variant.isAscending
      ? variant.segments
      : [...variant.segments].reverse();

    const segmentsByRange = new Map();
    let currentPosition = basePosition;

    segmentsToProcess.forEach((segment, processIndex) => {
      if (segment.position !== undefined) {
        currentPosition = basePosition + segment.position;
      }

      const makamSegment = MakamSegment.getById(segment.id);
      const intervals = segment.intervals || makamSegment.getIntervalsBySize(segment.size);
      const step = Octave.TwoOctaves.steps.find((s) => s.position === currentPosition);

      if (!step) {
        throw new Error(
          `No octave step found for position ${currentPosition} in segment '${segment.id}'`
        );
      }

      if (!step.range) {
        throw new Error(
          `No range defined for position ${currentPosition} in segment '${segment.id}'`
        );
      }

      const originalIndex = variant.isAscending
        ? processIndex
        : variant.segments.length - 1 - processIndex;

      if (!segmentsByRange.has(step.range.key)) {
        segmentsByRange.set(step.range.key, { range: step.range, segments: [] });
      }

      segmentsByRange.get(step.range.key).segments.push({
        size: segment.size || intervals.length + 1,
        name: makamSegment.name,
        intervals: intervals.map((i) => Interval.getName(i)).join("-"),
        originalIndex,
      });

      currentPosition += intervals.length * direction;
    });

    const rangeGroups = Array.from(segmentsByRange.values());
    if (!variant.isAscending) {
      rangeGroups.reverse();
    }

    // Sort segments within each range by original index
    rangeGroups.forEach((group) => {
      group.segments.sort((a, b) => a.originalIndex - b.originalIndex);
    });

    return html`
      ${rangeGroups.map(
        ({ range, segments }) => html`
          <li class="fw-bold mt-3 mb-2">${range.name}</li>
          ${segments.map(
            (seg) => html`<li class="ms-3">${seg.size}x ${seg.name} (${seg.intervals})</li>`
          )}
        `
      )}
    `;
  }

  #renderVariantContent(variant, variantIndex) {
    return html`
      <div class="container-fluid">
        <!-- Segments Summary -->
        <div class="mb-4">
          <ul class="list-unstyled mb-0">
            ${this.#renderSegmentSummary(variant)}
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
