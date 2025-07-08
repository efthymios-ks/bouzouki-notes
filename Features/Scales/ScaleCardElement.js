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
      const colorClass = isTonic ? "bg-info" : "bg-secondary";
      return html`<span class="badge me-1 mb-1 ${colorClass}">${noteName}</span>`;
    });

    return html`
      <div
        class="d-flex flex-column justify-content-between border border-secondary rounded p-3 shadow-sm position-relative"
        style="min-width: 20rem;"
      >
        <div>
          <h5 class="fw-bold mb-1">${this.scale.name}</h5>
          <div class="fw-semibold mb-2">
            <strong>Διαστήματα:</strong> ${this.scale.intervalsAsNames.join("-")}
          </div>
          <div class="mb-2">${notesHtml}</div>
        </div>

        <div class="mt-2 text-center">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
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
