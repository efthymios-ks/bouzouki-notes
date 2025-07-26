import { Note } from "../Notes/Note.js";
import { ScaleVariant } from "./ScaleVariant.js";
import Scales from "./Scales.js";

export class Scale {
  #id = null;
  #name = null;
  #tonic = null;
  #variants = [];

  constructor({ id, name, tonic, variants }) {
    if (!id) {
      throw new Error(`Id must be a non-empty string for '${name}'`);
    }

    if (!name) {
      throw new Error(`Name must be a non-empty string for '${id}'`);
    }

    if (!tonic || !Note.sharpNotes.includes(tonic)) {
      throw new Error(`Invalid or missing tonic for '${name}'`);
    }

    if (!variants || variants.length === 0) {
      throw new Error(`Scale '${name}' must have at least one variant`);
    }

    this.#id = id;
    this.#name = name;
    this.#tonic = tonic;

    this.#variants = variants.map((variant) => {
      if (!variant.name) {
        variant.name = name;
      }

      return new ScaleVariant({ ...variant, tonic });
    });
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get tonic() {
    return this.#tonic;
  }

  get variants() {
    return this.#variants;
  }

  static getAll(tonic) {
    return Scales.map((scale) => new Scale({ ...scale, tonic })).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  static findScales(inputNotes) {
    if (inputNotes.length !== 7) {
      console.warn(
        `Input notes must be exactly 7 notes for scale matching (found ${inputNotes.length}).`
      );

      return [];
    }

    const matchingScales = [];
    for (const tonic of Note.sharpNotes) {
      for (const scale of Scale.getAll(tonic)) {
        const scaleAlreadyAdded = matchingScales.some((s) => s.id === scale.id);
        if (scaleAlreadyAdded) {
          continue;
        }

        for (const scaleVariant of scale.variants) {
          try {
            const scaleVariantNotesMatch = scaleVariant.notes.every((note) =>
              inputNotes.includes(note)
            );

            if (!scaleVariantNotesMatch) {
              continue;
            }

            matchingScales.push(scale);
            break;
          } catch {
            continue;
          }
        }
      }
    }

    return matchingScales.sort((a, b) => a.name.localeCompare(b.name));
  }

  clone() {
    return new Scale(this.deconstruct());
  }

  deconstruct() {
    return {
      id: this.#id,
      name: this.#name,
      tonic: this.#tonic,
      variants: this.#variants.map((variant) => variant.deconstruct()),
    };
  }
}
