import { LitElement, html } from "../../../Libraries/lit/lit.min.js";
import { MakamSegment } from "../../MakamSegments/Backend/MakamSegment.js";
import { Octave } from "../../Octaves/Backend/Octave.js";
import { Note } from "../../Notes/Backend/Note.js";
import { Interval } from "../../Intervals/Backend/Interval.js";
import { Song } from "../../Songs/Backend/Song.js";
import { render as renderMusicSheet } from "../../MusicSheets/Backend/MusicSheetRenderer.js";

export class MakamDetailsFull extends LitElement {
  static properties = {
    makam: { type: Object },
    activeTab: { type: String },
  };

  constructor() {
    super();
    this.makam = null;
    this.activeVariantIndex = 0;
    this.activeTab = "variant";
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
    return this.makam.variants.map((variant) => ({ name: variant.name, variant }));
  }

  #switchTab(tabIndex) {
    this.#clearSegmentHighlight();
    this._activeSegment = null;
    const variants = this.#getAllVariants();
    if (tabIndex < variants.length) {
      this.activeVariantIndex = tabIndex;
      this.activeTab = "variant";
      this.requestUpdate();
      this.updateComplete.then(() => this.#renderSheets());
    } else {
      this.activeTab = "songs";
      this.requestUpdate();
    }
  }

  #getSongsForMakam() {
    const makamIds = new Set([this.makam.id]);
    this.#getAllVariants().forEach(({ variant }) => {
      if (variant.id) {
        makamIds.add(variant.id);
      }
    });

    const songsMap = new Map();
    makamIds.forEach((makamId) => {
      const songs = Song.getByMakamId(makamId);
      songs.forEach((song) => {
        songsMap.set(song.name, song);
      });
    });

    const allSongs = Array.from(songsMap.values());
    allSongs.sort((a, b) => {
      const authorsA = a.authors.join(", ");
      const authorsB = b.authors.join(", ");
      if (authorsA !== authorsB) {
        return authorsA.localeCompare(authorsB);
      }
      return a.name.localeCompare(b.name);
    });

    return allSongs;
  }

  #getIntervalsForVariant(variant) {
    return this.makam.getIntervals(variant.id);
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
      Octave.validatePosition(displayStartPosition);

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
    return Octave.getOctave(position).notationNumber;
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
        const currentSemitone = Note.countSemitones(noteKey);
        const prevSemitone = Note.countSemitones(prevNoteKey);

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

  #buildSheetNotes(variant) {
    const allIntervals = this.#getIntervalsForVariant(variant);
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

    let calculatedNotes = Note.intervalsToNormalizedNotes(calcNoteKey, allIntervals);

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

  #buildSheetTexts(variant) {
    // Use getIntervalsByVariantId for interval calculation
    const texts = {};
    const basePosition = this.makam.octavePosition;
    let currentPosition = basePosition;
    let noteIndex = 0;
    let noteCount = 0;

    const segmentsToProcess = variant.segments;
    segmentsToProcess.forEach((segment) => {
      const makamSegment = MakamSegment.getById(segment.id);
      const segmentSize = segment.size || makamSegment.intervals[0].length + 1;
      // For N notes, there are N-1 intervals
      const intervalCount = segmentSize - 1;
      const intervals = this.#getIntervalsForVariant(variant).slice(
        noteCount,
        noteCount + intervalCount
      );
      if (segment.position !== undefined) {
        currentPosition = basePosition + segment.position;
      }
      texts[noteIndex] = `${segmentSize}x ${makamSegment.name}`;
      noteIndex += intervalCount;
      noteCount += intervalCount;
    });

    if (!variant.isAscending) {
      for (const key in texts) {
        const oldIndex = Number(key);
        const value = texts[key];
        delete texts[key];
        const newIndex = noteCount - oldIndex;
        texts[newIndex] = value;
      }
    }

    return Object.fromEntries(Object.entries(texts).sort((a, b) => a[0] - b[0]));
  }

  #renderSheets() {
    const variants = this.#getAllVariants();
    const activeVariant = variants[this.activeVariantIndex].variant;
    const container = this.querySelector(`#sheet-variant-${this.activeVariantIndex}`);

    if (!container) {
      return;
    }

    container.innerHTML = "";

    const notes = this.#buildSheetNotes(activeVariant);
    const texts = this.#buildSheetTexts(activeVariant);
    renderMusicSheet(container, {
      notes: notes,
      texts: texts,
    });
  }

  #renderSegmentSummary(variant) {
    const segmentList = [];
    let noteCount = 0;
    const segmentsToProcess = variant.segments;
    const allNotes = this.#buildSheetNotes(variant).map((note) => note.note.replace(/[0-9]/g, ""));

    const allIntervals = this.#getIntervalsForVariant(variant);

    segmentsToProcess.forEach((segment) => {
      const makamSegment = MakamSegment.getById(segment.id);
      const segmentSize = segment.size || makamSegment.intervals[0].length + 1;
      // For N notes, there are N-1 intervals
      const intervalCount = segmentSize - 1;
      const intervals = allIntervals.slice(noteCount, noteCount + intervalCount);
      segmentList.push({
        size: segmentSize,
        name: makamSegment.name,
        intervals: intervals.map((i) => Interval.getName(i)).join("-"),
        indices: Array.from({ length: intervalCount }, (_, i) => noteCount + i),
      });
      noteCount += intervalCount;
    });

    return html`
      <div class="d-flex flex-column gap-2 mb-3">
        <strong>Διαστήματα & Νότες</strong>

        <!-- Intervals row -->
        <div class="d-flex gap-2 flex-wrap">
          ${segmentList.flatMap((segment) =>
            segment.intervals
              .split("-")
              .map(
                (iv, idx) =>
                  html`<span class="px-2" data-interval="${segment.indices[idx]}"> ${iv} </span>`
              )
          )}
        </div>

        <!-- Notes row -->
        <div class="d-flex gap-2 flex-wrap">
          ${allNotes.map(
            (note, index) => html`<span class="px-2" data-note="${index}"> ${note} </span>`
          )}
        </div>

        <!-- Segments clickable -->
        <div class="d-flex gap-3 flex-wrap">
          ${segmentList.map(
            (segment) => html`
              <span
                class="fw-semibold"
                style="cursor:pointer"
                @click=${() => this.#toggleSegment(segment.indices)}
              >
                ${segment.size}x ${segment.name}
              </span>
            `
          )}
        </div>
      </div>
    `;
  }

  #toggleSegment(indices) {
    if (this._activeSegment === indices) {
      this.#clearSegmentHighlight();
      this._activeSegment = null;
      return;
    }

    this.#clearSegmentHighlight();

    // Highlight intervals
    indices.forEach((index) => {
      this.renderRoot.querySelectorAll(`[data-interval='${index}']`).forEach((el) => {
        el.classList.add("bg-primary", "text-white", "rounded");
      });
    });

    // Highlight notes (N+1 for N intervals)
    if (indices.length > 0) {
      const first = indices[0];
      const last = indices[indices.length - 1] + 1;
      for (let i = first; i <= last; i++) {
        this.renderRoot.querySelectorAll(`[data-note='${i}']`).forEach((el) => {
          el.classList.add("bg-primary", "text-white", "rounded");
        });
      }
    }

    this._activeSegment = indices;
  }

  #clearSegmentHighlight() {
    this.renderRoot.querySelectorAll("[data-interval]").forEach((el) => {
      el.classList.remove("bg-primary", "text-white", "rounded");
    });
    this.renderRoot.querySelectorAll("[data-note]").forEach((el) => {
      el.classList.remove("bg-primary", "text-white", "rounded");
    });
  }

  #renderSongsContent() {
    const songs = this.#getSongsForMakam();

    if (songs.length === 0) {
      return html`
        <div class="container-fluid">
          <p class="text-muted">Δεν βρέθηκαν τραγούδια για αυτό το μακάμ.</p>
        </div>
      `;
    }

    return html`
      <div class="container-fluid">
        <ul>
          ${songs.map(
            (song) => html`
              <li class="mb-2">
                <strong>${song.name}</strong> <em>${song.authors.join(", ")}</em>
              </li>
            `
          )}
        </ul>
      </div>
    `;
  }

  #renderVariantContent(variant, variantIndex) {
    return html`
      <div class="container-fluid">
        <!-- Segments Summary -->
        <div class="mb-4">
          <ul class="mb-0">
            ${this.#renderSegmentSummary(variant)}
          </ul>
        </div>

        <!-- Sheet Music -->
        <div class="mb-5">
          <div id="sheet-variant-${variantIndex}"></div>
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
              <ul class="nav nav-tabs mb-4" role="tablist">
                ${this.#getAllVariants().map(
                  (item, index) => html`
                    <li class="nav-item" role="presentation">
                      <button
                        class="nav-link ${this.activeTab === "variant" &&
                        index === this.activeVariantIndex
                          ? "active"
                          : ""}"
                        type="button"
                        @click="${() => this.#switchTab(index)}"
                      >
                        ${item.name}
                      </button>
                    </li>
                  `
                )}
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link ${this.activeTab === "songs" ? "active" : ""}"
                    type="button"
                    @click="${() => this.#switchTab(this.#getAllVariants().length)}"
                  >
                    Τραγούδια
                  </button>
                </li>
              </ul>

              ${this.activeTab === "songs"
                ? this.#renderSongsContent()
                : this.#renderVariantContent(
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
