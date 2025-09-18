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
}
