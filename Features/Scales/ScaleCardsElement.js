import { LitElement, html } from "../../Libraries/lit/lit.min.js";
import "./ScaleCardElement.js";
import "./ScaleModalElement.js";

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
      (scale) => html`<scale-card-element
        .scale=${scale}
        @onMoreClicked=${() => this.#openModal(scale)}
      ></scale-card-element>`
    );

    return html` 
        <div id="list" class="d-flex flex-wrap justify-content-center gap-3">${scaleCards}</div> 
        <scale-modal-element id="scale-modal"></scale-modal-element>
      </div>
    `;
  }

  #openModal(scale) {
    this.querySelector("#scale-modal").show(scale);
  }
}

customElements.define("scale-cards", ScaleCards);
