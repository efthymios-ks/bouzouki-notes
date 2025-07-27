import { LitElement, html } from "../../Libraries/lit/lit.min.js";

export class SidebarElement extends LitElement {
  static properties = {
    selected: { type: String },
  };

  static #menuItems = Object.freeze([
    { id: "scales-list-container", label: "Δρόμοι" },
    { id: "scale-finder-container", label: "Βρες το δρόμο" },
    { id: "bouzouki-fretboard-container", label: "Ταστιέρα" },
    { id: "metronome-container", label: "Μετρονόμος" },
    { id: "rhythms-container", label: "Ρυθμοί" },
    { id: "scales-theory-container", label: " Θεωρία" },
    { id: "about-container", label: "Σχετικά" },
  ]);

  constructor() {
    super();
    this.selected = "scales-list-container";
  }

  createRenderRoot() {
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
    const menuItemsHtml = SidebarElement.#menuItems.map(
      (item) => html`
        <li class="nav-item">
          <a
            href="#"
            class="nav-link ${this.selected === item.id ? "active" : ""}"
            data-section="${item.id}"
            data-bs-dismiss="offcanvas"
            @click=${this.handleClick}
          >
            ${item.label}
          </a>
        </li>
      `
    );

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
            ${menuItemsHtml}
          </ul>
        </div>
      </div>
    `;
  }
}

customElements.define("sidebar-element", SidebarElement);
