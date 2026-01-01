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
    const semitones = Note.countSemitones(key);
    const newSemitones = (semitones + interval + 12) % 12;
    return Note.sharpNotes[newSemitones];
  }

  static countSemitones(note, baseNote = "C") {
    const key = note instanceof Note ? note.key : note;
    const base = key[0];
    const accidentalChar = key[1];
    const accidental = accidentalChar === "#" ? 1 : accidentalChar === "b" ? -1 : 0;

    const semitonesFromC = (Note.semitoneMap[base] + accidental + 12) % 12;
    const baseSemitone = Note.semitoneMap[baseNote];
    return (semitonesFromC - baseSemitone + 12) % 12;
  }

  static intervalsToNotes(tonic, intervals) {
    if (!tonic || !intervals || !Array.isArray(intervals)) {
      throw new Error("tonic and intervals are required");
    }

    const semitoneToNote = Note.sharpNotes.reduce((acc, note, index) => {
      acc[index % 12] = note;
      return acc;
    }, {});

    let currentSemitone = Note.countSemitones(tonic);
    const notes = [tonic];

    for (const step of intervals) {
      currentSemitone = (currentSemitone + step) % 12;
      notes.push(semitoneToNote[currentSemitone]);
    }

    return notes;
  }

  static intervalsToNormalizedNotes(tonic, intervals) {
    if (!tonic || !intervals || !Array.isArray(intervals)) {
      throw new Error("tonic and intervals are required");
    }

    const notes = Note.intervalsToNotes(tonic, intervals);
    const composeNote = (baseLetter, accidental) => baseLetter + (accidental || "");

    const normalizedNotes = [];
    let tonicLetter = tonic[0];
    let tonicIndex = Note.naturalNotes.indexOf(tonicLetter);

    for (let i = 0; i < notes.length; i++) {
      const targetSemitone = Note.countSemitones(notes[i]);
      const expectedLetter = Note.naturalNotes[(tonicIndex + i) % Note.naturalNotes.length];
      const baseSemitone = Note.semitoneMap[expectedLetter];
      let diff = (targetSemitone - baseSemitone + 12) % 12;

      let accidental = "";
      if (diff === 1) {
        accidental = "#";
      } else if (diff === 11) {
        accidental = "b";
      } else if (diff !== 0) {
        normalizedNotes.push(notes[i]);
        continue;
      }

      normalizedNotes.push(composeNote(expectedLetter, accidental));
    }

    return normalizedNotes;
  }
}
