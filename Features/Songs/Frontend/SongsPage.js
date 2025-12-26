import { LitElement, html } from "../../../Libraries/lit/lit.min.js";
import { Song } from "../Backend/Song.js";
import { Makam } from "../../Makams/Backend/Makam.js";

export class SongsPage extends LitElement {
  static properties = {
    songs: { type: Array },
    filteredSongs: { type: Array },
    nameFilter: { type: String },
    authorFilter: { type: String },
    selectedMakams: { type: Set },
    allMakams: { type: Array },
    allSongNames: { type: Array },
    allAuthors: { type: Array },
    sortColumn: { type: String },
    sortDirection: { type: String },
  };

  constructor() {
    super();
    this.songs = [];
    this.filteredSongs = [];
    this.nameFilter = "";
    this.authorFilter = "";
    this.selectedMakams = new Set();
    this.allMakams = [];
    this.allSongNames = [];
    this.allAuthors = [];
    this.sortColumn = "name";
    this.sortDirection = "asc";
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.#loadData();
  }

  #loadData() {
    this.songs = Song.getAll();
    this.filteredSongs = [...this.songs];

    // Get all unique song names
    this.allSongNames = [...new Set(this.songs.map((song) => song.name))].sort((a, b) =>
      a.localeCompare(b)
    );

    // Get all unique authors
    const authorsSet = new Set();
    this.songs.forEach((song) => {
      song.authors.forEach((author) => authorsSet.add(author));
    });
    this.allAuthors = [...authorsSet].sort((a, b) => a.localeCompare(b));

    // Get all unique makam IDs from songs
    const makamIds = new Set();
    this.songs.forEach((song) => {
      song.makamIds.forEach((id) => makamIds.add(id));
    });

    // Get makam objects
    const allMakams = Makam.getAll();
    this.allMakams = allMakams
      .filter((makam) => makamIds.has(makam.id))
      .sort((a, b) => a.name.localeCompare(b.name));

    this.requestUpdate();
  }

  #findMakamByIdOrVariant(makamId) {
    // First, try to find by top-level makam ID
    const allMakams = Makam.getAll();
    let makam = allMakams.find((m) => m.id === makamId);
    if (makam) return makam;

    // Otherwise, search for variant ID
    makam = allMakams.find((m) => m.variants.some((v) => v.id === makamId));
    return makam || null;
  }

  #applyFilters() {
    let filtered = [...this.songs];

    // Name filter
    if (this.nameFilter.trim()) {
      const searchTerm = this.nameFilter.toLowerCase().trim();
      filtered = filtered.filter((song) => song.name.toLowerCase().includes(searchTerm));
    }

    // Author filter
    if (this.authorFilter.trim()) {
      const searchTerm = this.authorFilter.toLowerCase().trim();
      filtered = filtered.filter((song) =>
        song.authors.some((author) => author.toLowerCase().includes(searchTerm))
      );
    }

    // Makam filter
    if (this.selectedMakams.size > 0) {
      filtered = filtered.filter((song) => song.makamIds.some((id) => this.selectedMakams.has(id)));
    }

    // Apply sorting
    this.#sortSongs(filtered);

    this.filteredSongs = filtered;
    this.requestUpdate();
  }

  #sortSongs(songs) {
    const direction = this.sortDirection === "asc" ? 1 : -1;

    songs.sort((a, b) => {
      let aVal, bVal;

      switch (this.sortColumn) {
        case "name":
          aVal = a.name;
          bVal = b.name;
          break;
        case "author":
          aVal = a.authors[0] || "";
          bVal = b.authors[0] || "";
          break;
        case "makam":
          const aMakam = this.#findMakamByIdOrVariant(a.makamIds[0]);
          const bMakam = this.#findMakamByIdOrVariant(b.makamIds[0]);
          aVal = aMakam ? aMakam.name : "";
          bVal = bMakam ? bMakam.name : "";
          break;
        case "year":
          aVal = a.year || 0;
          bVal = b.year || 0;
          return direction * (aVal - bVal);
        default:
          aVal = a.name;
          bVal = b.name;
      }

      return direction * aVal.localeCompare(bVal);
    });
  }

  #handleSort(column) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }
    this.#applyFilters();
  }

  #handleNameFilterChange(e) {
    this.nameFilter = e.target.value;
    this.#applyFilters();
  }

  #handleAuthorFilterChange(e) {
    this.authorFilter = e.target.value;
    this.#applyFilters();
  }

  #handleMakamToggle(makamId) {
    if (this.selectedMakams.has(makamId)) {
      this.selectedMakams.delete(makamId);
    } else {
      this.selectedMakams.add(makamId);
    }
    this.#applyFilters();
  }

  #clearFilters() {
    this.nameFilter = "";
    this.authorFilter = "";
    this.selectedMakams.clear();
    this.#applyFilters();
  }

  render() {
    return html`
      <div class="container-fluid py-4">
        <!-- Filters -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <!-- Name Filter -->
              <div class="col-md-4">
                <label class="form-label">Όνομα Τραγουδιού</label>
                <input
                  type="text"
                  class="form-control"
                  list="song-names-list"
                  placeholder="Αναζήτηση..."
                  .value=${this.nameFilter}
                  @input=${this.#handleNameFilterChange}
                />
                <datalist id="song-names-list">
                  ${this.allSongNames.map((name) => html`<option value="${name}"></option>`)}
                </datalist>
              </div>

              <!-- Author Filter -->
              <div class="col-md-4">
                <label class="form-label">Συνθέτης</label>
                <input
                  type="text"
                  class="form-control"
                  list="authors-list"
                  placeholder="Αναζήτηση..."
                  .value=${this.authorFilter}
                  @input=${this.#handleAuthorFilterChange}
                />
                <datalist id="authors-list">
                  ${this.allAuthors.map((author) => html`<option value="${author}"></option>`)}
                </datalist>
              </div>

              <!-- Clear Button -->
              <div class="col-md-4 d-flex align-items-end">
                <button class="btn btn-secondary" @click=${this.#clearFilters}>
                  Καθαρισμός Φίλτρων
                </button>
              </div>
            </div>

            <!-- Makam Checkboxes -->
            <div class="row mt-3">
              <div class="col-12">
                <label class="form-label">Μακάμ</label>
                <div class="d-flex flex-wrap gap-2">
                  ${this.allMakams.map(
                    (makam) => html`
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="makam-${makam.id}"
                          .checked=${this.selectedMakams.has(makam.id)}
                          @change=${() => this.#handleMakamToggle(makam.id)}
                        />
                        <label class="form-check-label" for="makam-${makam.id}">
                          ${makam.name}
                        </label>
                      </div>
                    `
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Count -->
        <div class="mb-3">
          <small class="text-muted">
            ${this.filteredSongs.length} τραγούδι${this.filteredSongs.length === 1 ? "" : "α"}
          </small>
        </div>

        ${this.filteredSongs.length === 0
          ? html`
              <div class="alert alert-info">Δεν βρέθηκαν τραγούδια με τα επιλεγμένα φίλτρα.</div>
            `
          : html`
              <!-- Desktop Table View -->
              <div class="table-responsive d-none d-md-block">
                <table class="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th role="button" @click=${() => this.#handleSort("name")}>
                        Τραγούδι
                        ${this.sortColumn === "name"
                          ? html`<i
                              class="bi bi-arrow-${this.sortDirection === "asc" ? "up" : "down"}"
                            ></i>`
                          : ""}
                      </th>
                      <th role="button" @click=${() => this.#handleSort("author")}>
                        Συνθέτης
                        ${this.sortColumn === "author"
                          ? html`<i
                              class="bi bi-arrow-${this.sortDirection === "asc" ? "up" : "down"}"
                            ></i>`
                          : ""}
                      </th>
                      <th role="button" @click=${() => this.#handleSort("makam")}>
                        Μακάμ
                        ${this.sortColumn === "makam"
                          ? html`<i
                              class="bi bi-arrow-${this.sortDirection === "asc" ? "up" : "down"}"
                            ></i>`
                          : ""}
                      </th>
                      <th role="button" @click=${() => this.#handleSort("year")}>
                        Έτος
                        ${this.sortColumn === "year"
                          ? html`<i
                              class="bi bi-arrow-${this.sortDirection === "asc" ? "up" : "down"}"
                            ></i>`
                          : ""}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.filteredSongs.map(
                      (song) => html`
                        <tr>
                          <td>${song.name}</td>
                          <td>${song.authors.join(", ")}</td>
                          <td>
                            ${song.makamIds
                              .map((makamId) => {
                                const makam = this.#findMakamByIdOrVariant(makamId);
                                if (!makam) {
                                  console.warn(`Makam ID not found: ${makamId}`);
                                  return null;
                                }
                                return makam.name;
                              })
                              .filter((name) => name !== null)
                              .join(", ")}
                          </td>
                          <td>${song.year || ""}</td>
                        </tr>
                      `
                    )}
                  </tbody>
                </table>
              </div>

              <!-- Mobile List View -->
              <div class="d-block d-md-none">
                ${this.filteredSongs.map(
                  (song) => html`
                    <div class="card mb-2">
                      <div class="card-body py-2 px-3">
                        <div class="fw-semibold mb-1">${song.name}</div>
                        <div class="small text-muted mb-1">${song.authors.join(", ")}</div>
                        <div class="d-flex justify-content-between align-items-center">
                          <span class="small">
                            ${song.makamIds
                              .map((makamId) => {
                                const makam = this.#findMakamByIdOrVariant(makamId);
                                if (!makam) {
                                  console.warn(`Makam ID not found: ${makamId}`);
                                  return null;
                                }
                                return makam.name;
                              })
                              .filter((name) => name !== null)
                              .join(", ")}
                          </span>
                          ${song.year
                            ? html`<span class="small text-muted">${song.year}</span>`
                            : ""}
                        </div>
                      </div>
                    </div>
                  `
                )}
              </div>
            `}
      </div>
    `;
  }
}

customElements.define("songs-page", SongsPage);
