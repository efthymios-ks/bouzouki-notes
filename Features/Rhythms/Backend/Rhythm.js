import Rhythms from "./Rhythms.js";

export class Rhythm {
  #label = null;
  #value = null;

  constructor({ label, value }) {
    if (!label) {
      throw new Error("Label cannot be empty");
    }

    if (!value) {
      throw new Error("Value cannot be empty");
    }

    this.#label = label;
    this.#value = value;

    Object.freeze(this);
  }

  get label() {
    return this.#label;
  }

  get value() {
    return this.#value;
  }

  static getAll() {
    return Rhythms.map((rhythm) => new Rhythm(rhythm));
  }

  deconstruct() {
    return {
      label: this.#label,
      value: this.#value,
    };
  }
}
