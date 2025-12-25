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

  toFullName() {
    return Note.toFullName(this.key);
  }

  static toFullName(note) {
    if (note instanceof Note) {
      note = note.key;
    }

    const noteRegex = new RegExp(`^([${Note.naturalNotes.join("")}])([#b])?$`);
    const match = note.trim().match(noteRegex);
    if (!match) {
      throw new Error(`Unsupported key format: ${note}`);
    }
    const [, baseNote, accidental] = match;
    let name = Note.#noteNames[baseNote];
    if (accidental) {
      name += accidental;
    }
    return name;
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

  static calculateNotesFromIntervals(tonic, intervals) {
    if (!tonic || !intervals || !Array.isArray(intervals)) {
      throw new Error("calculateNotesFromIntervals requires a tonic note and intervals array");
    }

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

    for (const step of intervals) {
      currentSemitone = (currentSemitone + step) % 12;
      notes.push(semitoneToNote[currentSemitone]);
    }

    return notes;
  }

  static calculateNormalizedNotes(tonic, intervals) {
    if (!tonic || !intervals || !Array.isArray(intervals)) {
      throw new Error("calculateNormalizedNotes requires a tonic note and intervals array");
    }

    const notes = Note.calculateNotesFromIntervals(tonic, intervals);

    const getSemitone = (note) => {
      const baseSemitone = Note.semitoneMap[note[0]];
      if (note.length === 1) return baseSemitone;
      if (note[1] === "#") return (baseSemitone + 1) % 12;
      if (note[1] === "b") return (baseSemitone + 11) % 12;
      return baseSemitone;
    };

    const composeNote = (baseLetter, accidental) => baseLetter + (accidental || "");

    const normalizedNotes = [];
    let tonicLetter = tonic[0];
    let tonicIndex = Note.naturalNotes.indexOf(tonicLetter);

    for (let i = 0; i < notes.length; i++) {
      const targetSemitone = getSemitone(notes[i]);
      const expectedLetter = Note.naturalNotes[(tonicIndex + i) % Note.naturalNotes.length];
      const baseSemitone = Note.semitoneMap[expectedLetter];
      let diff = (targetSemitone - baseSemitone + 12) % 12;

      let accidental = "";
      if (diff === 1) accidental = "#";
      else if (diff === 11) accidental = "b";
      else if (diff !== 0) {
        normalizedNotes.push(notes[i]);
        continue;
      }

      normalizedNotes.push(composeNote(expectedLetter, accidental));
    }

    return normalizedNotes;
  }
}
