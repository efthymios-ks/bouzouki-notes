import { LitElement, html } from "../../Libraries/lit/lit.min.js";
import { Note } from "../Notes/Note.js";
import "../Fretboards/FretboardElement.js";

export class ScaleFretboardOffCanvasElement extends LitElement {
  static properties = {
    scale: { type: Object },
  };

  #selectFretFunction;

  constructor() {
    super();
    this.scale = null;

    this.#selectFretFunction = (stringNumber, stringNote, fretNumber, fretNote) => {
      if (!this.scale || !this.scale.notes) {
        return false;
      }

      return this.scale.notes.includes(fretNote);
    };
  }

  createRenderRoot() {
    return this;
  }

  render() {
    if (!this.scale) {
      return html``;
    }

    const id = `scale-fretboard-offcanvas-${this.scale.name.replace(/\s+/g, "-")}`;
    const title = `${this.scale.name} από ${this.scale.tonic}`;

    return html`
      <div>
        <button
          class="btn btn-primary mt-3"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#${id}"
          aria-controls="${id}"
        >
          Ταστιέρα
        </button>

        <div id="${id}" class="offcanvas offcanvas-top" tabindex="-1" style="height: 100vh;">
          <div class="offcanvas-header">
            <div class="d-flex flex-row justify-content-center align-items-center w-100">
              <div class="ms-auto">
                <h5 class="fw-bold">${title}</h5>
              </div>

              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
          </div>

          <div class="offcanvas-body overflow-auto p-3">
            <fretboard-element .selectFretFunction=${this.#selectFretFunction}></fretboard-element>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("scale-fretboard-offcanvas", ScaleFretboardOffCanvasElement);
