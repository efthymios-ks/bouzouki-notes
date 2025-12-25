import { LitElement, html } from "../../../Libraries/lit/lit.min.js";
import { Chord } from "../../Chords/Backend/Chord.js";
import { Note } from "../../Notes/Backend/Note.js";

export class ScaleModal extends LitElement {
  static properties = {
    scale: { type: Object },
  };

  constructor() {
    super();
    this.scale = null;

    this.selectFretFunction = (stringNumber, stringNote, fretNumber, fretNote) => {
      return this.scale.notes.includes(fretNote);
    };
  }

  createRenderRoot() {
    return this;
  }

  show(scale) {
    if (!scale) {
      throw new Error("ScaleModal: scale parameter is required");
    }

    this.scale = scale;
    document.body.style.overflow = "hidden";
    this.requestUpdate();
  }

  render() {
    if (!this.scale) {
      return html``;
    }

    const isVisible = !!this.scale;
    const scaleVariants = this.scale ? this.scale.variants : [];
    const isSingleScale = scaleVariants.length === 1;
    const renderSingleScale = () => {
      return html`<div class="text-center">${this.renderScaleSlide(scaleVariants[0])}</div> `;
    };

    const renderMultipleScales = () => {
      const renderTabsHeader = () =>
        scaleVariants.map(
          (scaleVariant, scaleIndex) => html`
            <li class="nav-item" role="presentation">
              <button
                id="tab-${scaleIndex}"
                class="nav-link ${scaleIndex === 0 ? "active" : ""}"
                data-bs-toggle="tab"
                data-bs-target="#tab-pane-${scaleIndex}"
                type="button"
                role="tab"
                aria-controls="tab-pane-${scaleIndex}"
                aria-selected="${scaleIndex === 0 ? "true" : "false"}"
              >
                ${scaleVariant.name}
              </button>
            </li>
          `
        );

      const renderTabsContent = () =>
        scaleVariants.map((scaleVariant, scaleIndex) => {
          const isActiveClass = scaleIndex === 0 ? "show active" : "";
          return html`
            <div
              id="tab-pane-${scaleIndex}"
              class="tab-pane fade ${isActiveClass}"
              role="tabpanel"
              aria-labelledby="tab-${scaleIndex}"
              tabindex="0"
            >
              ${this.renderScaleSlide(scaleVariant)}
            </div>
          `;
        });

      return html`
        <div>
          <ul id="scale-tabs" class="nav nav-tabs" role="tablist">
            ${renderTabsHeader()}
          </ul>

          <div id="scale-tab-content" class="tab-content mt-3">${renderTabsContent()}</div>
        </div>
      `;
    };

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
              <h5 class="modal-title fw-bold text-center w-100" id="scale-modal-label">
                ${this.scale?.name}
              </h5>

              <button
                type="button"
                class="btn-close position-absolute end-0 me-2"
                @click="${() => this.#hide()}"
                aria-label="Κλείσιμο"
              ></button>
            </div>

            <div class="modal-body text-start px-3 py-3">
              ${isSingleScale ? renderSingleScale() : renderMultipleScales()}
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

  renderScaleSlide(scaleVariant) {
    const titleWithText = (label, content) => html`
      <div>
        <div class="fw-bold text-start">${label}</div>
        <div class="text-start">${content}</div>
      </div>
    `;

    const otherNamesHtml = () => {
      if (!scaleVariant.otherNames || scaleVariant.otherNames.length === 0) {
        return "";
      }

      return titleWithText("Άλλες ονομασίες:", scaleVariant.otherNames.join(", "));
    };

    const intervalsHtml = () => {
      const allIntervals = scaleVariant.intervalsAsNames;
      const leftUnitIntervals =
        scaleVariant.units.length > 0 ? scaleVariant.units[0].intervalNames : [];
      const rightUnitIntervals =
        scaleVariant.units.length > 1
          ? scaleVariant.units[scaleVariant.units.length - 1].intervalNames
          : [];

      // Count how many intervals from the left match first unit's intervals
      let leftHighlightCount = 0;
      for (
        let intervalIndex = 0;
        intervalIndex < leftUnitIntervals.length && intervalIndex < allIntervals.length;
        intervalIndex++
      ) {
        if (allIntervals[intervalIndex] === leftUnitIntervals[intervalIndex]) leftHighlightCount++;
        else break;
      }

      // Count how many intervals from the right match last unit's intervals
      let rightHighlightCount = 0;
      for (let i = 0; i < rightUnitIntervals.length && i < allIntervals.length; i++) {
        if (
          allIntervals[allIntervals.length - 1 - i] ===
          rightUnitIntervals[rightUnitIntervals.length - 1 - i]
        )
          rightHighlightCount++;
        else break;
      }

      const leftColor = "primary";
      const rightColor = "success";

      // Print intervals with highlights for left and right units
      const getIntervalClasses = (color) => `border-bottom border-2 border-${color} text-${color}`;
      const leftIntervalClasses = getIntervalClasses(leftColor);
      const rightIntervalClasses = getIntervalClasses(rightColor);
      const intervalsSpans = allIntervals.map((interval, intervalIndex) => {
        let classes = "d-inline-block me-0 px-2";

        // Left intervals
        if (intervalIndex < leftHighlightCount) {
          classes += ` ${leftIntervalClasses}`;
        }

        // Right intervals
        if (intervalIndex >= allIntervals.length - rightHighlightCount) {
          classes += ` ${rightIntervalClasses}`;
        }

        return html`<span class="${classes}">${interval}</span>`;
      });

      // Unit names to display under intervals
      const leftUnitName = scaleVariant.units.length > 0 ? scaleVariant.units[0].fullName : "";
      const rightUnitName =
        scaleVariant.units.length > 1
          ? scaleVariant.units[scaleVariant.units.length - 1].fullName
          : "";

      // Table
      // Row 1: Highlighted intervals
      // Row 2: Unit names
      return html`
        <div>
          <div class="text-start"><strong>Διαστήματα:</strong></div>
          <table class="table table-sm mb-0" style="width: max-content;">
            <tbody>
              <tr>
                <td colspan="2" class="border-0 pb-0" style="line-height: 1;">${intervalsSpans}</td>
              </tr>
              <tr>
                <td class="border-0 text-${leftColor}">${leftUnitName}</td>
                <td class="border-0 text-${rightColor}">${rightUnitName}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    };

    const notesHtml = () => {
      const noteBadgesHtml = scaleVariant.normalizedNotes.map((noteKey) => {
        const note = new Note(noteKey);
        const isTonic = note.key === scaleVariant.tonic;
        const noteBackgroundColor = isTonic ? "bg-info" : "bg-secondary";

        return html`<span class="badge me-1 mb-1 ${noteBackgroundColor}"
          >${note.toPrintableString()}</span
        >`;
      });

      return titleWithText("Νότες:", noteBadgesHtml);
    };

    const chordsHtml = () => {
      if (!(scaleVariant.chords && scaleVariant.chords.chords.length)) {
        return html``;
      }

      const chords = scaleVariant.chords.chords.map((chord, index) => {
        const transposedChord = Chord.transpose(
          chord,
          scaleVariant.chords.baseNote,
          scaleVariant.tonic
        );

        const transposedChordNotes = Chord.getNotes(transposedChord);

        const normalizedChord = scaleVariant.normalizeChord(transposedChord);
        const normalizedChordNotes = transposedChordNotes.map((noteKey) => {
          noteKey = scaleVariant.normalizeNote(noteKey);
          const transposedChordNote = new Note(noteKey);
          return transposedChordNote.toPrintableString();
        });

        const note = new Note(scaleVariant.normalizedNotes[index]);

        const transposedChordNotesNotInScale = transposedChordNotes.some(
          (transposedChordNote) => !scaleVariant.notes.includes(transposedChordNote)
        );

        return {
          note: note.toPrintableString(),
          chord: Note.toPrintableString(normalizedChord),
          notes: normalizedChordNotes,
          invalid: transposedChordNotesNotInScale,
        };
      });

      const rows = chords.map(
        ({ note, chord, notes, invalid }) => html`
          <tr class="${invalid ? "table-danger" : ""}">
            <td>${note}</td>
            <td>${chord}</td>
            <td>
              <div class="d-flex flex-row justify-content-around">
                ${notes.map((note) => html`<span>${note}</span>`)}
              </div>
            </td>
          </tr>
        `
      );

      return html`
        <div class="table-responsive">
          <table class="table table-sm table-bordered table-hover align-middle text-center">
            <caption class="caption-top fw-bold text-center">
              Συγχορδίες
            </caption>
            <thead class="table-light">
              <tr>
                <th class="text-center">Νότα</th>
                <th class="text-center" colspan="2">Συγχορδία</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      `;
    };

    return html`<div class="d-flex flex-column gap-3">
      ${otherNamesHtml()}${intervalsHtml()}${notesHtml()}${chordsHtml()}
    </div>`;
  }

  #onModalClick(e) {
    if (e.target.classList.contains("modal")) {
      this.#hide();
    }
  }

  #hide() {
    const modal = this.querySelector(".modal");
    const backdrop = this.querySelector(".modal-backdrop");

    if (modal && backdrop) {
      modal.classList.remove("show");
      backdrop.classList.remove("show");

      setTimeout(() => {
        this.scale = null;
        document.body.style.overflow = "";
        this.requestUpdate();
      }, 150);
    } else {
      this.scale = null;
      document.body.style.overflow = "";
      this.requestUpdate();
    }
  }
}

customElements.define("scale-modal", ScaleModal);
