import { LitElement, html } from "../../Libraries/lit/lit.min.js";
import { Note } from "../Notes/Note.js";

export class ScaleCard extends LitElement {
  static properties = {
    scale: { type: Object },
  };

  constructor() {
    super();
    this.scale = null;
  }

  createRenderRoot() {
    // Disable Shadow DOM, styles apply normally
    return this;
  }

  onMoreClick() {
    this.dispatchEvent(
      new CustomEvent("onMoreClicked", {
        detail: { scale: this.scale },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const notesHtml = this.scale.normalizedNotes.map((noteKey) => {
      const note = new Note(noteKey);
      const isTonic = note.key === this.scale.tonic;
      const noteName = note.toPrintableString();
      const colorClass = isTonic ? "bg-info text-dark" : "bg-secondary";
      return html`<span class="badge ${colorClass} me-1 mb-1">${noteName}</span>`;
    });

    return html`
      <div
        class="card shadow-sm border border-1 border-secondary-subtle text-center"
        style="min-width: 20rem;"
      >
        <div class="card-header bg-light fw-bold py-1">${this.scale.name}</div>

        <div class="card-body d-flex flex-column align-items-center justify-content-between gap-2">
          <p class="card-subtitle text-body-secondary">
            <strong>Διαστήματα:</strong> ${this.scale.intervalsAsNames.join("-")}
          </p>

          <div>${notesHtml}</div>
        </div>

        <div class="card-footer text-center bg-light py-2">
          <button
            type="button"
            class="btn btn-outline-secondary btn-sm border-0"
            @click="${this.onMoreClick}"
          >
            Περισσότερα
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define("scale-card", ScaleCard);
