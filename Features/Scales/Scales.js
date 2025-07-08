export default [
  {
    id: "AMN",
    name: "Αρμονικό μινόρε",
    intervals: [2, 1, 2, 2, 1, 3, 1],
    chords: {
      baseNote: "D",
      chords: ["Dm", "A", "Dm", "Gm", "A", "A#", "A"],
    },
    unitIds: ["KYR5", "HTZ4"],
  },
  {
    id: "DMN",
    name: "Διατονικό μινόρε",
    intervals: [2, 1, 2, 2, 1, 2, 2],
    otherNames: ["Φυσικό μινόρε", "Νησιώτικο μινόρε", "Αιολικός"],
    chords: {
      baseNote: "D",
      chords: ["Dm", "C", "F", "Gm", "Am", "A#", "C"],
    },
    unitIds: ["KYR5", "USK4"],
  },
  {
    id: "KAR",
    name: "Καρτζιγάρ",
    intervals: [2, 1, 2, 1, 3, 1, 2],
    chords: {
      baseNote: "D",
      chords: ["Dm", "Em", "Fm", "G", "Fm", "Em", "C"],
    },
    unitIds: ["KYR4", "HTZ5"],
  },
  {
    id: "KYR",
    name: "Κιουρδί",
    intervals: [2, 1, 2, 2, 2, 1, 2],
    otherNames: ["Δωρικός"],
    chords: {
      baseNote: "D",
      chords: ["Dm", "Em", "F", "G", "Am", "Em", "C"],
    },
    unitIds: ["KYR5", "KYR4"],
  },
  {
    id: "MMN",
    name: "Μελωδικό μινόρε",
    intervals: [2, 1, 2, 2, 2, 2, 1],
    chords: {
      baseNote: "D",
      chords: ["Dm", "Em", "Dm", "G", "A", "Em", "A"],
    },
    unitIds: ["KYR5", "RST4"],
    variants: [
      {
        name: "Κατιούσα",
        intervals: [2, 1, 2, 2, 1, 2, 2],
        unitIds: ["KYR5", "USK4"],
      },
    ],
  },
  {
    id: "NVB",
    name: "Νιαβέντ",
    intervals: [2, 1, 3, 1, 1, 3, 1],
    otherNames: ["Τσιγγάνικο μινόρε"],
    chords: {
      baseNote: "D",
      chords: ["Dm", "A", "Dm", "A#dim", "A", "A#", "C#m"],
    },
    unitIds: ["NKR5", "HTZ4"],
  },
  {
    id: "NKR",
    name: "Νικρίζ",
    intervals: [2, 1, 3, 1, 2, 2, 1],
    chords: {
      baseNote: "D",
      chords: ["Dm", "E", "Dm", "C#m", "A", "E", "C#m"],
    },
    unitIds: ["NKR5", "RST4"],
  },
  {
    id: "UZL",
    name: "Ουζάλ",
    intervals: [1, 3, 1, 2, 2, 1, 2],
    chords: {
      baseNote: "D",
      chords: ["D", "Cm", "Bm", "G", "D", "Bm", "Cm"],
    },
    unitIds: ["HTZ5", "KYR4"],
  },
  {
    id: "USK",
    name: "Ουσάκ",
    intervals: [1, 2, 2, 2, 1, 2, 2],
    otherNames: ["Φρυγικός"],
    chords: {
      baseNote: "D",
      chords: ["Dm", "D#", "F", "Gm", "Dm", "A#", "Cm"],
    },
    unitIds: ["USK5", "USK4"],
  },
  {
    id: "PRT",
    name: "Πειραιώτικος",
    intervals: [1, 3, 2, 1, 1, 3, 1],
    unitIds: ["HTZN5", "HTZ4"],
    variants: [
      {
        name: "Παραλλαγή",
        intervals: [1, 3, 1, 2, 1, 3, 1],
        unitIds: ["HTZ5", "HTZ4"],
      },
    ],
  },
  {
    id: "PMN",
    name: "Ποιμενικό μινόρε",
    intervals: [2, 1, 3, 1, 2, 1, 2],
    otherNames: ["Ρουμάνικο μινόρε", "Σουζινάκ"],
    chords: {
      baseNote: "D",
      chords: ["Dm", "E", "Fm", "E", "Am", "E", "Fm"],
    },
    unitIds: ["NKR5", "KYR4"],
  },
  {
    id: "RST",
    name: "Ραστ",
    intervals: [2, 2, 1, 2, 2, 2, 1],
    otherNames: ["Ματζόρε", "Ιωνικός"],
    chords: {
      baseNote: "D",
      chords: ["D", "Em", "F#m", "G", "A", "Bm", "F#m"],
    },
    unitIds: ["RST5", "RST4"],
    variants: [
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
    intervals: [2, 1, 1, 3, 1, 2, 2],
    chords: {
      baseNote: "D",
      chords: ["Dm", "Em", "F", "F#", "Dm", "A#", "C"],
    },
    variants: [
      {
        name: "Παραλλαγή",
        intervals: [2, 1, 1, 3, 1, 2, 1],
      },
    ],
    unitIds: ["SBH5", "USK4"],
  },
  {
    id: "SGH",
    name: "Σεγκιάχ",
    intervals: [3, 1, 1, 2, 1, 3, 1],
    chords: {
      baseNote: "D",
      chords: ["D", "A#", "F#m", "Gm", "D", "A#", "F#m"],
    },
    unitIds: ["HZM4", "NKR5"],
  },
  {
    id: "TBH",
    name: "Ταμπαχανιώτικος",
    intervals: [2, 2, 1, 2, 1, 3, 1],
    chords: {
      baseNote: "D",
      chords: ["D", "A", "F#m", "Gm", "A", "Gm", "F#m"],
    },
    unitIds: ["RST5", "HTZ4"],
  },
  {
    id: "HTZ",
    name: "Χιτζάζ",
    intervals: [1, 3, 1, 2, 1, 2, 2],
    chords: {
      baseNote: "D",
      chords: ["D", "D#", "D", "Gm", "D", "D#", "Cm"],
    },
    unitIds: ["HTZ4", "KYR5"],
  },
  {
    id: "HTK",
    name: "Χιτζασκιάρ",
    intervals: [1, 3, 1, 2, 1, 3, 1],
    chords: {
      baseNote: "D",
      chords: ["D", "D#", "F#m", "Gm", "D", "D#", "F#m"],
    },
    unitIds: ["HTZ5", "HTZ4"],
  },
  {
    id: "HUM",
    name: "Χουζάμ",
    intervals: [3, 1, 1, 2, 2, 2, 1],
    chords: {
      baseNote: "D",
      chords: ["D", "Gdim", "F#m", "G", "D", "Bm", "F#m"],
    },
    unitIds: ["HZM5", "RST4"],
  },
  {
    id: "HSN",
    name: "Χουσεΐνι",
    intervals: [2, 2, 1, 2, 2, 1, 2],
    otherNames: ["Μιξολυδικός"],
    chords: {
      baseNote: "D",
      chords: ["D", "Em", "Bm", "G", "Am", "Bm", "C"],
    },
    unitIds: ["RST5", "KYR4"],
    variants: [
      {
        name: "Κατιούσα",
        intervals: [2, 1, 2, 2, 1, 2, 2],
        unitIds: ["KYR5", "USK4"],
      },
    ],
  },
];
