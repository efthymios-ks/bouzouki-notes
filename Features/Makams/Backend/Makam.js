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

    this.#id = id;
    this.#name = name;
    this.#octavePosition = octavePosition;

    this.#mainVariant = this.#populateVariant(variants[0]);
    this.#variants = variants
      .slice(1)
      .map((variant) => this.#populateVariant(variant, this.#mainVariant));

    // Freeze
    Object.freeze(this.#mainVariant);
    Object.freeze(this.#variants);
    Object.freeze(this);
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

  get dominantNotes() {
    const allDominantNotes = new Set();
    this.allVariants
      .filter((variant) => variant.isMain === true)
      .forEach((variant) => {
        variant.dominantNotes?.forEach((note) => allDominantNotes.add(note));
      });
    return Array.from(allDominantNotes).sort((a, b) => a - b);
  }

  static getAll() {
    return Makams.map((makam) => new Makam(makam)).sort((a, b) => a.name.localeCompare(b.name));
  }

  static getById(id) {
    const makamData = Makams.find((makam) => makam.id === id);
    return makamData ? new Makam(makamData) : null;
  }

  get allVariants() {
    return [this.#mainVariant, ...this.#variants];
  }

  getVariantById(id) {
    const variant = this.allVariants.find((variant) => variant.id === id);
    if (!variant) {
      throw new Error(`Variant with id ${id} not found in makam ${this.#id}`);
    }

    return variant;
  }

  #populateVariant(variant, mainVariant = null) {
    // Validation
    if (!variant.id) {
      throw new Error("Variant must have id");
    }

    if (!variant.name) {
      throw new Error("Variant must have name");
    }

    if (!Array.isArray(variant.segments) || !variant.segments.length) {
      throw new Error("Variant must have segments");
    }

    // If is main variant
    const isMain = !mainVariant;
    if (isMain) {
      if (!["ASC", "DESC", "ASC|DESC"].includes(variant.direction)) {
        throw new Error("Main variant must have valid direction");
      }

      if (!Array.isArray(variant.entryNotes) || !variant.entryNotes.length) {
        throw new Error("Main variant entryNotes required");
      }

      if (!variant.endingNote) {
        throw new Error("Main variant endingNote required");
      }

      if (!Array.isArray(variant.dominantNotes) || !variant.dominantNotes.length) {
        throw new Error("Main variant dominantNotes required");
      }
    }

    // Merge defaults from main variant if provided
    const firstSegment = variant.segments[0];
    const leadingInterval =
      firstSegment.leadingInterval ?? MakamSegment.getById(firstSegment.id).leadingInterval;
    const direction = variant.direction ?? mainVariant?.direction;

    variant = {
      ...mainVariant,
      ...variant,
      isMain: variant.isMain ?? false,
      direction,
      isAscending: direction.startsWith("ASC"),
      isBidirectional: direction === "ASC|DESC",
      entryNotes: variant.entryNotes ?? mainVariant?.entryNotes,
      endingNote: variant.endingNote ?? mainVariant?.endingNote,
      dominantNotes: variant.dominantNotes ?? mainVariant?.dominantNotes,
      leadingInterval,
      segments: variant.segments ?? mainVariant?.segments,
      octavePosition: this.#octavePosition + firstSegment.position,
    };

    this.#populateSegments(variant);
    variant.intervals = this.#getVariantIntervals(variant);
    variant.notes = this.#getVariantNotes(variant);

    Object.freeze(variant.segments);
    Object.freeze(variant.intervals);
    Object.freeze(variant.notes);
    return Object.freeze(variant);
  }

  #populateSegments(variant) {
    let cursor = 0;
    variant.segments = variant.segments.map((segment) => {
      const segmentDef = MakamSegment.getById(segment.id);
      const segmentName = segment.name ?? segmentDef.name;
      const intervals = segment.intervals?.length
        ? segment.intervals
        : segmentDef.getIntervalsBySize(segment.size);

      if (segment.size && intervals.length !== segment.size - 1) {
        throw new Error(`Invalid size for segment ${segment.id}`);
      }

      const hasExplicitPosition = typeof segment.position === "number";
      const position = hasExplicitPosition ? segment.position : cursor;
      const octavePosition = this.#octavePosition + position;

      if (hasExplicitPosition) {
        cursor = position + intervals.length;
      } else {
        cursor += intervals.length;
      }

      return Object.freeze({
        id: segmentDef.id,
        name: segmentName,
        intervals,
        size: intervals.length + 1,
        position,
        octavePosition,
      });
    });
  }

  #getVariantIntervals(variant) {
    const intervals = new Map();

    variant.segments.forEach((segment) => {
      const position = segment.position ?? 0;
      segment.intervals.forEach((intervalValue, intervalIndex) => {
        const index = position + intervalIndex;
        if (intervals.has(index) && intervals.get(index) !== intervalValue) {
          throw new Error(`Interval conflict at position ${index}`);
        }

        intervals.set(index, intervalValue);
      });
    });

    const sortedKeys = Array.from(intervals.keys()).sort((a, b) => a - b);
    const result = sortedKeys.map((key) => intervals.get(key));
    return Object.freeze(result);
  }

  #getVariantNotes(variant) {
    const baseStep = Octave.TwoOctaves.getStepByPosition(variant.octavePosition);
    const baseNote = baseStep.note.match(/^([A-G][#b]?)/)[1];
    const intervals = this.#getVariantIntervals(variant);
    return Object.freeze(
      Note.intervalsToNormalizedNotes(baseNote, intervals).map((noteKey) => new Note(noteKey))
    );
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
