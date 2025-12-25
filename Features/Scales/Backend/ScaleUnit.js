import { Interval } from "../../Intervals/Backend/Interval.js";
import ScaleUnits from "./ScaleUnits.js";

export class ScaleUnit {
  #id;
  #name;
  #type;
  #variantNames;
  #intervals;
  #intervalNames;
  #baseNote;

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get fullName() {
    const numberOfNotes = this.#intervals.length + 1;
    const name = this.#baseNote ? `${this.#baseNote} ${this.#name}` : this.#name;
    return `${numberOfNotes}x ${name}`;
  }

  get type() {
    return this.#type;
  }

  get variantNames() {
    return this.#variantNames;
  }

  get intervals() {
    return this.#intervals;
  }

  get intervalNames() {
    return this.#intervalNames;
  }

  get baseNote() {
    return this.#baseNote;
  }

  set baseNote(baseNote) {
    if (!baseNote) {
      throw new Error("Base note cannot be empty");
    }

    this.#baseNote = baseNote;
  }

  static getAll() {
    return ScaleUnits.map((unit) => ScaleUnit.#create(unit));
  }

  static #create({ id, name, type, variantNames = [], intervals }) {
    if (!id || !name || !type || !Array.isArray(intervals)) {
      throw new Error("Invalid ScaleUnit data");
    }

    const scaleUnit = new ScaleUnit();
    scaleUnit.#id = id;
    scaleUnit.#name = name;
    scaleUnit.#type = type;
    scaleUnit.#variantNames = variantNames;
    scaleUnit.#intervals = intervals;
    scaleUnit.#intervalNames = intervals.map(Interval.getName);

    return scaleUnit;
  }

  static findById(id) {
    var scaleUnit = ScaleUnit.getAll().find((unit) => unit.id === id);
    if (!scaleUnit) {
      throw new Error(`ScaleUnit with id "${id}" not found`);
    }

    return scaleUnit;
  }
}
