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
      this.#notes = Note.calculateNotesFromIntervals(tonic, this.#intervals);
      this.#normalizedNotes = Note.calculateNormalizedNotes(tonic, this.#intervals);

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
