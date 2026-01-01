import { LitElement, html } from "../../../Libraries/lit/lit.min.js";
import { Interval } from "../../Intervals/Backend/Interval.js";

export class MakamCard extends LitElement {
  static properties = {
    makam: { type: Object },
  };

  constructor() {
    super();
    this.makam = null;
  }

  createRenderRoot() {
    return this;
  }

  onMoreClick() {
    this.dispatchEvent(
      new CustomEvent("onMoreClicked", {
        detail: { makam: this.makam },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.makam) {
      throw new Error("makam property is required");
    }

    const makamName = this.makam.name;
    const intervals = this.makam.mainVariant.intervals
      .map((interval) => Interval.getName(interval))
      .join("-");

    return html`
      <div
        class="card shadow-sm border border-1 border-secondary-subtle text-center"
        style="min-width: 15rem;"
      >
        <div class="card-header bg-light fw-bold py-1">${makamName}</div>

        <div class="card-body d-flex flex-column align-items-center justify-content-between gap-2">
          <p class="card-text text-body-secondary mb-0">
            <strong>Διαστήματα:</strong> ${intervals}
          </p>
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

customElements.define("makam-card", MakamCard);
