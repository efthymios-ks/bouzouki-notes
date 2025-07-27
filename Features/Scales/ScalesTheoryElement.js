import { LitElement, html } from "../../Libraries/lit/lit.min.js";
import { ScaleUnit } from "./ScaleUnit.js";
import { Interval } from "../Intervals/Interval.js";

export class ScalesTheoryElement extends LitElement {
  #groupedScaleUnits = {};

  constructor() {
    super();

    this.#groupedScaleUnits = this.#getGroupedScaleUnits();
  }

  createRenderRoot() {
    // Disable Shadow DOM, styles apply normally
    return this;
  }

  renderRow(htmlContent) {
    return this.renderRowWithTitle("", htmlContent);
  }

  renderRowWithTitle(title, htmlContent) {
    const titleHtml =
      title && title.trim().length > 0 ? html`<h3 class="text-center">${title}</h3>` : "";

    return html`
      <div class="row mb-3">
        <div class="col-12 col-lg-6 offset-lg-3">
          ${titleHtml} ${htmlContent}
          <hr />
        </div>
      </div>
    `;
  }

  renderPentaxordaTetraxorda() {
    return this.renderRowWithTitle(
      "Πεντάχορδα / Τετράχορδα",
      html`<ul>
        <li>
          Κάθε δρόμος αποτελείται από την ένωση ενός πενταχόρδου και ενός τετραχόρδου ή από δύο
          τετράχορδα.
        </li>

        <li>
          Οι συγκεκριμένες δομές αποτελούνται αντίστοιχα από τέσσερις ή πέντε διαδοχικές νότες.
        </li>

        <li>Το τετράχορδο έχει έκταση 4ης καθαρής (2Τ+Η), ενώ το πεντάχορδο 5ης καθαρής (3Τ+Η).</li>
      </ul>`
    );
  }

  renderListaTetraxordon() {
    return this.renderRowWithTitle("Λίστες", html`<div>${this.#getScaleUnitsTableHtml()}</div>`);
  }

  renderMetatropi() {
    const pinakasHtml = html`<table class="table table-sm table-hover text-center">
      <caption class="caption-top text-center">
        Εξαιρέσεις
      </caption>

      <tbody>
        ${ScaleUnit.getAll()
          .filter(
            (unit) => unit.intervals.length === 4 && unit.intervals[unit.intervals.length - 1] !== 2
          )
          .map(
            (unit) => html`
              <tr>
                <td><strong>${unit.name}</strong></td>
                ${unit.intervals.map((interval) => html`<td>${Interval.getName(interval)}</td>`)}
              </tr>
            `
          )}
      </tbody>
    </table>`;

    return this.renderRowWithTitle(
      "Μετατροπή",
      html`<ul>
        <li>Αν προσθέσουμε ένα τόνο σε ένα τετράχορδο δημιουργούμε το αντίστοιχο πεντάχορδο.</li>

        <li>
          Αντίστροφα, αν ένα πεντάχορδο τελειώνει σε τόνο και τον αφαιρέσουμε, προκύπτει το
          αντίστοιχο τετράχορδο.
        </li>

        <li>Εξαιρέσεις αποτελούν τα πεντάχορδα που δεν καταλήγουν σε τόνο.</li>

        ${pinakasHtml}
      </ul>`
    );
  }

  renderIsokratima() {
    return this.renderRowWithTitle(
      "Ισοκράτημα",
      html`<ul>
        <li>
          Το ισοκράτημα είναι ένας σταθερός φθόγγος που κρατιέται συνεχώς στο υπόβαθρο μιας μουσικής
          εκτέλεσης, ενώ η μελωδία κινείται πάνω του.
        </li>
        <li>Λειτουργεί σαν στήριγμα για τη μελωδία.</li>
        <li>
          Με την παραδοσιακή του έννοια είναι μια σταθερή μονόφωνη νότα. Δεν συνοδεύει αρμονικά,
          αλλά τονικά.
        </li>
        <li>Σε πιο σύγχρονα πλαίσια διαφοροποιείται και μπορεί να μοιάζει με συγχορδία.</li>
      </ul>`
    );
  }

  renderToniki() {
    return this.renderRowWithTitle(
      "Τονική",
      html`<ul>
        <li>Τονική, βάση, Durak (Ντουράκ)</li>
        <li>Είναι μία και μοναδική ανά μακάμ.</li>
        <li>Είναι η αφετηρία του μακαμιού και βρίσκεται στο χαμηλότερο μέρος του.</li>
        <li>Πάνω της χτίζεται η κλίμακα του μακαμιού.</li>
        <li>Η μελωδία ξεκινάει ή τελειώνει σ' αυτήν.</li>
        <li>Συνυπάρχει με το ισοκράτημα.</li>
      </ul>`
    );
  }

  renderDespozonFthoggos() {
    return this.renderRowWithTitle(
      "Δεσπόζων φθόγγος",
      html`<ul>
        <li>Δεσπόζων, ισχυρός, κυρίαρχος, Güçlü (Γκιουτσλού)</li>
        <li>
          Σχεδόν πάντα υπάρχει ένας ανά μακάμ. Σε κάποιες περιπτώσεις μπορεί να εμφανισθεί και
          δευτερεύων.
        </li>
        <li>Είναι ένα κέντρο βάρους του μακαμιού.</li>
        <li>
          Είναι φθόγγος <b>που συχνά</b>:
          <ul>
            <li>"ξεκουράζεται" η μελωδία</li>
            <li>καταλήγουν πολλές φράσεις</li>
            <li>ξεκινά ή τελειώνει το κομμάτι</li>
            <li>κρατάει το ισοκράτημα</li>
          </ul>
        </li>
      </ul>`
    );
  }

  renderFthoggosElxis() {
    return this.renderRowWithTitle(
      "Φθόγγος έλξης",
      html`<ul>
        <li>Ο φθόγγος έλξης "τραβάει" την μελωδία προς αυτόν.</li>
        <li>Δημιουργεί μελωδική ένταση και κατεύθυνση.</li>
        <li>Προσελκύει τις γειτονικές νότες.</li>
        <li>Βοηθάει στην διαμόρφωση του χαρακτήρα και τους ύφους του μακαμιού.</li>
        <li>Μπορεί να είναι πάνω ή κάτω από δεσπόζονα ή την τονική.</li>
        <li>Συνδέεται με τα "στολίδια" ή "γλιστρήματα" στη μελωδία.</li>
        <li>Λειτουργεί μελωδικά, όχι θεμελιακά.</li>
        <li>Μπορεί να υπάρχουν περισσότεροι από ένας φθόγγοι έλξης.</li>
      </ul>`
    );
  }

  renderProtiVathmida() {
    return this.renderRowWithTitle(
      "1η βαθμίδα",
      html`<ul>
        <li>Ο πρώτος φθόγγος του τετραχόρδου ή αλλιώς η <strong>βάση</strong> του.</li>
        <li>Βάση ενός δρόμου είναι η βάση του πρώτου τετραχόρδου.</li>
      </ul>`
    );
  }

  renderDefterevontaVathmida() {
    const tetraxordaMeFthoggoElxis = ScaleUnit.getAll()
      .filter((unit) => unit.intervals.length === 4 && unit.intervals[0] === 1)
      .slice(0, 2);

    const tetraxordaXorisFthoggoElxis = ScaleUnit.getAll()
      .filter((unit) => unit.intervals.length === 4 && unit.intervals[0] !== 1)
      .slice(0, 1);

    const htmlTable = html`
      <table class="table table-sm table-hover text-center">
        <tbody>
          ${tetraxordaMeFthoggoElxis.map(
            (unit) => html`
              <tr>
                <td class="table-primary">✔️</td>

                <td class="table-primary">
                  <strong>${unit.fullName}</strong>
                </td>
                ${unit.intervals.map(
                  (interval, index) => html`
                    <td class=${index === 0 ? "table-primary" : ""}>
                      ${Interval.getName(interval)}
                    </td>
                  `
                )}
              </tr>
            `
          )}
          ${tetraxordaXorisFthoggoElxis.map(
            (unit) => html`
              <tr>
                <td class="table-secondary">❌</td>

                <td class="table-secondary"><strong>${unit.fullName}</strong></td>

                ${unit.intervals.map(
                  (interval, index) => html`
                    <td class=${index === 0 ? "table-secondary" : ""}>
                      ${Interval.getName(interval)}
                    </td>
                  `
                )}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;

    return this.renderRowWithTitle(
      "2η βαθμίδα",
      html`<ul>
        <li>
          Αν η δεύτερη βαθμίδα ενός τετραχόρδου απέχει διάστημα 2ας μικρό (Η) από τη βάση,
          ονομάζεται <strong>φθόγγος έλξης</strong>.
        </li>
        <li>
          Σε έναν δρόμο μπορούμε να έχουμε, αλλά όχι απαραίτητα, και κύριο και δευτερεύον φθόγγο
          έλξης. Ανάλογα το κύριο και το δευτερεύον τετράχορδο.
        </li>

        ${htmlTable}
      </ul>`
    );
  }

  renderTritiVathmida() {
    const minoreTetraxorda = ScaleUnit.getAll()
      .filter((unit) => unit.intervals.length === 4 && unit.intervals[0] + unit.intervals[1] === 3)
      .slice(0, 2);

    const matzoreTetraxorda = ScaleUnit.getAll()
      .filter((unit) => unit.intervals.length === 4 && unit.intervals[0] + unit.intervals[1] === 4)
      .slice(0, 2);

    const htmlTable = html`<table class="table table-sm table-hover text-center">
      <tbody>
        ${minoreTetraxorda.map(
          (unit) => html`
            <tr>
              <td class="table-primary">
                <strong>Μινόρε</strong>
              </td>

              <td class="table-primary">
                <strong>${unit.fullName}</strong>
              </td>

              ${unit.intervals.map(
                (interval, index) => html`
                  <td class=${index <= 1 ? "table-primary" : ""}>${Interval.getName(interval)}</td>
                `
              )}
            </tr>
          `
        )}
        ${matzoreTetraxorda.map(
          (unit) => html`
            <tr>
              <td class="table-secondary">
                <strong>Ματζόρε</strong>
              </td>

              <td class="table-secondary">
                <strong>${unit.fullName}</strong>
              </td>

              ${unit.intervals.map(
                (interval, index) => html`
                  <td class=${index <= 1 ? "table-secondary" : ""}>
                    ${Interval.getName(interval)}
                  </td>
                `
              )}
            </tr>
          `
        )}
      </tbody>
    </table>`;

    return this.renderRowWithTitle(
      "3η βαθμίδα",
      html`<ul>
        <li>
          Ο τρίτος φθόγγος του τετραχόρδου είναι ο
          <strong>χαρακτηριστικός φθόγγος</strong> του.
        </li>

        <li>
          Η τρίτη βαθμίδα καθορίζει αν το τετράχορδο είναι <strong>μινόρε</strong> ή
          <strong>ματζόρε</strong>.
        </li>

        <li>
          Αν απέχει από τη βάση διάστημα 3ης μικρης (Τ+Η), το τετράχορδο είναι
          <strong>μινόρε</strong>.
        </li>

        <li>Αν πρόκειται για 3ης μεγάλης (2Τ), τότε είναι <strong>ματζόρε</strong>.</li>

        ${htmlTable}
      </ul>`
    );
  }

  renderTetartiVathmida() {
    const tetraxordaMeFthoggoElxisElatomenis = ScaleUnit.getAll()
      .filter(
        (unit) =>
          unit.intervals.length === 4 &&
          unit.intervals[0] + unit.intervals[1] + unit.intervals[2] === 4
      )
      .slice(0, 1);

    const tetraxordaMeDespozonFthoggo = ScaleUnit.getAll()
      .filter(
        (unit) =>
          unit.intervals.length === 4 &&
          unit.intervals[0] + unit.intervals[1] + unit.intervals[2] === 5
      )
      .slice(0, 1);

    const tetraxordaMeFthoggoElxisAuximenis = ScaleUnit.getAll()
      .filter(
        (unit) =>
          unit.intervals.length === 4 &&
          unit.intervals[0] + unit.intervals[1] + unit.intervals[2] === 6
      )
      .slice(0, 1);

    const htmlTable = html` <table class="table table-sm table-hover text-center">
      <tbody>
        ${tetraxordaMeFthoggoElxisElatomenis.map(
          (unit) => html`
            <tr>
              <td class="table-secondary">
                <strong>Φθόγγος έλξης</strong>
              </td>

              <td class="table-secondary">
                <strong>${unit.fullName}</strong>
              </td>

              ${unit.intervals.map(
                (interval, index) => html`
                  <td class=${index <= 2 ? "table-secondary" : ""}>
                    ${Interval.getName(interval)}
                  </td>
                `
              )}
            </tr>
          `
        )}
        ${tetraxordaMeDespozonFthoggo.map(
          (unit) => html`
            <tr>
              <td class="table-primary">
                <strong>Δεσπόζων φθόγγος</strong>
              </td>

              <td class="table-primary">
                <strong>${unit.fullName}</strong>
              </td>

              ${unit.intervals.map(
                (interval, index) => html`
                  <td class=${index <= 2 ? "table-primary" : ""}>${Interval.getName(interval)}</td>
                `
              )}
            </tr>
          `
        )}
        ${tetraxordaMeFthoggoElxisAuximenis.map(
          (unit) => html`
            <tr>
              <td class="table-secondary">
                <strong>Φθόγγος έλξης</strong>
              </td>

              <td class="table-secondary">
                <strong>${unit.fullName}</strong>
              </td>

              ${unit.intervals.map(
                (interval, index) => html`
                  <td class=${index <= 2 ? "table-secondary" : ""}>
                    ${Interval.getName(interval)}
                  </td>
                `
              )}
            </tr>
          `
        )}
      </tbody>
    </table>`;

    return this.renderRowWithTitle(
      "4η βαθμίδα",
      html`<ul>
        <li>Αν η 4η βαθμίδα του τετραχόρδου απέχει από τη βάση διάστημα:</li>

        <ul>
          <li>4ης ελαττωμένης (2Τ), θεωρείται <strong>φθόγγος έλξης</strong></li>
          <li>4ης καθαρής (2Τ+Η), θεωρείται <strong>δεσπόζων φθόγγος</strong></li>
          <li>4ης αυξημένης (3Τ), θεωρείται πάλι <strong>φθόγγος έλξης</strong></li>
        </ul>

        ${htmlTable}
      </ul>`
    );
  }

  renderPemptiVathmida() {
    const tetraxordaMeFthoggoElxis = ScaleUnit.getAll()
      .filter(
        (unit) =>
          unit.intervals.length === 4 &&
          unit.intervals[0] + unit.intervals[1] + unit.intervals[2] + unit.intervals[3] === 7
      )
      .slice(0, 1);

    const htmlTable = html`<table class="table table-sm table-hover text-center">
      <tbody>
        ${tetraxordaMeFthoggoElxis.map(
          (unit) => html`
            <tr>
              <td class="table-secondary">
                <strong>Δεσπόζων φθόγγος</strong>
              </td>

              <td class="table-secondary">
                <strong>${unit.fullName}</strong>
              </td>

              ${unit.intervals.map(
                (interval, index) => html`
                  <td class=${index <= 3 ? "table-secondary" : ""}>
                    ${Interval.getName(interval)}
                  </td>
                `
              )}
            </tr>
          `
        )}
      </tbody>
    </table> `;

    return this.renderRowWithTitle(
      "5η βαθμίδα",
      html`<ul>
          <li>
            Η 5η βαθμίδα του πενταχόρδου πρέπει να απέχει διάστημα 5ης καθαρής (3Τ+Η) και θεωρείται
            <strong>δεσπόζων φθόγγος</strong>.
          </li>
        </ul>

        ${htmlTable}`
    );
  }

  render() {
    return html`
      <div class="container">
        ${this.renderPentaxordaTetraxorda()}
        <div />
        ${this.renderListaTetraxordon()}
        <div />
        ${this.renderMetatropi()}
        <div />
        ${this.renderIsokratima()}
        <div />
        ${this.renderToniki()}
        <div />
        ${this.renderDespozonFthoggos()}
        <div />
        ${this.renderFthoggosElxis()}
        <div />
        ${this.renderProtiVathmida()}
        <div />
        ${this.renderDefterevontaVathmida()}
        <div />
        ${this.renderTritiVathmida()}
        <div />
        ${this.renderTetartiVathmida()}
        <div />
        ${this.renderPemptiVathmida()}
        <div />
      </div>
    `;
  }

  #getGroupedScaleUnits() {
    const allScaleUnits = ScaleUnit.getAll();

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

    return groupedArray;
  }

  #getScaleUnitsTableHtml() {
    return html`
      ${this.#groupedScaleUnits.map(
        ({ length: noteCount, units }) => html`
          <div class="table-responsive">
            <table class="table table-sm table-hover align-middle text-center">
              <caption class="caption-top fw-bold text-center">
                ${noteCount}χορδα
              </caption>
              <thead class="table-light">
                <tr>
                  <th scope="col" class="text-center">Όνομα</th>
                  <th scope="col" colspan="${units[0].intervals.length}" class="text-center">
                    Διαστήματα
                  </th>
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
                      ${unit.intervals
                        .map(Interval.getName)
                        .map((interval) => html`<td>${interval}</td>`)}
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

customElements.define("scales-theory-element", ScalesTheoryElement);
