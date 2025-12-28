import Makams from "./Makams.js";
import { Octave } from "../../Octaves/Backend/Octave.js";
import { MakamSegment } from "../../MakamSegments/Backend/MakamSegment.js";
import { Note } from "../../Notes/Backend/Note.js";

export class Makam {
  #id = null;
  #name = null;
  #octavePosition = null;
  #mainVariant = null;
  #variants = [];

  constructor({ id, name, octavePosition, variants = [] }) {
    if (!id) {
      throw new Error("Id is required");
    }

    if (!name) {
      throw new Error("Name is required");
    }

    if (typeof octavePosition !== "number") {
      throw new Error("Octave position is required");
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      throw new Error("At least one variant is required");
    }

    const mainVariant = variants[0];
    this.#validateVariant(mainVariant, "mainVariant", true);
    variants.slice(1).forEach((variant, index) => {
      this.#validateVariant(variant, `variant at index ${index + 1}`, false);
    });

    this.#id = id;
    this.#name = name;
    this.#octavePosition = octavePosition;
    this.#mainVariant = this.#processVariant(mainVariant);
    this.#variants = variants.slice(1).map((variant) => this.#mergeWithMainVariant(variant));

    Object.freeze(this);
  }

  #validateVariant(variant, label, isMainVariant = false) {
    if (!variant.id) {
      throw new Error(`${label} must have id`);
    }

    if (!variant.name) {
      throw new Error(`${label} must have name`);
    }

    // Direction, entryNotes, endingNote, dominantNotes are only required for mainVariant
    // Other variants can inherit these from mainVariant via merging
    if (isMainVariant) {
      if (!variant.direction || (variant.direction !== "ASC" && variant.direction !== "DESC")) {
        throw new Error(`${label} must have a valid direction of 'ASC' or 'DESC'`);
      }

      if (!Array.isArray(variant.entryNotes) || variant.entryNotes.length === 0) {
        throw new Error(`${label} must have entryNotes array`);
      }

      if (!variant.endingNote) {
        throw new Error(`${label} must have endingNote`);
      }

      if (!Array.isArray(variant.dominantNotes) || variant.dominantNotes.length === 0) {
        throw new Error(`${label} must have dominantNotes array`);
      }
    }

    if (!variant.segments || !Array.isArray(variant.segments)) {
      throw new Error(`${label} must have segments array`);
    }

    variant.segments.forEach((segment, index) => {
      if (!segment.id) {
        throw new Error(`Segment at index ${index} in ${label} must have id`);
      }
    });
  }

  #processVariant(variant) {
    // Get leading interval from first segment
    const firstSegment = variant.segments[0];
    const makamSegment = MakamSegment.getById(firstSegment.id);
    const leadingInterval = makamSegment.leadingInterval;
    const direction = variant.direction ?? "ASC";

    return {
      ...variant,
      isHidden: variant.isHidden ?? false,
      direction: direction,
      isAscending: direction === "ASC",
      entryNotes: variant.entryNotes ?? [],
      endingNote: variant.endingNote ?? null,
      dominantNotes: variant.dominantNotes ?? [],
      leadingInterval: leadingInterval,
    };
  }

  #mergeWithMainVariant(variant) {
    // Get leading interval from first segment of this variant
    const firstSegment = variant.segments ?? this.#mainVariant.segments;
    const makamSegment = MakamSegment.getById(firstSegment[0].id);
    const leadingInterval = makamSegment.leadingInterval;
    const direction = variant.direction ?? this.#mainVariant.direction;

    return {
      ...this.#mainVariant,
      ...variant,
      // Ensure arrays are not merged but replaced
      segments: variant.segments ?? this.#mainVariant.segments,
      entryNotes: variant.entryNotes ?? this.#mainVariant.entryNotes,
      dominantNotes: variant.dominantNotes ?? this.#mainVariant.dominantNotes,
      leadingInterval: leadingInterval,
      direction: direction,
      isAscending: direction === "ASC",
    };
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get octavePosition() {
    return this.#octavePosition;
  }

  get mainVariant() {
    return this.#mainVariant;
  }

  get variants() {
    return this.#variants;
  }

  get allVariants() {
    return [this.#mainVariant, ...this.#variants];
  }

  getIntervals(variantId = null) {
    variantId = variantId || this.#mainVariant.id;
    const variant = this.getVariantById(variantId);
    const intervals = [];

    for (let segmentIndex = 0; segmentIndex < variant.segments.length; segmentIndex++) {
      const segment = variant.segments[segmentIndex];
      const segmentIntervals = this.getSegmentIntervals(variantId, segmentIndex);
      const start = typeof segment.position === "number" ? segment.position : intervals.length;
      segmentIntervals.forEach((interval, intervalIndex) => {
        const index = start + intervalIndex;

        if (intervals[index] === undefined) {
          intervals[index] = interval;
        } else if (intervals[index] !== interval) {
          throw new Error(
            `Interval conflict at position ${index}: ${intervals[index]} vs ${interval}`
          );
        }
      });
    }

    return intervals;
  }

  getNotes(variantId = null) {
    variantId = variantId || this.#mainVariant.id;

    const intervals = this.getIntervals(variantId);
    const baseOctaveStep = Octave.TwoOctaves.getStepByPosition(this.#octavePosition);
    const baseNoteKey = baseOctaveStep.note.match(/^([A-G][#b]?)/)[1];
    return Note.intervalsToNormalizedNotes(baseNoteKey, intervals).map(
      (noteKey) => new Note(noteKey)
    );
  }

  getSegmentIntervals(variantId, segmentIndex) {
    const variant = this.getVariantById(variantId);
    const segment = variant.segments[segmentIndex];
    if (!segment) {
      throw new Error(
        `Segment at index ${segmentIndex} not found in variant ${variantId} of makam ${this.#id}`
      );
    }

    return segment.intervals && segment.intervals.length > 0
      ? segment.intervals
      : MakamSegment.getById(segment.id).getIntervalsBySize(segment.size);
  }

  getSegmentOctavePosition(variantId, segmentIndex) {
    const variant = this.getVariantById(variantId);
    const segment = variant.segments[segmentIndex];

    if (!segment) {
      throw new Error(
        `Segment at index ${segmentIndex} not found in variant ${variantId} of makam ${this.#id}`
      );
    }

    const startIntervalIndex =
      typeof segment.position === "number"
        ? segment.position
        : variant.segments
            .slice(0, segmentIndex)
            .reduce((sum, _, i) => sum + this.getSegmentIntervals(variantId, i).length, 0);

    return this.#octavePosition + startIntervalIndex;
  }

  getVariantById(id) {
    const variant = this.allVariants.find((variant) => variant.id === id);
    if (!variant) {
      throw new Error(`Variant with id ${id} not found in makam ${this.#id}`);
    }

    return variant;
  }

  static getAll() {
    return Makams.map((makam) => new Makam(makam));
  }

  static getById(id) {
    const makamData = Makams.find((makam) => makam.id === id);
    return makamData ? new Makam(makamData) : null;
  }

  deconstruct() {
    return {
      id: this.#id,
      name: this.#name,
      octavePosition: this.#octavePosition,
      mainVariant: this.#mainVariant,
      variants: this.#variants,
    };
  }
}
