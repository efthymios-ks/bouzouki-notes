import { Note } from "../Notes/Note.js";

export class Chord {
  static #chords = Object.freeze([
    {
      name: "Ματζόρε",
      key: "",
      intervals: [0, 4, 7],
    },
    {
      name: "Μινόρε",
      key: "m",
      intervals: [0, 3, 7],
    },
    {
      name: "Ντιμινουίτα",
      key: "dim",
      intervals: [0, 4, 7, 10],
    },
  ]);

  static getAll() {
    return Chord.#chords;
  }

  static parse(chord) {
    const roots = [...new Set(Note.sharpNotes.map((note) => note.toUpperCase()))].join("");
    const regex = new RegExp(`^([${roots}][#b]?)(m|dim)?$`);
    const match = regex.exec(chord);
    if (!match) {
      throw new Error(`Invalid chord format: "${chord}"`);
    }

    return {
      root: match[1],
      suffix: match[2] || "",
    };
  }

  static transpose(chord, fromTonic, toTonic) {
    const noteMap = Note.sharpNotes.map((note) => note.toUpperCase());

    const getNoteIndex = (note) => noteMap.indexOf(note.toUpperCase());
    const fromIndex = getNoteIndex(fromTonic);
    const toIndex = getNoteIndex(toTonic);
    if (fromIndex === -1) {
      throw new Error(`Invalid fromTonic: ${fromTonic}`);
    }
    if (toIndex === -1) {
      throw new Error(`Invalid toTonic: ${toTonic}`);
    }

    const { root, suffix } = Chord.parse(chord);
    const rootIndex = getNoteIndex(root);
    if (rootIndex === -1) {
      throw new Error(`Invalid chord root: ${root}`);
    }

    const interval = (toIndex - fromIndex + noteMap.length) % noteMap.length;
    const newIndex = (rootIndex + interval) % noteMap.length;
    return noteMap[newIndex] + suffix;
  }

  static getNotes(chord) {
    const { root, suffix } = Chord.parse(chord);
    const noteMap = Note.sharpNotes.map((n) => n.toUpperCase());
    const rootIndex = noteMap.indexOf(root.toUpperCase());
    if (rootIndex === -1) {
      throw new Error(`Invalid chord root: ${root}`);
    }

    const chordDefinition = this.#chords.find((c) => c.key === suffix);
    if (!chordDefinition) {
      throw new Error(`Unknown chord suffix: ${suffix}`);
    }

    return chordDefinition.intervals.map((i) => noteMap[(rootIndex + i) % noteMap.length]);
  }
}
