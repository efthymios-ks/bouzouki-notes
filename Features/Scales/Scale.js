import { Chord } from "../Chords/Chord.js";
import { Note } from "../Notes/Note.js";
import Scales from "./Scales.js";

export class Scale {
  #name;
  #tonic;
  #intervals = [];
  #otherNames = [];
  #chords = null;
  #variants = [];
  #notes = [];
  #normalizedNotes = [];

  constructor({ name, tonic, intervals, otherNames = [], chords = null, variants = {} }) {
    if (!name) {
      throw new Error("Name must be a non-empty string");
    }

    if (!tonic || !Note.sharpNotes.includes(tonic)) {
      throw new Error(`Invalid or missing tonic for scale ${name}`);
    }

    if (!Array.isArray(intervals) || intervals.length === 0) {
      throw new Error(`Intervals must be a non-empty array (${name})`);
    }

    if (intervals.length !== Note.naturalNotes.length) {
      throw new Error(
        `Intervals must produce a total ${Note.naturalNotes.length + 1} notes (${name})`
      );
    }

    if (chords && chords.chords && chords.chords.length !== Note.naturalNotes.length) {
      throw new Error("Chords array must have the same length as the number of notes in the scale");
    }

    this.#name = name;
    this.#intervals = intervals;
    this.#otherNames = otherNames || [];
    this.#chords = chords || null;
    this.#variants = variants || {};

    Scale.#setTonic(this, tonic);
  }

  get name() {
    return this.#name;
  }

  get tonic() {
    return this.#tonic;
  }

  get intervals() {
    return this.#intervals;
  }

  get otherNames() {
    return this.#otherNames;
  }

  get chords() {
    return this.#chords;
  }

  get notes() {
    return this.#notes;
  }

  get normalizedNotes() {
    return this.#normalizedNotes;
  }

  get variants() {
    return this.#variants;
  }

  transpose(tonic) {
    const newScale = this.#clone();
    Scale.#setTonic(newScale, tonic);
    return newScale;
  }

  normalizeNote(note) {
    const indexInNormalized = this.#normalizedNotes.indexOf(note);
    if (indexInNormalized !== -1) {
      return note;
    }

    const indexInNotes = this.#notes.indexOf(note);
    if (indexInNotes !== -1) {
      return this.#normalizedNotes[indexInNotes];
    }

    console.warn(`Note "${note}" not found in scale "${this.#name} (${this.#tonic})"`);
    return note;
  }

  normalizeChord(chord) {
    const { root, suffix } = Chord.parse(chord);
    const normalizedRoot = this.normalizeNote(root);
    return normalizedRoot + suffix;
  }

  static getAll(tonic) {
    return Scales.map((scale) => Scale.#objectToScale(scale, tonic)).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  static findScales(inputNotes) {
    if (inputNotes.length !== 7) {
      return [];
    }

    const allScales = Scale.getAll("C");
    const matchingParents = []; // { scale, variantScales: [] }
    const matchingVariants = []; // { scale, parentName }

    // Collect parents
    for (const scale of allScales) {
      for (const tonic of Note.sharpNotes) {
        try {
          const transposedScale = scale.transpose(tonic);
          if (!transposedScale.#notesMatch(inputNotes)) {
            continue;
          }

          matchingParents.push({ scale: transposedScale, variantScales: [] });
        } catch {
          // Ignore errors here
        }
      }
    }

    // Collect variants
    for (const parentScale of allScales) {
      for (const variantScale of parentScale.variants || []) {
        for (const tonic of Note.sharpNotes) {
          try {
            const transposedScale = variantScale.transpose(tonic);
            if (!transposedScale.#notesMatch(inputNotes)) {
              continue;
            }

            matchingVariants.push({ scale: transposedScale, parentName: parentScale.name });
          } catch {
            // Ignore errors here
          }
        }
      }
    }

    const result = [];
    const seenNames = new Set();

    // Map matching variants to parents, if possible
    for (const matchingVariant of matchingVariants) {
      const matchingParent = matchingParents.find(
        (parent) => parent.scale.name === matchingVariant.parentName
      );

      if (!matchingParent) {
        continue;
      }

      const variantAlreadyExists = matchingParent.variantScales.find(
        (variantScale) =>
          variantScale.name === matchingVariant.scale.name &&
          variantScale.tonic === matchingVariant.scale.tonic
      );

      if (variantAlreadyExists) {
        continue;
      }

      matchingParent.variantScales.push(matchingVariant.scale);
    }

    // Add parents to results and mark their names as seen
    for (const matchingParent of matchingParents) {
      if (seenNames.has(matchingParent.scale.name)) {
        continue;
      }

      // Attach variants only for display
      const parentClone = matchingParent.scale.#clone();
      parentClone.#variants = matchingParent.variantScales;
      result.push(parentClone);
      seenNames.add(matchingParent.scale.name);
    }

    // Add variants that don't have a matched parent (prefix name, keep tonic)
    for (const matchingVariant of matchingVariants) {
      const hasMatchingParent = matchingParents.some(
        (matchingParent) => matchingParent.scale.name === matchingVariant.parentName
      );

      if (hasMatchingParent) {
        continue;
      }

      const prefixedScaleName = `${matchingVariant.parentName} (${matchingVariant.scale.name})`;
      if (seenNames.has(prefixedScaleName)) {
        continue;
      }

      result.push(new Scale({ ...matchingVariant.scale.#deconstruct(), name: prefixedScaleName }));
      seenNames.add(prefixedScaleName);
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }

  static #setTonic(scale, tonic) {
    if (!scale || !(scale instanceof Scale)) {
      throw new Error(`Scale can't be empty`);
    }

    if (!tonic) {
      throw new Error(`Tonic can't be empty`);
    }

    scale.#tonic = tonic;
    scale.#notes = scale.#calculateNotes();
    scale.#normalizedNotes = scale.#calculateNormalizedNotes();

    if (scale.#variants && scale.#variants.length > 0) {
      scale.#variants.forEach((variant) => Scale.#setTonic(variant, tonic));
    }
  }

  static #objectToScale(scaleAsObject, tonic) {
    const variants = (scaleAsObject.variants || []).map((variantAsObject) =>
      Scale.#objectToScale(variantAsObject, tonic)
    );

    return new Scale({
      ...scaleAsObject,
      tonic,
      variants,
    });
  }

  #clone() {
    return new Scale({
      ...this.#deconstruct(),
      variants: this.variants.map((variant) => variant.#clone()),
    });
  }

  #deconstruct() {
    return {
      name: this.name,
      tonic: this.tonic,
      intervals: [...this.intervals],
      otherNames: [...this.otherNames],
      chords: this.chords,
      variants: this.variants.map((variant) => variant.#deconstruct()),
    };
  }

  #calculateNotes() {
    const semitoneToNote = Note.sharpNotes.reduce((acc, note, index) => {
      acc[index % 12] = note;
      return acc;
    }, {});

    const getSemitone = (note) => {
      const baseSemitone = Note.semitoneMap[note[0]];
      const allTonicsLength = Note.sharpNotes.length;
      if (note.length > 1) {
        if (note[1] === "#") {
          return (baseSemitone + 1) % allTonicsLength;
        }

        if (note[1] === "b") {
          return (baseSemitone + (allTonicsLength - 1)) % allTonicsLength;
        }
      }

      return baseSemitone;
    };

    let currentSemitone = getSemitone(this.#tonic);

    const notes = [];
    notes.push(this.#tonic);
    for (const step of this.#intervals) {
      currentSemitone = (currentSemitone + step) % 12;
      notes.push(semitoneToNote[currentSemitone]);
    }

    return notes;
  }

  #calculateNormalizedNotes() {
    const getSemitone = (note) => {
      const baseSemitone = Note.semitoneMap[note[0]];
      if (note.length === 1) {
        return baseSemitone;
      }

      if (note[1] === "#") {
        return (baseSemitone + 1) % 12;
      }

      if (note[1] === "b") {
        return (baseSemitone + 11) % 12;
      }

      return baseSemitone;
    };

    const composeNote = (baseLetter, accidental) => baseLetter + (accidental || "");

    const notes = [];
    let tonicLetter = this.#tonic[0];
    let tonicIndex = Note.naturalNotes.indexOf(tonicLetter);

    for (let i = 0; i < this.#notes.length; i++) {
      const targetSemitone = getSemitone(this.#notes[i]);

      // Determine expected base letter for this position
      const expectedLetter = Note.naturalNotes[(tonicIndex + i) % Note.naturalNotes.length];
      const baseSemitone = Note.semitoneMap[expectedLetter];

      // Calculate difference in semitones between target and base letter
      let diff = (targetSemitone - baseSemitone + 12) % 12;

      // Determine accidental based on diff
      let accidental = "";
      if (diff === 1) {
        accidental = "#";
      } else if (diff === 11) {
        accidental = "b";
      } else if (diff !== 0) {
        // Handle rare double sharps/flats if needed or fallback to original note
        // For now fallback:
        notes.push(this.#notes[i]);
        continue;
      }

      notes.push(composeNote(expectedLetter, accidental));
    }

    return notes;
  }

  #notesMatch(inputNotes) {
    if (!Array.isArray(inputNotes)) {
      return false;
    }

    return inputNotes.every((note) => this.notes.includes(note));
  }
}
