import { LitElement, html } from "../../../Libraries/lit/lit.min.js";
import "./MakamCard.js";
import "./MakamDetails.js";

export class MakamCards extends LitElement {
  static properties = {
    makams: { type: Array },
  };

  constructor() {
    super();
    this.makams = [];
  }

  createRenderRoot() {
    return this;
  }

  render() {
    const makamCards = this.makams.map(
      (makam) => html`<makam-card
        .makam=${makam}
        @onMoreClicked=${() => this.#openModal(makam)}
      ></makam-card>`
    );

    return html`
      <div id="list" class="d-flex flex-wrap justify-content-center gap-3">${makamCards}</div>
      <makam-details id="makam-details"></makam-details>
    `;
  }

  #openModal(makam) {
    this.querySelector("#makam-details").show(makam);
  }
}

customElements.define("makam-cards", MakamCards);
