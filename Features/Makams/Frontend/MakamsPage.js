import { LitElement, html } from "../../../Libraries/lit/lit.min.js";
import "./MakamCards.js";
import { Makam } from "../Backend/Makam.js";

export class MakamsPage extends LitElement {
  static properties = {};

  #makams = [];

  constructor() {
    super();
    this.#makams = Makam.getAll();
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html` <makam-cards id="makams-page" .makams=${this.#makams}></makam-cards> `;
  }
}

customElements.define("makams-page", MakamsPage);
