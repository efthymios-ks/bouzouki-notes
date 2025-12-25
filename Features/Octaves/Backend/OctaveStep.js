import { OctaveRange } from "./OctaveRange.js";

export class OctaveStep {
  #note = null;
  #label = null;
  #position = null;
  #range = null;

  constructor({ note, label, position }) {
    if (!note || !label) {
      throw new Error("Step must have 'note' and 'label'");
    }

    this.#note = note;
    this.#label = label;
    this.#position = position;

    if (position < 0) {
      this.#range = OctaveRange.Low;
    } else if (position < 8) {
      this.#range = OctaveRange.Mid;
    } else {
      this.#range = OctaveRange.High;
    }
  }

  get note() {
    return this.#note;
  }

  get label() {
    return this.#label;
  }

  get range() {
    return this.#range;
  }

  get position() {
    return this.#position;
  }

  toJSON() {
    return {
      note: this.#note,
      label: this.#label,
      range: this.#range,
      position: this.#position,
    };
  }
}
