export class Note {
  static semitoneMap = Object.freeze({ C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 });
  static #noteNames = Object.freeze({
    C: "Ντο",
    D: "Ρε",
    E: "Μι",
    F: "Φα",
    G: "Σολ",
    A: "Λα",
    B: "Σι",
  });

  static naturalNotes = Object.freeze(Object.keys(Note.#noteNames));
  static sharpNotes = Object.freeze([
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ]);

  #key;
  #name;

  constructor(note) {
    const noteRegex = new RegExp(`^([${Note.naturalNotes.join("")}])([#b])?$`);
    const match = note.trim().match(noteRegex);
    if (!match) {
      throw new Error(`Unsupported key format: ${note}`);
    }

    const [, baseNote, accidental] = match;
    this.#key = `${baseNote}${accidental || ""}`;

    let name = Note.#noteNames[baseNote];
    if (accidental) {
      name += accidental;
    }

    this.#name = name;
  }

  get key() {
    return this.#key;
  }

  get name() {
    return this.#name;
  }

  toPrintableString() {
    return Note.toPrintableString(this.key);
  }

  static toPrintableString(note) {
    if (note instanceof Note) {
      note = note.key;
    }

    return note.replace("b", "♭").replace("#", "♯");
  }

  static transpose(note, interval) {
    const key = note instanceof Note ? note.key : note;
    const semitone = Note.getSemitone(key);
    const newSemitone = (semitone + interval + 12) % 12;
    return Note.sharpNotes[newSemitone];
  }

  static getSemitone(note) {
    const key = note instanceof Note ? note.key : note;

    const base = key[0];
    const accidental = key[1] === "#" ? 1 : key[1] === "b" ? -1 : 0;

    const baseSemitone = Note.semitoneMap[base];
    if (baseSemitone === undefined) {
      throw new Error(`Invalid note: ${note}`);
    }

    return (baseSemitone + accidental + 12) % 12;
  }
}
