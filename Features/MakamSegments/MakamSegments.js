export default [
  {
    id: "RAST",
    name: "Ραστ",
    intervals: [
      [2, 2, 1],
      [2, 2, 1, 2],
    ],
    leadingInterval: 1,
    placements: [
      { octavePosition: 0, length: 5 },
      { octavePosition: 4, length: 4 },
      { octavePosition: -3, length: 4 },
      { octavePosition: 7, length: 4 },
    ],
  },
  {
    id: "USAK",
    name: "Ουσάκ",
    intervals: [
      [2, 1, 2],
      [2, 1, 2, 2],
    ],
    leadingInterval: 1,
    placements: [
      { octavePosition: 1, length: 4 },
      { octavePosition: 1, length: 5 },
      { octavePosition: 5, length: 4 },
      { octavePosition: 8, length: 4 },
    ],
    notes: ["Η δεύτερη βαθμίδα έλκεται από τη βάση στις καταληκτικές φράσεις και γίνεται Η-Τ-Τ"],
  },
  {
    id: "SEGIAH",
    name: "Σεγκιάχ",
    intervals: [
      [1, 2],
      [1, 2, 2],
      [1, 2, 2, 2],
    ],
    leadingInterval: 1,
    placements: [
      { octavePosition: 2, length: 3 },
      { octavePosition: 2, length: 4 },
      { octavePosition: 2, length: 5 },
      { octavePosition: 6, length: 4 },
      { octavePosition: 6, length: 5 },
      { octavePosition: -1, length: 4 },
      { octavePosition: -1, length: 5 },
    ],
  },
  {
    id: "KYRDI",
    name: "Κιουρντί",
    intervals: [
      [1, 2, 2],
      [1, 2, 2, 2],
    ],
    leadingInterval: 2,
    placements: [
      { octavePosition: 1, length: 4 },
      { octavePosition: 1, length: 5 },
    ],
  },
  {
    id: "HIJAZ",
    name: "Χιτζάζ",
    intervals: [
      [1, 3, 1],
      [1, 3, 1, 2],
    ],
    leadingInterval: 2,
    placements: [
      { octavePosition: 1, length: 4 },
      { octavePosition: 1, length: 5 },
      { octavePosition: 0, length: 5 },
      { octavePosition: 4, length: 4 },
      { octavePosition: 3, length: 5 },
    ],
    notes: ["Μπορεί να εμφανιστεί με προσαγωγέα ημιτόνιο όπου και ονομάζεται Ζιργκιουλελί Χιτζάζ"],
  },
  {
    id: "NIKRIZ",
    name: "Νικρίζ",
    intervals: [[2, 1, 3, 1]],
    leadingInterval: 1,
    placements: [
      { octavePosition: 3, length: 5 },
      { octavePosition: 4, length: 5 },
    ],
  },
  {
    id: "HUZAM",
    name: "Χουζάμ",
    intervals: [[1, 2, 1, 3]],
    leadingInterval: 1,
    placements: [{ octavePosition: 2, length: 5 }],
  },
  {
    id: "SABAH",
    name: "Σαμπάχ",
    intervals: [[2, 1, 1]],
    leadingInterval: 2,
    placements: [{ octavePosition: 1, length: 4 }],
  },
];
