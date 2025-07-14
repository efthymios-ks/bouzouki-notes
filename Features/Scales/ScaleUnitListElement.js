import { LitElement, html } from "../../Libraries/lit/lit.min.js";
import { ScaleUnit } from "./ScaleUnit.js";
import { Interval } from "../Intervals/Interval.js";

export class ScaleUnitListElement extends LitElement {
  static properties = {};

  #groupedScaleUnits = {};

  constructor() {
    super();

    const allScaleUnits = ScaleUnit.getAll();

    // Group scale units by the number of intervals (length)
    const unitsByLength = allScaleUnits.reduce((result, unit) => {
      const key = unit.intervals.length + 1;
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(unit);
      return result;
    }, {});

    // Convert to array of objects [{ length, units }]
    const groupedArray = Object.entries(unitsByLength).map(([length, units]) => ({
      length: Number(length),
      units,
    }));

    // Sort groups by length descending
    groupedArray.sort((a, b) => b.length - a.length);

    // Sort each group's units by name ascending
    for (const group of groupedArray) {
      group.units.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Store as array
    this.#groupedScaleUnits = groupedArray;
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      ${this.#groupedScaleUnits.map(
        ({ length: noteCount, units }) => html`
          <div class="table-responsive">
            <table class="table table-sm table-bordered table-hover align-middle text-center">
              <caption class="caption-top fw-bold text-center">
                ${noteCount}χορδα
              </caption>
              <thead class="table-light">
                <tr>
                  <th scope="col" class="text-center">Όνομα</th>
                  <th scope="col" class="text-center">Διαστήματα</th>
                </tr>
              </thead>
              <tbody>
                ${units.map((unit) => {
                  const variantNames = unit.variantNames?.length
                    ? html`<div class="text-muted small">${unit.variantNames.join(", ")}</div>`
                    : "";

                  return html`
                    <tr>
                      <td>
                        <div>${unit.name}</div>
                        ${variantNames}
                      </td>
                      <td>${unit.intervals.map(Interval.getName).join(" - ")}</td>
                    </tr>
                  `;
                })}
              </tbody>
            </table>
          </div>
        `
      )}
    `;
  }
}

customElements.define("scale-unit-list-element", ScaleUnitListElement);
