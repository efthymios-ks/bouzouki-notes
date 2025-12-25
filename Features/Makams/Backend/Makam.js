import Makams from "../Makams.js";
import { MakamSegment } from "../../MakamSegments/Backend/MakamSegment.js";

export class Makam {
  #id = null;
  #name = null;
  #octavePosition = null;
  #mainVariant = null;
  #variants = [];

  constructor({ id, name, octavePosition, mainVariant, variants = [] }) {
    if (!id || !name || octavePosition === undefined || !mainVariant) {
      throw new Error("Makam requires id, name, octavePosition, and mainVariant");
    }

    // Validate octavePosition is a number
    if (typeof octavePosition !== "number") {
      throw new Error(`octavePosition must be a number, got ${typeof octavePosition}`);
    }

    // Validate mainVariant structure
    this.#validateVariant(mainVariant, "mainVariant");

    // Validate all variants
    variants.forEach((variant, index) => {
      this.#validateVariant(variant, `variant at index ${index}`);
    });

    this.#id = id;
    this.#name = name;
    this.#octavePosition = octavePosition;
    this.#mainVariant = this.#processVariant(mainVariant);
    this.#variants = variants.map((variant) => this.#mergeWithMainVariant(variant));

    Object.freeze(this);
  }

  #validateVariant(variant, label) {
    if (!variant.id || !variant.name) {
      throw new Error(`${label} must have id and name`);
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
    return {
      ...variant,
      isHidden: variant.isHidden ?? false,
      direction: variant.direction ?? "ASC",
      entryNotes: variant.entryNotes ?? [],
      endingNote: variant.endingNote ?? null,
      dominantNotes: variant.dominantNotes ?? [],
    };
  }

  #mergeWithMainVariant(variant) {
    return {
      ...this.#mainVariant,
      ...variant,
      // Ensure arrays are not merged but replaced
      segments: variant.segments ?? this.#mainVariant.segments,
      entryNotes: variant.entryNotes ?? this.#mainVariant.entryNotes,
      dominantNotes: variant.dominantNotes ?? this.#mainVariant.dominantNotes,
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

  getVariantById(id) {
    return this.allVariants.find((variant) => variant.id === id);
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
