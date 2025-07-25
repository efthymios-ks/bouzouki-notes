export default [
  {
    id: "KAR",
    name: "Καρσιγάρ",
    variants: [
      {
        intervals: [2, 1, 2, 1, 3, 1, 2],
        chords: {
          baseNote: "D",
          chords: ["Dm", "Em", "Fm", "G", "Fm", "Em", "C"],
        },
        unitIds: ["KYR4", "HTZ5"],
      },
    ],
  },
  {
    id: "KYR",
    name: "Κιουρδί",
    variants: [
      {
        intervals: [2, 1, 2, 2, 2, 1, 2],
        chords: {
          baseNote: "D",
          chords: ["Dm", "Em", "F", "G", "Am", "Em", "C"],
        },
        unitIds: ["KYR5", "KYR4"],
        otherNames: ["Δωρικός"],
      },
    ],
  },
  {
    id: "MNA",
    name: "Μινόρε Αρμονικό",
    variants: [
      {
        intervals: [2, 1, 2, 2, 1, 3, 1],
        chords: {
          baseNote: "D",
          chords: ["Dm", "A", "Dm", "Gm", "A", "A#", "A"],
        },
        unitIds: ["KYR5", "HTZ4"],
      },
    ],
  },
  {
    id: "MMN",
    name: "Μινόρε Μελωδικό",
    variants: [
      {
        name: "Ανιούσα",
        intervals: [2, 1, 2, 2, 2, 2, 1],
        chords: {
          baseNote: "D",
          chords: ["Dm", "Em", "Dm", "G", "A", "Em", "A"],
        },
        unitIds: ["KYR5", "RST4"],
      },
      {
        name: "Κατιούσα",
        intervals: [2, 1, 2, 2, 1, 2, 2],
        unitIds: ["KYR5", "USK4"],
      },
    ],
  },
  {
    id: "MNF",
    name: "Μινόρε Φυσικό",
    variants: [
      {
        intervals: [2, 1, 2, 2, 1, 2, 2],
        chords: {
          baseNote: "D",
          chords: ["Dm", "C", "F", "Gm", "Am", "A#", "C"],
        },
        unitIds: ["KYR5", "USK4"],
        otherNames: ["Διατονικό μινόρε", "Νησιώτικο μινόρε"],
      },
    ],
  },
  {
    id: "NVB",
    name: "Νιαβέντ",
    variants: [
      {
        intervals: [2, 1, 3, 1, 1, 3, 1],
        chords: {
          baseNote: "D",
          chords: ["Dm", "A", "Dm", "A#dim", "A", "A#", "C#m"],
        },
        unitIds: ["NKR5", "HTZ4"],
        otherNames: ["Τσιγγάνικο μινόρε"],
      },
    ],
  },
  {
    id: "NKR",
    name: "Νικρίζ",
    variants: [
      {
        intervals: [2, 1, 3, 1, 2, 1, 2],
        chords: {
          baseNote: "D",
          chords: ["Dm", "E", "Fm", "E", "Am", "E", "F"],
        },
        unitIds: ["NKR5", "KYR4"],
      },
    ],
  },
  {
    id: "USK",
    name: "Ουσάκ",
    variants: [
      {
        intervals: [1, 2, 2, 2, 1, 2, 2],
        chords: {
          baseNote: "D",
          chords: ["Dm", "D#", "F", "Gm", "Dm", "A#", "Cm"],
        },
        unitIds: ["USK5", "USK4"],
      },
    ],
  },
  {
    id: "PRT",
    name: "Πειραιώτικος",
    variants: [
      {
        intervals: [1, 3, 2, 1, 1, 3, 1],
        unitIds: ["HTZN5", "HTZ4"],
      },
      {
        name: "Παραλλαγή",
        intervals: [1, 3, 1, 2, 1, 3, 1],
        unitIds: ["HTZ5", "HTZ4"],
      },
    ],
  },
  {
    id: "SZN",
    name: "Σουζινάκ",
    variants: [
      {
        intervals: [2, 1, 3, 1, 2, 1, 2],
        chords: {
          baseNote: "D",
          chords: ["Dm", "E", "Fm", "E", "Am", "E", "Fm"],
        },
        unitIds: ["NKR5", "KYR4"],
        otherNames: ["Ποιμενικό μινόρε", "Ρουμάνικο μινόρε"],
      },
    ],
  },
  {
    id: "RST",
    name: "Ραστ",
    variants: [
      {
        name: "Ανιούσα",
        intervals: [2, 2, 1, 2, 2, 2, 1],
        chords: {
          baseNote: "D",
          chords: ["D", "Em", "F#m", "G", "A", "Bm", "F#m"],
        },
        unitIds: ["RST5", "RST4"],
        otherNames: ["Ματζόρε"],
      },
      {
        name: "Κατιούσα",
        intervals: [2, 2, 1, 2, 2, 1, 2],
        unitIds: ["RST5", "KYR4"],
      },
    ],
  },
  {
    id: "SBH",
    name: "Σαμπάχ",
    variants: [
      {
        intervals: [2, 1, 1, 3, 1, 2, 2],
        chords: {
          baseNote: "D",
          chords: ["Dm", "Am", "F", "D", "Am", "A#", "F"],
        },
        unitIds: ["SBH5", "USK4"],
      },
      {
        name: "Παραλλαγή",
        intervals: [2, 1, 1, 3, 1, 2, 1],
      },
    ],
  },
  {
    id: "SGH",
    name: "Σεγκιάχ",
    variants: [
      {
        intervals: [3, 1, 1, 2, 2, 2, 1],
        chords: {
          baseNote: "D",
          chords: ["D", "Gdim", "F#m", "G", "D", "Bm", "F#m"],
        },
        unitIds: ["HZM5", "RST4"],
      },
      {
        name: "Κατιούσα",
        intervals: [3, 1, 1, 2, 2, 1, 2],
        chords: {
          baseNote: "D",
          chords: ["D", "Gdim", "Bm", "G", "D", "Bm", "Ddim"],
        },
        unitIds: ["HZM5", "KYR4"],
      },
    ],
  },
  {
    id: "TBH",
    name: "Ταμπαχανιώτικος",
    variants: [
      {
        intervals: [2, 2, 1, 2, 1, 3, 1],
        chords: {
          baseNote: "D",
          chords: ["D", "A", "F#m", "Gm", "A", "Gm", "F#m"],
        },
        unitIds: ["RST5", "HTZ4"],
      },
    ],
  },
  {
    id: "HTZ",
    name: "Χιτζάζ",
    variants: [
      {
        intervals: [1, 3, 1, 2, 1, 2, 2],
        chords: {
          baseNote: "D",
          chords: ["D", "D#", "D", "Gm", "D", "D#", "Cm"],
        },
        unitIds: ["HTZ4", "KYR5"],
      },
    ],
  },
  {
    id: "HTK",
    name: "Χιτζασκιάρ",
    variants: [
      {
        intervals: [1, 3, 1, 2, 1, 3, 1],
        chords: {
          baseNote: "D",
          chords: ["D", "D#", "F#m", "Gm", "D", "D#", "F#m"],
        },
        unitIds: ["HTZ5", "HTZ4"],
      },
    ],
  },
  {
    id: "HUM",
    name: "Χουζάμ",
    variants: [
      {
        intervals: [3, 1, 1, 2, 1, 3, 1],
        chords: {
          baseNote: "D",
          chords: ["D", "A#", "F#m", "Gm", "D", "A#", "F#m"],
        },
        unitIds: ["HZM5", "HTZ4"],
      },
    ],
  },
  {
    id: "HSN",
    name: "Χουσεϊνί",
    variants: [
      {
        name: "Ανιούσα",
        intervals: [2, 2, 1, 2, 2, 1, 2],
        chords: {
          baseNote: "D",
          chords: ["D", "Em", "Bm", "G", "Am", "Bm", "C"],
        },
        unitIds: ["RST4", "RST5"],
      },
      {
        name: "Κατιούσα",
        intervals: [2, 1, 2, 2, 1, 2, 2],
        chords: {
          baseNote: "D",
          chords: ["Dm", "C", "F", "Gm", "Am", "A#", "C"],
        },
        unitIds: ["KYR4", "KYR5"],
      },
    ],
  },
];
