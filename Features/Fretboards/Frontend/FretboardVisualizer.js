import { LitElement, html, css } from "../../../Libraries/lit/lit.min.js";
import { Note } from "../../Notes/Backend/Note.js";

export class FretboardVisualizer extends LitElement {
  static styles = css`
    #fretboard {
      --scale-factor: 1.2;
      --color-fret-background: #211912;
      --color-fretboard-shadow: #1a0d00;
      --color-fret-silver: #c0c0c0;
      --color-fret-horizontal-splitter: #9f8a65;
      --color-fret-note: #f5f1e9;
      --color-fret-number: #aaa;

      --border-outer-width: 0.175rem;
      --border-fret-silver: calc(0.094rem * var(--scale-factor)) solid var(--color-fret-silver);

      width: calc(100% * var(--scale-factor));
      max-width: calc(600px * var(--scale-factor));
      border-collapse: collapse;
      margin: calc(1rem * var(--scale-factor)) auto;
      background-color: var(--color-fret-background);
      box-shadow: 0 0 calc(1.1rem * var(--scale-factor)) var(--color-fretboard-shadow);
      user-select: none;
    }

    /* Fret note cell */
    #fretboard td {
      min-width: calc(2.5rem * var(--scale-factor));
      height: calc(2.5rem * var(--scale-factor));
      color: var(--color-fret-note);
      font-weight: 600;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      border-right: var(--border-fret-silver);
      text-align: center;
    }

    #fretboard tr.chord-separator td:not([data-fret-number="0"]) {
      border-top: 0.094rem solid var(--color-fret-horizontal-splitter);
    }

    /* Outer top and bottom borders */
    #fretboard tr.outer-top td:not([data-fret-number="0"]) {
      border-top: var(--border-fret-silver);
      border-top-width: var(--border-outer-width);
    }

    #fretboard tr.outer-bottom td:not([data-fret-number="0"]) {
      border-bottom: var(--border-fret-silver);
      border-bottom-width: var(--border-outer-width);
      position: relative;
    }

    #fretboard td[data-fret-number="0"] {
      border-right: var(--border-fret-silver);
      border-right-width: var(--border-outer-width);
    }

    /* Fret note */
    #fretboard .fret-note {
      font-size: calc(0.875rem * var(--scale-factor));
    }

    /* Numbers row */
    #fretboard .numbers-row td {
      color: var(--color-fret-number);
      font-size: calc(0.65rem * var(--scale-factor));
      height: 1rem;
      font-weight: normal;
      border: none;
    }

    #fretboard .numbers-row td.dotted {
      position: relative;
    }

    #fretboard .numbers-row td.dotted::after {
      content: attr(data-fret);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--color-fret-number);
      color: var(--color-fret-background);
      border-radius: 50%;
      padding: calc(0.15rem * var(--scale-factor)) calc(0.4rem * var(--scale-factor));
      line-height: 1;
      user-select: none;
    }

    /* Selected frets */
    #fretboard tr:not(.numbers-row) td:not([data-fret-number="0"]):not(.fret-selected) {
      opacity: 0.25;
      font-weight: lighter;
    }
  `;

  static properties = {
    chordLayout: { type: Array },
    selectFretFunction: { type: Function },
  };

  #maxFrets = 25;
  #sharpNotes = Note.sharpNotes;
  #dottedTastes = [0, 3, 5, 7, 10];

  constructor() {
    super();
    this.chordLayout = this.chordLayout || ["D", "A", "F", "C"];
    this.selectFretFunction = () => false;
  }

  #getNoteFrom(startNote, steps) {
    const index = this.#sharpNotes.indexOf(startNote);
    return this.#sharpNotes[(index + steps) % this.#sharpNotes.length];
  }

  render() {
    const rows = [];

    const totalStrings = this.chordLayout.length;
    for (let stringNumber = 0; stringNumber < totalStrings; stringNumber++) {
      const stringNote = this.chordLayout[stringNumber];
      const isTop = stringNumber === 0;
      const isBottom = stringNumber === totalStrings - 1;
      const chordSeparatorClass = stringNumber > 0 && stringNumber < totalStrings;

      rows.push(html`
        <tr
          class="${chordSeparatorClass ? "chord-separator" : ""} ${isTop
            ? "outer-top"
            : ""} ${isBottom ? "outer-bottom" : ""}"
        >
          ${Array.from({ length: this.#maxFrets + 1 }, (_, fretNumber) => {
            const fretNote = this.#getNoteFrom(stringNote, fretNumber);

            const selectFretFunction =
              typeof this.selectFretFunction === "function" ? this.selectFretFunction : () => false;

            const isFretSelected = selectFretFunction(
              stringNumber,
              stringNote,
              fretNumber,
              fretNote
            );

            const fretHighlightClass = isFretSelected ? "fret-selected" : "";
            const firstFretClass = fretNumber === 1 ? "first-fret" : "";

            return html`
              <td
                data-string-number="${stringNumber}"
                data-string-note="${stringNote}"
                data-fret-note="${fretNote}"
                data-fret-number="${fretNumber}"
                class="${firstFretClass} ${fretHighlightClass}"
              >
                <span class="fret-note">${fretNote}</span>
              </td>
            `;
          })}
        </tr>
      `);
    }

    const labelRow = html`
      <tr class="numbers-row">
        ${Array.from({ length: this.#maxFrets + 1 }, (_, fretNumber) => {
          const dotted = this.#dottedTastes.includes(fretNumber % 12);
          return html`
            <td data-fret="${fretNumber}" class="${dotted ? "dotted" : ""}">${fretNumber}</td>
          `;
        })}
      </tr>
    `;

    return html`
      <table id="fretboard">
        ${rows} ${labelRow}
      </table>
    `;
  }
}

customElements.define("fretboard-visualizer", FretboardVisualizer);
