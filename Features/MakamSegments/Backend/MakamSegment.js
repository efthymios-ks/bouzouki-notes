import MakamSegments from "./MakamSegments.js";
import { Note } from "../../Notes/Backend/Note.js";
import { Octave } from "../../Octaves/Backend/Octave.js";

export class MakamSegment {
  #id = null;
  #name = null;
  #baseStep = null;
  #intervals = [];
  #leadingInterval = null;
  #placements = [];
  #remarks = [];
  #notes = [];
  #normalizedNotes = [];

  constructor({ id, name, intervals, leadingInterval, placements, notes: remarks = [] }) {
    if (!id) {
      throw new Error("Id cannot be empty");
    }

    if (!name) {
      throw new Error("Name cannot be empty");
    }

    if (!intervals) {
      throw new Error("Intervals cannot be empty");
    }

    if (!placements) {
      throw new Error("Placements cannot be empty");
    }

    // Validate intervals
    intervals.forEach((intervalArray, index) => {
      const isArray = Array.isArray(intervalArray);
      if (!isArray) {
        throw new Error(`Intervals at index ${index} must be an array`);
      }

      const isAllNumbers = intervalArray.every((intervalItem) => typeof intervalItem === "number");
      if (!isAllNumbers) {
        throw new Error(`Intervals at index ${index} must be an array of numbers`);
      }
    });

    // Validate placements against intervals
    placements.forEach((placement, index) => {
      const hasValidLength = intervals.some(
        (intervalArray) => intervalArray.length + 1 === placement.length
      );

      if (!hasValidLength) {
        throw new Error(
          `Invalid placement length at index ${index} for segment '${id}': ${placement.length} does not match any defined interval length`
        );
      }
    });

    // Validate leading interval
    const hasValidLeadingInterval =
      leadingInterval === 1 || leadingInterval === 2 || leadingInterval === 3;
    if (!hasValidLeadingInterval) {
      throw new Error(`Leading interval must be 1, 2, or 3, got ${leadingInterval}`);
    }

    this.#id = id;
    this.#name = name;
    this.#baseStep = placements[0].octavePosition;
    this.#intervals = intervals;
    this.#leadingInterval = leadingInterval;
    this.#placements = placements;
    this.#remarks = remarks;

    this.#notes = this.#calculateNotes();
    this.#normalizedNotes = this.#calculateNormalizedNotes();

    Object.freeze(this);
  }

  get id() {
    return this.#id;
  }

  get baseStep() {
    return this.#baseStep;
  }

  get name() {
    return this.#name;
  }

  get intervals() {
    return this.#intervals;
  }

  get leadingInterval() {
    return this.#leadingInterval;
  }

  get placements() {
    return this.#placements;
  }

  get notes() {
    return this.#notes;
  }

  get remarks() {
    return this.#remarks;
  }

  get normalizedNotes() {
    return this.#normalizedNotes;
  }

  #calculateNotes() {
    const baseOctaveStep = Octave.TwoOctaves.getStepByPosition(this.#baseStep);
    const baseNote = baseOctaveStep.note.match(/^([A-G])/)[1];

    return this.#intervals.map((intervalArray) => {
      return Note.intervalsToNotes(baseNote, intervalArray);
    });
  }

  #calculateNormalizedNotes() {
    const baseOctaveStep = Octave.TwoOctaves.getStepByPosition(this.#baseStep);
    const baseNote = baseOctaveStep.note.match(/^([A-G])/)[1];
    return this.#intervals.map((intervalArray) => {
      return Note.intervalsToNormalizedNotes(baseNote, intervalArray);
    });
  }

  static getAll() {
    return MakamSegments.map((segment) => new MakamSegment(segment)).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  static getById(id) {
    var segment = MakamSegment.getAll().find((segment) => segment.id === id);
    if (!segment) {
      throw new Error(`MakamSegment with id '${id}' not found`);
    }

    return segment;
  }

  getIntervalsBySize(segmentSize) {
    // Find the interval array that matches the segment size
    // size = number of notes, intervals.length = size - 1
    const targetIntervalLength = segmentSize - 1;
    const intervalValues = this.#intervals.find(
      (intervalValues) => intervalValues.length === targetIntervalLength
    );

    if (!intervalValues) {
      throw new Error(
        `No interval values found for segment '${this.#id}' with size ${segmentSize}`
      );
    }

    return intervalValues;
  }

  deconstruct() {
    return {
      id: this.#id,
      name: this.#name,
      intervals: this.#intervals,
      leadingInterval: this.#leadingInterval,
      placements: this.#placements,
      remarks: this.#remarks,
      notes: this.#notes,
      normalizedNotes: this.#normalizedNotes,
    };
  }
}
