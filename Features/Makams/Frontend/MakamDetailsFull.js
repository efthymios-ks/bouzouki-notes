import { LitElement, html } from "../../../Libraries/lit/lit.min.js";
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

  #highlightClasses = Object.freeze(["bg-primary", "text-white", "rounded"]);

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
    return this.makam.allVariants.map((variant) => ({ name: variant.name, variant }));
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
    const variantIds = this.makam.variants.map((variant) => variant.id);
    const makamIds = new Set([this.makam.id, ...variantIds]);

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

  #calculateSheetStartPosition(variant, makamBasePosition, noteCount) {
    if (variant.isAscending) {
      return makamBasePosition;
    }

    // For descending, start higher and go down
    const sheetStartPosition = makamBasePosition + noteCount;
    Octave.validatePosition(sheetStartPosition);
    return sheetStartPosition;
  }

  #calculateSegmentEdges(variant) {
    const minPosition = Math.min(...variant.segments.map((s) => s.position));
    const segmentEdgeIndices = new Set();

    variant.segments.forEach((segment) => {
      const startIndex = segment.position - minPosition;
      const endIndex = startIndex + segment.intervals.length;
      segmentEdgeIndices.add(startIndex);
      segmentEdgeIndices.add(endIndex);
    });

    return segmentEdgeIndices;
  }

  #createNoteLabel(note, index, currentNotePosition, segmentEdgeIndices) {
    if (!segmentEdgeIndices.has(index)) {
      return note.name;
    }

    const noteOctaveStep = Octave.TwoOctaves.getStepByPosition(currentNotePosition);
    return `${note.name} ${noteOctaveStep.label}`;
  }

  #processNotes(
    calculatedNotes,
    startOctave,
    displayStartPosition,
    segmentEdgeIndices,
    isDescending
  ) {
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

      const label = this.#createNoteLabel(note, index, currentNotePosition, segmentEdgeIndices);

      notes.push({
        note: `${noteKey}${currentOctave}`,
        label,
      });
    });

    return notes;
  }

  #buildSheetNotes(variant) {
    const makamBasePosition = variant.octavePosition;
    const noteCount = variant.intervals.length;

    const sheetStartPosition = this.#calculateSheetStartPosition(
      variant,
      makamBasePosition,
      noteCount
    );

    const startOctave = Octave.getOctave(sheetStartPosition).notationNumber;
    const segmentEdgeIndices = this.#calculateSegmentEdges(variant);

    let notes = variant.notes.map((note) => note.key);
    if (!variant.isAscending) {
      notes = notes.reverse();
    }

    return this.#processNotes(
      notes,
      startOctave,
      sheetStartPosition,
      segmentEdgeIndices,
      !variant.isAscending
    );
  }

  #buildSheetTexts(variant) {
    const minPosition = Math.min(...variant.segments.map((s) => s.position));
    const texts = {};
    const noteCount = variant.intervals.length;

    variant.segments.forEach((segment) => {
      const startIndex = segment.position - minPosition;
      let text = `${segment.size}x ${segment.name}`;
      if (variant.isAscending) {
        text = `${text} →`;
      } else if (!variant.isAscending) {
        text = `← ${text}`;
      }

      texts[startIndex] = text;
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

    const minPosition = Math.min(...variant.segments.map((segment) => segment.position));
    const allIntervals = variant.intervals.map((interval) => Interval.getName(interval));
    const allNotes = variant.notes.map((note) => note.key);
    variant.segments.forEach((segment) => {
      const octaveStep = Octave.TwoOctaves.getStepByPosition(segment.octavePosition);
      const noteKey = octaveStep.note.match(/^([A-G][#b]?)/)[1];
      const note = new Note(noteKey);
      const fullName = `${segment.size}x ${segment.name} στο ${note.name} ${octaveStep.label}`;

      // Map segment position to variant array index
      const startIndex = segment.position - minPosition;
      const intervalCount = segment.intervals.length;
      const indices = Array.from({ length: intervalCount }, (_, i) => startIndex + i);

      segmentList.push({
        size: segment.size,
        name: fullName,
        intervals: segment.intervals.map((interval) => Interval.getName(interval)).join("-"),
        indices,
      });
    });

    return html`
      <div class="d-flex flex-column gap-2 mb-3">
        <strong>Διαστήματα</strong>

        <!-- Intervals row -->
        <div class="d-flex gap-2 flex-wrap">
          ${allIntervals.map(
            (iv, index) => html`<span class="px-2" data-interval="${index}"> ${iv} </span>`
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
                class="fw-semibold user-select-none"
                style="cursor:pointer"
                data-segment="${segment.indices[0]}"
                @click=${() => this.#toggleSegment(segment.indices)}
              >
                ${segment.name}
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

    // Highlight the segment itself
    const segmentId = indices[0];
    this.renderRoot.querySelectorAll(`[data-segment='${segmentId}']`).forEach((element) => {
      element.classList.add(...this.#highlightClasses);
    });

    // Highlight intervals
    indices.forEach((index) => {
      this.renderRoot.querySelectorAll(`[data-interval='${index}']`).forEach((element) => {
        element.classList.add(...this.#highlightClasses);
      });
    });

    // Highlight notes (N+1 for N intervals)
    if (indices.length > 0) {
      const first = indices[0];
      const last = indices[indices.length - 1] + 1;
      for (let i = first; i <= last; i++) {
        this.renderRoot.querySelectorAll(`[data-note='${i}']`).forEach((element) => {
          element.classList.add(...this.#highlightClasses);
        });
      }
    }

    this._activeSegment = indices;
  }

  #clearSegmentHighlight() {
    this.renderRoot.querySelectorAll("[data-segment]").forEach((el) => {
      el.classList.remove(...this.#highlightClasses);
    });
    this.renderRoot.querySelectorAll("[data-interval]").forEach((el) => {
      el.classList.remove(...this.#highlightClasses);
    });
    this.renderRoot.querySelectorAll("[data-note]").forEach((el) => {
      el.classList.remove(...this.#highlightClasses);
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
              <li class="mb-3" style="display: flex; align-items: center;">
                <div
                  class="d-flex align-items-start justify-content-between justify-content-md-start flex-grow-1 gap-3"
                >
                  <div>
                    <div><strong>${song.name}</strong></div>
                    <div class="text-muted"><em>${song.authors.join(", ")}</em></div>
                  </div>
                  <a
                    href="${song.youtubeSearchUrl}"
                    target="_blank"
                    rel="noopener"
                    title="YouTube"
                    class="ms-lg-3"
                  >
                    <i class="bi bi-youtube text-danger" style="font-size: 1rem;"></i>
                  </a>
                </div>
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
