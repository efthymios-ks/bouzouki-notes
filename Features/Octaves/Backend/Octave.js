import { OctaveRange } from "./OctaveRange.js";
import { OctaveStep } from "./OctaveStep.js";
import OctaveSteps from "./OctaveSteps.js";

export class Octave {
  #steps = [];
  #notationNumber;

  constructor(notationNumber, steps) {
    this.#notationNumber = notationNumber;
    this.#steps = steps.map((step) => new OctaveStep(step));
    Object.freeze(this);
  }

  get notationNumber() {
    return this.#notationNumber;
  }

  get steps() {
    return this.#steps;
  }

  getStepByPosition(position) {
    Octave.validatePosition(position);

    const step = this.#steps.find((step) => step.position === position);
    if (!step) {
      throw new Error(`No octave step found for position ${position}`);
    }
    return step;
  }

  static TwoOctaves = new Octave(null, OctaveSteps);

  static Low = new Octave(
    3,
    Octave.TwoOctaves.steps.filter((step) => step.range === OctaveRange.Low)
  );

  static Mid = new Octave(
    4,
    Octave.TwoOctaves.steps.filter((step) => step.range === OctaveRange.Mid)
  );

  static High = new Octave(
    5,
    Octave.TwoOctaves.steps.filter((step) => step.range === OctaveRange.High)
  );

  static validatePosition(position) {
    if (!Octave.TwoOctaves.steps.some((step) => step.position === position)) {
      const positions = Octave.TwoOctaves.steps.map((step) => step.position);
      const min = Math.min(...positions);
      const max = Math.max(...positions);
      throw new Error(`Invalid position ${position}. Must be between ${min} and ${max}.`);
    }
  }

  static getOctave(position) {
    Octave.validatePosition(position);

    const step = Octave.TwoOctaves.getStepByPosition(position);
    const range = step.range;
    if (range === OctaveRange.Low) {
      return Octave.Low;
    } else if (range === OctaveRange.Mid) {
      return Octave.Mid;
    } else if (range === OctaveRange.High) {
      return Octave.High;
    }

    throw new Error(`Unknown range for position ${position}`);
  }

  static getRangeOctave(start, end) {
    Octave.validatePosition(start);
    Octave.validatePosition(end);

    const startStep = Octave.TwoOctaves.getStepByPosition(start);
    const endStep = Octave.TwoOctaves.getStepByPosition(end);
    if (startStep.range !== endStep.range) {
      throw new Error(`Start position ${start} and end position ${end} are in different ranges`);
    }

    return Octave.getOctave(start);
  }
}
