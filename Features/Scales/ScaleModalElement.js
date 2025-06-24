import { LitElement, html } from "../../Libraries/lit/lit.min.js";
import { Chord } from "../Chords/Chord.js";
import { Note } from "../Notes/Note.js";

export class ScaleModal extends LitElement {
  static properties = {
    scale: { type: Object },
  };

  constructor() {
    super();
    this.scale = null;
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

  renderScaleSlide(scale) {
    const titleWithText = (label, content) => html`
      <div class="mb-2">
        <div class="fw-bold text-start">${label}</div>
        <div class="text-start">${content}</div>
      </div>
    `;

    const otherNamesHtml =
      scale.otherNames?.length > 0
        ? titleWithText("Άλλες ονομασίες:", scale.otherNames.join(", "))
        : "";

    const intervalsHtml = titleWithText("Διαστήματα:", scale.intervals.join("-"));

    const noteBadgesHtml = scale.normalizedNotes.map((noteKey) => {
      const note = new Note(noteKey);
      const isTonic = note.key === scale.tonic;
      const noteBgColor = isTonic ? "bg-info" : "bg-secondary";
      return html`<span class="badge me-1 mb-1 ${noteBgColor}">${note.toPrintableString()}</span>`;
    });
    const notesHtml = titleWithText("Νότες:", noteBadgesHtml);

    let chordsHtml = html``;
    if (scale.chords && scale.chords.chords.length) {
      const chords = scale.chords.chords.map((chord, index) => {
        const transposedChord = Chord.transpose(chord, scale.chords.baseNote, scale.tonic);
        const transposedChordNotes = Chord.getNotes(transposedChord);

        const normalizedChord = scale.normalizeChord(transposedChord);
        const normalizedChordNotes = transposedChordNotes.map((noteKey) => {
          noteKey = scale.normalizeNote(noteKey);
          const transposedChordNote = new Note(noteKey);
          return transposedChordNote.toPrintableString();
        });

        const note = new Note(scale.normalizedNotes[index]);
        return {
          note: note.toPrintableString(),
          chord: Note.toPrintableString(normalizedChord),
          notes: normalizedChordNotes,
        };
      });

      const rows = chords.map(
        ({ note, chord, notes }) => html`
          <tr>
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

      chordsHtml = titleWithText(
        "Εναρμόνιση",
        html`
          <div class="table-responsive mt-2 w-100">
            <table class="table table-sm table-bordered mb-0 text-center">
              <thead>
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
        `
      );
    }

    return html`${otherNamesHtml}${intervalsHtml}${notesHtml}${chordsHtml}`;
  }

  render() {
    if (!this.scale) {
      return html``;
    }

    const isVisible = !!this.scale;
    const variants = this.scale?.variants || [];
    const allScales = this.scale ? [this.scale, ...variants] : [];

    return html`
      <div
        class="modal fade ${isVisible ? "show" : ""}"
        tabindex="-1"
        aria-modal="true"
        style="${isVisible ? "display: block;" : "display: none;"}"
        @click=${this.#onModalClick}
      >
        <div class="modal-dialog modal-dialog-centered modal-lg">
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
              ${variants.length === 0
                ? this.renderScaleSlide(this.scale)
                : html`
                    <div class="accordion" id="scale-accordion">
                      ${allScales.map(
                        (scale, scaleIndex) => html`
                          <div class="accordion-item">
                            <h2 class="accordion-header" id="heading-${scaleIndex}">
                              <button
                                class="accordion-button ${scaleIndex !== 0 ? "collapsed" : ""}"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapse-${scaleIndex}"
                                aria-expanded="${scaleIndex === 0 ? "true" : "false"}"
                                aria-controls="collapse-${scaleIndex}"
                              >
                                ${scaleIndex === 0 ? "Βάση" : scale.name}
                              </button>
                            </h2>
                            <div
                              id="collapse-${scaleIndex}"
                              class="accordion-collapse collapse ${scaleIndex === 0 ? "show" : ""}"
                              aria-labelledby="heading-${scaleIndex}"
                              data-bs-parent="#scale-accordion"
                            >
                              <div class="accordion-body">${this.renderScaleSlide(scale)}</div>
                            </div>
                          </div>
                        `
                      )}
                    </div>
                  `}
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
