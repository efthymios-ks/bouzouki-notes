export class OctaveRange {
  #key = null;
  #name = null;

  constructor({ key, name }) {
    if (!key || !name) {
      throw new Error("StepRange requires key and name");
    }

    this.#key = key;
    this.#name = name;
    Object.freeze(this);
  }

  get key() {
    return this.#key;
  }

  get name() {
    return this.#name;
  }

  equals(other) {
    return other instanceof OctaveRange && this.key === other.key;
  }

  static Low = new OctaveRange({
    key: "low",
    name: "Χαμηλή Περιοχή",
  });

  static Mid = new OctaveRange({
    key: "mid",
    name: "Μεσαία Περιοχή",
  });

  static High = new OctaveRange({
    key: "high",
    name: "Υψηλή Περιοχή",
  });
}
