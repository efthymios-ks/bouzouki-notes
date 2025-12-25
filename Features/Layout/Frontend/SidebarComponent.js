import { LitElement, html } from "../../../Libraries/lit/lit.min.js";

export class SidebarComponent extends LitElement {
  static properties = {
    selected: { type: String },
    menuItems: { type: Array, state: true },
  };

  menuItems = [];

  constructor() {
    super();
    this.#loadMenuItems();
    this.addEventListener("sectionSelected", this.#handleSectionSelected);
  }

  #loadMenuItems() {
    const mainContainer = document.getElementById("main-container");
    if (!mainContainer) return;

    const sections = Array.from(mainContainer.children);
    this.menuItems = sections
      .filter((section) => section.hasAttribute("data-menu-label"))
      .map((section) => ({
        id: section.id,
        label: section.getAttribute("data-menu-label"),
      }));
  }

  #handleSectionSelected = (event) => {
    this.selected = event.detail.section;
  };

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
    const menuItemsHtml = this.menuItems.map(
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

customElements.define("sidebar-component", SidebarComponent);
