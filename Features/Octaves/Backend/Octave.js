import { OctaveRange } from "./OctaveRange.js";
import { OctaveStep } from "./OctaveStep.js";
import OctaveSteps from "./OctaveSteps.js";

export class Octave {
  #steps = [];

  constructor(steps) {
    this.#steps = steps.map((step) => new OctaveStep(step));
    Object.freeze(this);
  }

  get steps() {
    return this.#steps;
  }

  static TwoOctaves = new Octave(OctaveSteps);

  static Low = new Octave(Octave.TwoOctaves.steps.filter((step) => step.range === OctaveRange.Low));

  static Mid = new Octave(Octave.TwoOctaves.steps.filter((step) => step.range === OctaveRange.Mid));

  static High = new Octave(
    Octave.TwoOctaves.steps.filter((step) => step.range === OctaveRange.High)
  );

  static validatePosition(position, context = "") {
    if (!Octave.TwoOctaves.steps.some((step) => step.position === position)) {
      const positions = Octave.TwoOctaves.steps.map((step) => step.position);
      const min = Math.min(...positions);
      const max = Math.max(...positions);
      const contextMsg = context ? ` ${context}` : "";
      throw new Error(
        `Invalid position ${position}${contextMsg}. Must be between ${min} and ${max}.`
      );
    }
  }

  static getOctave(position) {
    Octave.validatePosition(position);

    const step = Octave.TwoOctaves.steps.find((step) => step.position === position);
    if (!step) {
      throw new Error(`No octave step found for position ${position}`);
    }

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

    const startStep = Octave.TwoOctaves.steps.find((step) => step.position === start);
    const endStep = Octave.TwoOctaves.steps.find((step) => step.position === end);

    if (!startStep || !endStep) {
      throw new Error(`Invalid positions: start=${start}, end=${end}`);
    }

    if (startStep.range !== endStep.range) {
      throw new Error(
        `Start position ${start} and end position ${end} are in different ranges`
      );
    }

    return Octave.getOctave(start);
  }
}
