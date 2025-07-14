import { LitElement, html } from "../../Libraries/lit/lit.min.js";
import "./FretboardElement.js";

export class BouzoukiFretboardElement extends LitElement {
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

    return html`
      <fretboard-element .selectFretFunction=${this.#selectFretFunction}></fretboard-element>
    `;
  }
}

customElements.define("bouzouki-fretboard-element", BouzoukiFretboardElement);
