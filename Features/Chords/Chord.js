import { Note } from "../Notes/Note.js";

export class Chord {
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

    const intervals = {
      "": [0, 4, 7],
      m: [0, 3, 7],
      dim: [0, 4, 7, 10],
    }[suffix];

    if (!intervals) {
      throw new Error(`Unknown chord suffix: ${suffix}`);
    }

    return intervals.map((i) => noteMap[(rootIndex + i) % noteMap.length]);
  }
}
