import { LitElement, html } from "../../../Libraries/lit/lit.min.js";
import "./ScaleCard.js";
import "./ScaleModal.js";

export class ScaleCards extends LitElement {
  static properties = {
    tonic: { type: String },
    scales: { type: Array },
  };

  constructor() {
    super();
    this.scales = [];
  }

  createRenderRoot() {
    return this;
  }

  render() {
    const scaleCards = this.scales.map(
      (scale) => html`<scale-card
        .scale=${scale}
        @onMoreClicked=${() => this.#openModal(scale)}
      ></scale-card>`
    );

    return html` 
        <div id="list" class="d-flex flex-wrap justify-content-center gap-3">${scaleCards}</div> 
        <scale-modal id="scale-modal"></scale-modal>
      </div>
    `;
  }

  #openModal(scale) {
    this.querySelector("#scale-modal").show(scale);
  }
}

customElements.define("scale-cards", ScaleCards);
