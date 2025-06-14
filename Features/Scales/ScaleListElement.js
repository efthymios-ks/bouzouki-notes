import { LitElement, html } from "../../Libraries/lit/lit.min.js";
import "./ScaleCardsElement.js";
import { Scale } from "./Scale.js";
import { Note } from "../Notes/Note.js";

export class ScaleList extends LitElement {
  static properties = {};

  #tonic = "D";
  #scales = [];

  constructor() {
    super();

    this.#scales = Scale.getAll(this.#tonic);
  }

  createRenderRoot() {
    return this;
  }

  render() {
    const noteOptions = Note.allNotes
      .map((key) => {
        const note = new Note(key);
        return {
          key: key,
          name: note.name,
          isSelected: key === this.#tonic,
        };
      })
      .map(
        ({ key, name, isSelected }) =>
          html`<option value="${key}" ?selected=${isSelected}>${key} (${name})</option>`
      );

    return html`
      <div
        class="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mb-3"
      >
        <div class="d-flex align-items-center gap-2">
          <label id="tonic-label" for="tonic-select" class="form-label fw-bold mb-0">
            Τονική:
          </label>
          <select
            id="tonic-select"
            class="form-select form-select-sm"
            aria-labelledby="tonic-label"
            @change=${this.#onTonicChange}
            .value=${this.#tonic}
          >
            ${noteOptions}
          </select>
        </div>
      </div>

      <scale-cards id="scale-list" .scales=${this.#scales}></scale-cards>
    `;
  }

  #onTonicChange(e) {
    this.#tonic = e.target.value;
    this.#scales = Scale.getAll(this.#tonic);
    this.requestUpdate();
  }
}

customElements.define("scale-list", ScaleList);
