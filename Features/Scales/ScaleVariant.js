import { Chord } from "../Chords/Chord.js";
import { Interval } from "../Intervals/Interval.js";
import { Note } from "../Notes/Note.js";
import { ScaleUnit } from "./ScaleUnit.js";

export class ScaleVariant {
  #name = null;
  #intervals = [];
  #intervalsAsNames = [];
  #chords = null;
  #unitIds = [];
  #units = [];
  #otherNames = [];
  #notes = [];
  #normalizedNotes = [];
  #tonic = null;

  constructor({
    name = null,
    intervals,
    chords = null,
    unitIds = [],
    otherNames = [],
    tonic = null,
  }) {
    if (!intervals || intervals.length === 0) {
      throw new Error("Intervals must be a non-empty array");
    }

    this.#name = name;
    this.#intervals = intervals;
    this.#intervalsAsNames = intervals.map(Interval.getName);
    this.#chords = chords;
    this.#unitIds = unitIds;
    this.#otherNames = otherNames;
    this.#units = unitIds.map((id) => ScaleUnit.findById(id));
    this.#tonic = tonic;

    if (tonic) {
      this.#notes = this.#calculateNotes(tonic);
      this.#normalizedNotes = this.#calculateNormalizedNotes(tonic);

      let currentNoteIndex = 0;
      for (const unit of this.#units) {
        unit.baseNote = this.#normalizedNotes[currentNoteIndex];
        currentNoteIndex += unit.intervals.length;
      }
    }
  }

  get name() {
    return this.#name;
  }

  get intervals() {
    return this.#intervals;
  }

  get intervalsAsNames() {
    return this.#intervalsAsNames;
  }

  get chords() {
    return this.#chords;
  }

  get unitIds() {
    return this.#unitIds;
  }

  get units() {
    return this.#units;
  }

  get otherNames() {
    return this.#otherNames;
  }

  get notes() {
    return this.#notes;
  }

  get normalizedNotes() {
    return this.#normalizedNotes;
  }

  get tonic() {
    return this.#tonic;
  }

  normalizeChord(chord) {
    const { root, suffix } = Chord.parse(chord);
    const normalizedRoot = this.normalizeNote(root);
    return normalizedRoot + suffix;
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

  #calculateNotes(tonic) {
    const semitoneToNote = Note.sharpNotes.reduce((acc, note, index) => {
      acc[index % 12] = note;
      return acc;
    }, {});

    const getSemitone = (note) => {
      const baseSemitone = Note.semitoneMap[note[0]];
      if (note.length > 1) {
        if (note[1] === "#") return (baseSemitone + 1) % 12;
        if (note[1] === "b") return (baseSemitone + 11) % 12;
      }
      return baseSemitone;
    };

    let currentSemitone = getSemitone(tonic);
    const notes = [tonic];

    for (const step of this.#intervals) {
      currentSemitone = (currentSemitone + step) % 12;
      notes.push(semitoneToNote[currentSemitone]);
    }

    return notes;
  }

  #calculateNormalizedNotes(tonic) {
    const getSemitone = (note) => {
      const baseSemitone = Note.semitoneMap[note[0]];
      if (note.length === 1) return baseSemitone;
      if (note[1] === "#") return (baseSemitone + 1) % 12;
      if (note[1] === "b") return (baseSemitone + 11) % 12;
      return baseSemitone;
    };

    const composeNote = (baseLetter, accidental) => baseLetter + (accidental || "");

    const notes = [];
    let tonicLetter = tonic[0];
    let tonicIndex = Note.naturalNotes.indexOf(tonicLetter);

    for (let i = 0; i < this.#notes.length; i++) {
      const targetSemitone = getSemitone(this.#notes[i]);
      const expectedLetter = Note.naturalNotes[(tonicIndex + i) % Note.naturalNotes.length];
      const baseSemitone = Note.semitoneMap[expectedLetter];
      let diff = (targetSemitone - baseSemitone + 12) % 12;

      let accidental = "";
      if (diff === 1) accidental = "#";
      else if (diff === 11) accidental = "b";
      else if (diff !== 0) {
        notes.push(this.#notes[i]);
        continue;
      }

      notes.push(composeNote(expectedLetter, accidental));
    }

    return notes;
  }

  clone() {
    return new ScaleVariant(this.deconstruct());
  }

  deconstruct() {
    return {
      name: this.#name,
      intervals: [...this.#intervals],
      chords: this.#chords,
      unitIds: [...this.#unitIds],
      otherNames: [...this.#otherNames],
      tonic: this.#tonic,
    };
  }
}
