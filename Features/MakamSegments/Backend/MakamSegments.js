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
    id: "SAZKAR",
    name: "Ραστ Σαζκιάρ",
    intervals: [[3, 1, 1, 2]],
    leadingInterval: 1,
    placements: [{ octavePosition: 0, length: 5 }],
    notes: ["Ό,τι ισχύει και στο Ραστ με μονιμοποίηση της έλξης της 2ης βαθμίδας από την 1η"],
  },
  {
    id: "USAK",
    name: "Ουσάκ",
    intervals: [
      [2, 1, 2],
      [2, 1, 2, 2],
    ],
    leadingInterval: 2,
    placements: [
      { octavePosition: 1, length: 4 },
      { octavePosition: 1, length: 5 },
      { octavePosition: 5, length: 4 },
      { octavePosition: 8, length: 4 },
    ],
    notes: [
      "Η 2η βαθμίδα έλκεται από την 1η στις καταληκτικές φράσεις (κατιούσα κίνηση) και γίνεται Η-Τ-Τ",
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
    id: "BUSELIK",
    name: "Μπουσελίκ",
    intervals: [
      [2, 1, 2],
      [2, 1, 2, 2],
    ],
    leadingInterval: 1,
    placements: [
      { octavePosition: 1, length: 4 },
      { octavePosition: 1, length: 5 },
    ],
  },
  {
    id: "NIAVEND",
    name: "Νιαβέντ",
    intervals: [
      [2, 1, 2],
      [2, 1, 2, 2],
    ],
    leadingInterval: 1,
    placements: [
      { octavePosition: 0, length: 4 },
      { octavePosition: 0, length: 5 },
    ],
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
      { octavePosition: 3, length: 5 },
      { octavePosition: 4, length: 4 },
    ],
  },
  {
    id: "ZIRGULELI_HIJAZ",
    name: "Ζιργκιουλελί Χιτζάζ",
    intervals: [[1, 3, 1]],
    leadingInterval: 1,
    placements: [{ octavePosition: 1, length: 4 }],
    notes: ["Ισχύει ό,τι και στο Χιτζάζ, αλλά με προσαγωγέα ημιτόνιο αντί για τόνο"],
  },
  {
    id: "PIRAIOTIKO",
    name: "Πειραιώτικο",
    intervals: [[1, 3, 2, 1]],
    leadingInterval: 1,
    placements: [{ octavePosition: 0, length: 5 }],
    notes: ["Παραλλαγή Χιτζάζ με μονιμοποίηση της έλξης της 5ης βαθμίδας από την 4η"],
  },
  {
    id: "NIKRIZ",
    name: "Νικρίζ",
    intervals: [[2, 1, 3, 1]],
    leadingInterval: 1,
    placements: [
      { octavePosition: 0, length: 5 },
      { octavePosition: 3, length: 5 },
      { octavePosition: 4, length: 5 },
    ],
    notes: ["Πρόκειται για Χιτζάζ με τόνο στη βάση αντί στη κορυφή"],
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
