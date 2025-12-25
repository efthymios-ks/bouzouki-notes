import { LitElement, html } from "../../../Libraries/lit/lit.min.js";
import { MakamSegment } from "../../MakamSegments/Backend/MakamSegment.js";
import { Octave } from "../../Octaves/Backend/Octave.js";
import { Note } from "../../Notes/Backend/Note.js";
import { Interval } from "../../Intervals/Backend/Interval.js";

export class MakamDetails extends LitElement {
  static properties = {
    makam: { type: Object },
  };

  constructor() {
    super();
    this.makam = null;
  }

  createRenderRoot() {
    return this;
  }

  show(makam) {
    if (!makam) {
      throw new Error("MakamDetails: makam parameter is required");
    }

    this.makam = makam;
    document.body.style.overflow = "hidden";
    this.requestUpdate();

    // Initialize Bootstrap tooltips after render
    this.updateComplete.then(() => {
      const tooltipTriggerList = this.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
    });
  }

  #hide() {
    // Dispose tooltips before hiding
    const tooltipTriggerList = this.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
      if (tooltipInstance) {
        tooltipInstance.dispose();
      }
    });

    this.makam = null;
    document.body.style.overflow = "";
    this.requestUpdate();
  }

  #onModalClick(event) {
    if (event.target.classList.contains("modal")) {
      this.#hide();
    }
  }

  #getFullIntervalsString() {
    const mainVariant = this.makam.mainVariant;
    const segments = mainVariant.segments;
    const allIntervals = segments.flatMap((segment) => {
      const makamSegment = MakamSegment.getById(segment.id);
      return makamSegment.getIntervalsBySize(segment.size);
    });

    return allIntervals.join("-");
  }

  #getSegmentSizes() {
    const mainVariant = this.makam.mainVariant;
    const segments = mainVariant.segments;

    const segmentParts = segments.map((segment, index) => {
      const makamSegment = MakamSegment.getById(segment.id);
      const intervals = makamSegment.getIntervalsBySize(segment.size);
      const intervalsString = intervals.join("-");

      const segmentElement = html`<strong
        class="segment-tooltip"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="${intervalsString}"
        style="cursor: help;"
        >${segment.size}x ${makamSegment.name}</strong
      >`;

      return segmentElement;
    });

    return segmentParts.reduce((acc, part, index) => {
      if (index === 0) return part;
      return html`${acc} + ${part}`;
    }, html``);
  }

  #getNoteNameForDegree(degree) {
    const basePosition = this.makam.octavePosition;
    const notePosition = basePosition + degree - 1;
    const octaveStep = Octave.TwoOctaves.steps.find((step) => step.position === notePosition);
    if (!octaveStep) {
      throw new Error(`No octave step found for position ${notePosition}`);
    }

    // Extract note key without octave number (e.g., "C4" -> "C")
    const noteKey = octaveStep.note.match(/^([A-G][#b]?)/)[1];
    const note = new Note(noteKey);
    return `${note.toFullName()} ${octaveStep.label}`;
  }

  #getBaseNoteName() {
    const basePosition = this.makam.octavePosition;
    const octaveStep = Octave.TwoOctaves.steps.find((step) => step.position === basePosition);
    if (!octaveStep) {
      throw new Error(`No octave step found for base position ${basePosition}`);
    }

    // Extract note key without octave number (e.g., "C4" -> "C")
    const noteKey = octaveStep.note.match(/^([A-G][#b]?)/)[1];
    const note = new Note(noteKey);
    return `${note.toFullName()} ${octaveStep.label}`;
  }

  #createDegreeWithTooltip(degree) {
    const noteName = this.#getNoteNameForDegree(degree);
    return html`<strong
      class="degree-tooltip"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title="${noteName}"
      style="cursor: help;"
      >${degree}η</strong
    >`;
  }

  #getLeadingToneInfo() {
    const mainVariant = this.makam.mainVariant;
    const leadingInterval = mainVariant.leadingInterval;

    const basePosition = this.makam.octavePosition;
    const leadingPosition = basePosition - leadingInterval;

    const leadingStep = Octave.TwoOctaves.steps.find((step) => step.position === leadingPosition);

    if (!leadingStep) {
      throw new Error(`No octave step found for leading tone position ${leadingPosition}`);
    }

    // Extract note key
    const leadingNoteKey = leadingStep.note.match(/^([A-G][#b]?)/)[1];
    const note = new Note(leadingNoteKey);
    const noteName = `${note.toFullName()} ${leadingStep.label}`;
    const intervalType = Interval.getLongName(leadingInterval).toLowerCase();

    return { noteName, intervalType };
  }

  #getDescription() {
    const mainVariant = this.makam.mainVariant;
    const intervals = this.#getFullIntervalsString();
    const segmentSizes = this.#getSegmentSizes();
    const baseNoteName = this.#getBaseNoteName();

    const entryNoteElements = mainVariant.entryNotes.map((note, index) => {
      const degree = this.#createDegreeWithTooltip(note);
      return index < mainVariant.entryNotes.length - 1 ? html`${degree} ή ` : degree;
    });
    const endingDegree = this.#createDegreeWithTooltip(mainVariant.endingNote);

    const dominantElements = mainVariant.dominantNotes.map((n, index) => {
      const degree = this.#createDegreeWithTooltip(n);
      return index < mainVariant.dominantNotes.length - 1 ? html`${degree}, ` : html`${degree}`;
    });

    // Calculate notes starting from the base note of the makam
    const segments = mainVariant.segments;
    const allIntervals = segments.flatMap((segment) => {
      const makamSegment = MakamSegment.getById(segment.id);
      return makamSegment.getIntervalsBySize(segment.size);
    });

    // Get the actual base note from octavePosition
    const basePosition = this.makam.octavePosition;
    const octaveStep = Octave.TwoOctaves.steps.find((step) => step.position === basePosition);
    const baseNoteKey = octaveStep.note.match(/^([A-G][#b]?)/)[1];

    const notes = Note.calculateNormalizedNotes(baseNoteKey, allIntervals);
    const notesString = notes.map((noteKey) => new Note(noteKey).toFullName()).join(", ");

    const leadingToneInfo = this.#getLeadingToneInfo();

    const parts = [];
    parts.push(html`<p>Έχει διαστήματα <strong>${intervals}</strong> (${segmentSizes}).</p>`);
    parts.push(html`<p>Θεμελιώνεται στο <strong>${baseNoteName}</strong>.</p>`);
    parts.push(html`<p>Οπότε έχουμε τις νότες <strong>${notesString}</strong>.</p>`);

    if (leadingToneInfo) {
      const leadingToneElement = html`<strong
        class="degree-tooltip"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="${leadingToneInfo.noteName}"
        style="cursor: help;"
        >${leadingToneInfo.intervalType}</strong
      >`;
      parts.push(html`<p>Έχει προσαγωγέα ${leadingToneElement}.</p>`);
    }

    parts.push(
      html`<p>Κάνει είσοδο στην ${entryNoteElements} και καταλήγει στη ${endingDegree} βαθμίδα.</p>`
    );

    parts.push(html`<p>Δεσπόζουσες βαθμίδες: ${dominantElements}.</p>`);
    return parts;
  }

  render() {
    if (!this.makam) {
      return html``;
    }

    const isVisible = !!this.makam;
    const description = this.#getDescription();

    return html`
      <div
        class="modal fade ${isVisible ? "show" : ""}"
        tabindex="-1"
        aria-modal="true"
        style="${isVisible ? "display: block;" : "display: none;"}"
        @click=${this.#onModalClick}
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header d-flex flex-column align-items-center border-0 pb-1 px-3 py-3">
              <h5 class="modal-title fw-bold text-center w-100">${this.makam?.name}</h5>

              <button
                type="button"
                class="btn-close position-absolute end-0 me-2"
                @click="${() => this.#hide()}"
                aria-label="Κλείσιμο"
              ></button>
            </div>

            <div class="modal-body text-start px-3 py-3">${description}</div>
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

customElements.define("makam-details", MakamDetails);
