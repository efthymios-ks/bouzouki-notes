import { LitElement, html } from "../../Libraries/lit/lit.min.js";

export class SidebarElement extends LitElement {
  static properties = {
    selected: { type: String },
  };

  constructor() {
    super();
    this.selected = "scales-list-container";
  }

  createRenderRoot() {
    // Use light DOM for Bootstrap compatibility
    return this;
  }

  handleClick(event) {
    const sectionId = event.currentTarget.dataset.section;
    const title = event.currentTarget.textContent.trim();
    this.selected = sectionId;

    this.dispatchEvent(
      new CustomEvent("sectionSelected", {
        detail: { section: sectionId, title },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div
        class="offcanvas offcanvas-start"
        tabindex="-1"
        id="sidebar"
        aria-labelledby="sidebarLabel"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="sidebarLabel">Μενού</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body p-0">
          <ul class="nav flex-column nav-pills">
            <li class="nav-item">
              <a
                href="#"
                class="nav-link ${this.selected === "scales-list-container" ? "active" : ""}"
                data-section="scales-list-container"
                data-bs-dismiss="offcanvas"
                @click=${this.handleClick}
              >
                Δρόμοι
              </a>
            </li>
            <li class="nav-item">
              <a
                href="#"
                class="nav-link ${this.selected === "scale-finder-container" ? "active" : ""}"
                data-section="scale-finder-container"
                data-bs-dismiss="offcanvas"
                @click=${this.handleClick}
              >
                Βρες το δρόμο
              </a>
            </li>
            <li class="nav-item">
              <a
                href="#"
                class="nav-link ${this.selected === "metronome-container" ? "active" : ""}"
                data-section="metronome-container"
                data-bs-dismiss="offcanvas"
                @click=${this.handleClick}
              >
                Μετρονόμος
              </a>
            </li>
          </ul>
        </div>
      </div>
    `;
  }
}

customElements.define("sidebar-element", SidebarElement);
