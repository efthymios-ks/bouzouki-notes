import { LitElement, html } from "../../../Libraries/lit/lit.min.js";
import { MakamSegment } from "../../MakamSegments/Backend/MakamSegment.js";
import { Octave } from "../../Octaves/Backend/Octave.js";
import { Note } from "../../Notes/Backend/Note.js";
import { Interval } from "../../Intervals/Backend/Interval.js";

export class MakamDetailsShort extends LitElement {
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
      throw new Error("makam parameter is required");
    }

    this.makam = makam;
    document.body.style.overflow = "hidden";
    this.requestUpdate();
    this.updateComplete.then(() => this.#initializeTooltips());
  }

  #hide() {
    this.#disposeTooltips();
    this.makam = null;
    document.body.style.overflow = "";
    this.requestUpdate();
  }

  #initializeTooltips() {
    const tooltipTriggerList = this.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((element) => new bootstrap.Tooltip(element));
  }

  #disposeTooltips() {
    const tooltipTriggerList = this.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((element) => {
      const instance = bootstrap.Tooltip.getInstance(element);
      if (instance) {
        instance.dispose();
      }
    });
  }

  #onModalClick(event) {
    if (event.target.classList.contains("modal")) {
      this.#hide();
    }
  }

  #showFullDetails() {
    const makam = this.makam;
    this.#hide();
    const fullDetails = document.querySelector("makam-details-full");
    if (fullDetails) {
      fullDetails.show(makam);
    }
  }

  #getFullIntervalsString() {
    const mainVariant = this.makam.mainVariant;
    const segments = mainVariant.segments;

    const segmentIntervalElements = segments.map((segment, index) => {
      const makamSegment = MakamSegment.getById(segment.id);
      const intervals = makamSegment.getIntervalsBySize(segment.size);
      const intervalsString = intervals.join("-");

      // Color code first and second segments
      const color = index === 0 ? "text-primary" : index === 1 ? "text-danger" : "";
      const segmentName = `${segment.size}x ${makamSegment.name}`;

      return html`<span
        class="${color}"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="${segmentName}"
        style="cursor: help;"
        >${intervalsString}</span
      >`;
    });

    return segmentIntervalElements.reduce((acc, segmentElement, index) => {
      if (index === 0) {
        return segmentElement;
      }

      return html`${acc}-${segmentElement}`;
    }, html``);
  }

  #createSegmentElement(segment, index) {
    const makamSegment = MakamSegment.getById(segment.id);
    const color = index === 0 ? "text-primary" : index === 1 ? "text-danger" : "";
    const intervalsForTooltip = makamSegment.getIntervalsBySize(segment.size).join("-");

    return html`<strong
      class="${color}"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title="${intervalsForTooltip}"
      style="cursor: help;"
      >${segment.size}x ${makamSegment.name}</strong
    >`;
  }

  #getSegmentComposition() {
    const mainVariant = this.makam.mainVariant;
    const segmentParts = mainVariant.segments.map((segment, index) =>
      this.#createSegmentElement(segment, index)
    );

    return segmentParts.reduce((acc, part, index) => {
      if (index === 0) {
        return html`ένα ${part}`;
      }

      if (index === segmentParts.length - 1) {
        return html`${acc} κι ένα ${part}`;
      }

      return html`${acc}, ένα ${part}`;
    }, html``);
  }

  #calculateNotes() {
    const mainVariant = this.makam.mainVariant;

    // Get all intervals from all segments
    const allIntervals = mainVariant.segments.flatMap((segment) => {
      const makamSegment = MakamSegment.getById(segment.id);
      return makamSegment.getIntervalsBySize(segment.size);
    });

    const basePosition = this.makam.octavePosition;
    const octaveStep = Octave.TwoOctaves.steps.find((step) => step.position === basePosition);
    const baseNoteKey = octaveStep.note.match(/^([A-G][#b]?)/)[1];

    const notes = Note.calculateNormalizedNotes(baseNoteKey, allIntervals);
    return notes.map((noteKey) => new Note(noteKey).toFullName()).join(", ");
  }

  #getEntryNoteElements() {
    const mainVariant = this.makam.mainVariant;
    return mainVariant.entryNotes.map((note, index) => {
      const degree = this.#createDegreeWithTooltip(note);
      if (index === 0) return degree;
      if (index === mainVariant.entryNotes.length - 1) return html` ή την ${degree}`;
      return html`, την ${degree}`;
    });
  }

  #getDominantElements() {
    const mainVariant = this.makam.mainVariant;
    return mainVariant.dominantNotes.map((n, index) => {
      const degree = this.#createDegreeWithTooltip(n);
      if (index === 0) {
        return html` η ${degree}`;
      }
      if (index === mainVariant.dominantNotes.length - 1) {
        return html` και η ${degree}`;
      }
      return html`, η ${degree}`;
    });
  }

  #getDominantLabel() {
    const mainVariant = this.makam.mainVariant;
    return mainVariant.dominantNotes.length === 1
      ? "Δεσπόζουσα βαθμίδα είναι"
      : "Δεσπόζουσες βαθμίδες είναι";
  }

  #getDescription() {
    const mainVariant = this.makam.mainVariant;

    // Get all the pieces we need
    const baseNoteName = this.#getBaseNoteName();
    const segmentComposition = this.#getSegmentComposition();
    const intervals = this.#getFullIntervalsString();
    const notesString = this.#calculateNotes();
    const leadingToneInfo = this.#getLeadingToneInfo();

    const entryNoteElements = this.#getEntryNoteElements();
    const endingDegree = this.#createDegreeWithTooltip(mainVariant.endingNote);
    const dominantElements = this.#getDominantElements();
    const dominantLabel = this.#getDominantLabel();

    const parts = [];

    parts.push(
      html`<p>
        Το μακάμ <strong>${this.makam.name}</strong> θεμελιώνεται στο
        <strong>${baseNoteName}</strong>.
      </p>`
    );
    parts.push(html`<p>Αποτελείται από ${segmentComposition}.</p>`);
    parts.push(html`<p>Έτσι προκύπτουν τα διαστήματά <strong>${intervals}</strong>,</p>`);
    parts.push(html`<p>ή αλλιώς οι νότες <strong>${notesString}</strong>.</p>`);

    if (leadingToneInfo) {
      const leadingToneElement = html`<strong
        class="degree-tooltip"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="${leadingToneInfo.noteName}"
        style="cursor: help;"
        >${leadingToneInfo.intervalType}</strong
      >`;
      parts.push(html`<p>Διαθέτει προσαγωγέα ${leadingToneElement}.</p>`);
    }

    parts.push(html`<p>Η είσοδος της μελωδίας γίνεται στην ${entryNoteElements} βαθμίδα</p>`);
    parts.push(html`<p>και καταλήγει στη ${endingDegree}.</p>`);
    parts.push(html`<p>${dominantLabel} ${dominantElements}.</p>`);

    return parts;
  }

  #getNoteNameForDegree(degree) {
    const basePosition = this.makam.octavePosition;
    const notePosition = basePosition + degree - 1;
    const octaveStep = Octave.TwoOctaves.steps.find((step) => step.position === notePosition);

    if (!octaveStep) {
      throw new Error(`No octave step found for position ${notePosition}`);
    }

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
    const baseStep = Octave.TwoOctaves.steps.find((step) => step.position === basePosition);

    if (!baseStep) {
      throw new Error(`No octave step found for base position ${basePosition}`);
    }

    // Get the base note's semitone value
    const baseNoteKey = baseStep.note.match(/^([A-G][#b]?)/)[1];
    const baseSemitone = Note.getSemitone(baseNoteKey);

    // Calculate the target semitone (going back by leadingInterval semitones)
    const targetSemitone = (baseSemitone - leadingInterval + 12) % 12;

    // Find the octave step that matches this semitone and is below the base position
    const leadingStep = Octave.TwoOctaves.steps.find((step) => {
      const stepNoteKey = step.note.match(/^([A-G][#b]?)/)[1];
      const stepSemitone = Note.getSemitone(stepNoteKey);
      return stepSemitone === targetSemitone && step.position < basePosition;
    });

    if (!leadingStep) {
      throw new Error(`No octave step found for leading tone with semitone ${targetSemitone}`);
    }

    // Build the result
    const leadingNoteKey = leadingStep.note.match(/^([A-G][#b]?)/)[1];
    const note = new Note(leadingNoteKey);
    const noteName = `${note.toFullName()} ${leadingStep.label}`;
    const intervalType = Interval.getLongNameAccusative(leadingInterval).toLowerCase();

    return { noteName, intervalType };
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
            <div
              class="modal-header d-flex align-items-center justify-content-between border-0 py-2 px-3 bg-light"
            >
              <h5 class="modal-title fw-bold mb-0 text-center flex-grow-1">${this.makam.name}</h5>

              <div class="d-flex align-items-center gap-1">
                <button
                  type="button"
                  class="btn btn-link text-dark p-1 lh-1"
                  @click="${() => this.#showFullDetails()}"
                  title="Περισσότερα"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  style="text-decoration: none;"
                >
                  <i class="bi bi-arrows-fullscreen" style="font-size: 1.1rem;"></i>
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

customElements.define("makam-details-short", MakamDetailsShort);
