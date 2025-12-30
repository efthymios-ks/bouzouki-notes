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

  #extractNoteKey(stepNote) {
    return stepNote.match(/^([A-G][#b]?)/)[1];
  }

  #resolveOctave(basePosition, baseKey, targetKey) {
    const baseSemitone = Note.countSemitones(baseKey);
    const targetSemitone = Note.countSemitones(targetKey);

    return Octave.TwoOctaves.steps.find((step) => {
      const key = this.#extractNoteKey(step.note);
      if (key !== targetKey) return false;

      return (
        (step.position === basePosition && targetSemitone < baseSemitone) ||
        (step.position < basePosition && targetSemitone >= baseSemitone)
      );
    });
  }

  #renderSegmentName(segment, omitDegree = false) {
    const intervals = segment.intervals;
    const intervalsAsString = intervals.map((interval) => Interval.getName(interval)).join("-");
    const noteCount = intervals.length + 1;

    const degree = segment.position + 1;
    const degreeLabel = omitDegree ? `${degree}η` : `${degree}η βαθμίδα`;

    const segmentOctaveStep = Octave.TwoOctaves.getStepByPosition(segment.octavePosition);
    const noteKey = segmentOctaveStep.note.match(/^([A-G][#b]?)/)[1];
    const note = new Note(noteKey);
    const degreeNote = `${note.name} ${segmentOctaveStep.label}`;

    return html`
      <strong>
        <span data-bs-toggle="tooltip" title="${intervalsAsString}" style="cursor: help;">
          ${noteCount}x ${segment.name}
        </span>
      </strong>
      ${" στη "}
      <strong>
        <span data-bs-toggle="tooltip" title="${degreeNote}" style="cursor: help;">
          ${degreeLabel}
        </span>
      </strong>
    `;
  }

  #renderSegmentComposition() {
    const mainVariant = this.makam.mainVariant;
    const segments = mainVariant.segments;

    return html`<ul>
      ${segments.map((segment, index) => {
        const isFirst = index === 0;
        const isLast = index === segments.length - 1;
        const prefix = isFirst ? "ένα" : isLast ? "και ένα" : "ένα";

        const part = this.#renderSegmentName(segment, !isFirst);
        const suffix = isLast ? "." : "";

        const extra = isFirst ? " του δρόμου" : "";

        return html`<li>${prefix} ${part}${extra}${suffix}</li>`;
      })}
    </ul>`;
  }

  #renderEntryNotes() {
    const mainVariant = this.makam.mainVariant;
    return mainVariant.entryNotes.map((note, index) => {
      const degree = this.#renderDegreeWithTooltip(note);
      if (index === 0) {
        return degree;
      }

      if (index === mainVariant.entryNotes.length - 1) {
        return html` ή την ${degree}`;
      }

      return html`, την ${degree}`;
    });
  }

  #renderDominantNotes() {
    const mainVariant = this.makam.mainVariant;
    return mainVariant.dominantNotes.map((n, index) => {
      const degree = this.#renderDegreeWithTooltip(n);
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
    const segmentComposition = this.#renderSegmentComposition();
    const intervals = this.makam.mainVariant.intervals
      .map((interval) => Interval.getName(interval))
      .join("-");
    const notesAsString = this.makam.mainVariant.notes.map((note) => note.toFullName()).join(", ");

    const leadingToneInfo = this.#getLeadingToneInfo();
    const leadingToneElement = html`<strong
      class="degree-tooltip"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title="${leadingToneInfo.noteName}"
      style="cursor: help;"
      >${leadingToneInfo.intervalType}</strong
    >`;

    const movementType = this.makam.mainVariant.isAscending ? "ανιούσα" : "κατιούσα";
    const entryNoteElements = this.#renderEntryNotes();
    const endingDegree = this.#renderDegreeWithTooltip(mainVariant.endingNote);
    const dominantElements = this.#renderDominantNotes();
    const dominantLabel = this.#getDominantLabel();

    const parts = [];
    parts.push(
      html`<p>
        Το μακάμ <strong>${this.makam.name}</strong> θεμελιώνεται στο
        <strong>${baseNoteName}</strong> και έχει <strong>${movementType}</strong> κίνηση.
      </p>`
    );
    parts.push(html`<p>Αποτελείται από ${segmentComposition}</p>`);
    parts.push(
      html`<p>
        Έτσι προκύπτουν τα διαστήματά <strong>${intervals}</strong> ή αλλιώς οι νότες
        <strong>${notesAsString}</strong>.
      </p>`
    );
    parts.push(
      html`<p>
        Η είσοδος της μελωδίας γίνεται στην ${entryNoteElements} βαθμίδα και καταλήγει στη
        ${endingDegree}.
      </p>`
    );
    parts.push(
      html`<p>
        Διαθέτει προσαγωγέα ${leadingToneElement} και ${dominantLabel} ${dominantElements}.
      </p>`
    );

    return parts;
  }

  #getNoteNameForDegree(degree) {
    const basePosition = this.makam.octavePosition;
    const notePosition = basePosition + degree - 1;
    const octaveStep = Octave.TwoOctaves.getStepByPosition(notePosition);

    const noteKey = this.#extractNoteKey(octaveStep.note);
    const note = new Note(noteKey);
    return `${note.toFullName()} ${octaveStep.label}`;
  }

  #getBaseNoteName() {
    const octaveStep = Octave.TwoOctaves.getStepByPosition(this.makam.octavePosition);
    const baseNote = this.makam.mainVariant.notes[0].toFullName();
    return `${baseNote} ${octaveStep.label}`;
  }

  #renderDegreeWithTooltip(degree) {
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
    const { leadingInterval } = this.makam.mainVariant;

    const basePosition = this.makam.octavePosition;
    const baseStep = Octave.TwoOctaves.getStepByPosition(basePosition);
    const baseNoteKey = this.#extractNoteKey(baseStep.note);
    const leadingNoteKey = Note.transpose(baseNoteKey, -leadingInterval);
    const leadingNote = new Note(leadingNoteKey);

    const leadingStep = this.#resolveOctave(basePosition, baseNoteKey, leadingNoteKey);

    const intervalType = Interval.getLongNameAccusative(leadingInterval).toLowerCase();
    const noteName = leadingStep
      ? `${leadingNote.toFullName()} ${leadingStep.label}`
      : leadingNote.toFullName();

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
