import { OctaveRange } from "./OctaveRange.js";

export class OctaveStep {
  #note = null;
  #label = null;
  #position = null;
  #range = null;

  constructor({ note, label, position }) {
    if (!note) {
      throw new Error("Note cannot be empty");
    }

    if (!label) {
      throw new Error("Label cannot be empty");
    }

    if (typeof position !== "number") {
      throw new Error("Position must be a number");
    }

    this.#note = note;
    this.#label = label;
    this.#position = position;
    this.#range = OctaveRange.getByOctavePosition(position);

    Object.freeze(this);
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

  deconstruct() {
    return {
      note: this.#note,
      label: this.#label,
      position: this.#position,
      range: this.#range,
    };
  }
}
