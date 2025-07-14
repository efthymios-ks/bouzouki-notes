import { LitElement, html } from "../../Libraries/lit/lit.min.js";

export class SidebarToggleButtonElement extends LitElement {
  createRenderRoot() {
    return this; // Use light DOM so Bootstrap classes apply
  }

  render() {
    return html`
      <button
        class="btn btn-sm btn-outline-primary"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebar"
        aria-controls="sidebar"
      >
        <i class="bi bi-list fs-4"></i>
      </button>
    `;
  }
}

customElements.define("sidebar-toggle-button-element", SidebarToggleButtonElement);
