export default [
  {
    id: "RAST",
    name: "Ραστ",
    octavePosition: 0,
    variants: [
      {
        id: "RAST_ASC",
        name: "Ανιούσα",
        isMain: true,
        direction: "ASC",
        segments: [
          { id: "RAST", size: 5, position: 0 },
          { id: "RAST", size: 4 },
        ],
        entryNotes: [1, 5],
        endingNote: 1,
        dominantNotes: [1, 3, 5],
      },
      {
        id: "RAST_DESC",
        name: "Κατιούσα",
        direction: "DESC",
        segments: [
          { id: "RAST", size: 5, position: 0 },
          { id: "BUSELIK", size: 4 },
        ],
      },
      {
        id: "RAST_EXTENDED_LOWER",
        name: "Επέκταση χαμηλά",
        segments: [
          { id: "RAST", size: 4, position: -3 },
          { id: "RAST", size: 5 },
          { id: "RAST", size: 4 },
        ],
      },
      {
        id: "RAST_EXTENDED_UPPER",
        name: "Επέκταση ψηλά",
        segments: [
          { id: "RAST", size: 5, position: 0 },
          { id: "RAST", size: 4 },
          { id: "RAST", size: 5 },
        ],
      },
      {
        id: "RAST_SAZKAR",
        name: "Σαζκιάρ",
        segments: [
          { id: "RAST", name: "Ραστ Σαζκιάρ", intervals: [3, 1, 1, 2], position: 0 },
          { id: "RAST", size: 4 },
        ],
      },
    ],
  },
  {
    id: "USAK",
    name: "Ουσάκ",
    octavePosition: 1,
    variants: [
      {
        id: "USAK_ASC",
        name: "Ανιούσα",
        isMain: true,
        direction: "ASC",
        segments: [
          { id: "USAK", size: 4, position: 0 },
          { id: "BUSELIK", size: 5 },
        ],
        entryNotes: [1, 4],
        endingNote: 1,
        dominantNotes: [1, 4],
      },
      {
        id: "USAK_DESC",
        name: "Κατιούσα",
        direction: "DESC",
        segments: [
          { id: "USAK", intervals: [1, 2, 2], position: 0 },
          { id: "BUSELIK", size: 5 },
        ],
      },
      {
        id: "USAK_EXTENDED_LOWER",
        name: "Επέκταση χαμηλά",
        segments: [
          { id: "RAST", size: 5, position: -4 },
          { id: "USAK", size: 4, position: 0 },
          { id: "BUSELIK", size: 5 },
        ],
      },
      {
        id: "USAK_EXTENDED_UPPER",
        name: "Επέκταση ψηλά",
        segments: [
          { id: "USAK", size: 4, position: 0 },
          { id: "BUSELIK", size: 5 },
          { id: "USAK", size: 4 },
        ],
      },
      {
        id: "USAK_RAST",
        name: "Ουσάκ με Ραστ",
        segments: [
          { id: "USAK", size: 4, position: 0 },
          { id: "RAST", size: 5 },
        ],
      },
    ],
  },
  {
    id: "SEGAH",
    name: "Σεγκιάχ",
    octavePosition: 2,
    variants: [
      {
        id: "SEGAH",
        name: "Σεγκιάχ",
        isMain: true,
        direction: "ASC",
        segments: [
          { id: "SEGAH", size: 5, position: 0 },
          { id: "SEGAH", size: 4 },
        ],
        entryNotes: [1, 3],
        endingNote: 1,
        dominantNotes: [1, 3, 5],
      },
      {
        id: "SEGAH_RAST",
        name: "Σεγκιάχ με Ραστ",
        direction: "ASC",
        segments: [
          { id: "SEGAH", size: 3, position: 0 },
          { id: "RAST", size: 5 },
        ],
      },
    ],
  },
  {
    id: "HUSEYINI",
    name: "Χουσεϊνί",
    octavePosition: 1,
    variants: [
      {
        id: "HUSEYINI",
        name: "Χουσεϊνί",
        isMain: true,
        direction: "ASC|DESC",
        segments: [
          { id: "USAK", size: 5, position: 0 },
          { id: "RAST", size: 5, position: 3 },
          { id: "USAK", size: 4, position: 4 },
        ],
        entryNotes: [5],
        endingNote: 1,
        dominantNotes: [1, 4, 5],
      },
      {
        id: "HUSEYNI_DESC",
        name: "Κατιούσα",
        direction: "DESC",
        segments: [
          { id: "USAK", size: 5, position: 0 },
          { id: "BUSELIK", size: 5, position: 3 },
        ],
      },
    ],
  },
  {
    id: "SABAH",
    name: "Σαμπάχ",
    octavePosition: 1,
    variants: [
      {
        id: "SABAH",
        name: "Σαμπάχ",
        isMain: true,
        direction: "ASC",
        segments: [
          { id: "SABAH", size: 4, position: 0 },
          { id: "HIJAZ", size: 5, position: 2 },
        ],
        entryNotes: [1, 3],
        endingNote: 1,
        dominantNotes: [1, 3],
      },
      {
        id: "SABAH_EXTENDED_UPPER_HIJAZ",
        name: "Επέκταση ψηλά με Χιτζάζ",
        segments: [
          { id: "SABAH", size: 4, position: 0 },
          { id: "HIJAZ", size: 5, position: 2 },
          { id: "HIJAZ", size: 4, position: 6 },
        ],
      },
      {
        id: "SABAH_EXTENDED_UPPER_NIKRIZ",
        name: "Επέκταση ψηλά με Νικρίζ",
        segments: [
          { id: "SABAH", size: 4, position: 0 },
          { id: "HIJAZ", size: 5, position: 2 },
          { id: "NIKRIZ", size: 5, position: 5 },
        ],
      },
    ],
  },
  {
    id: "HUZAM",
    name: "Χουζάμ",
    octavePosition: 2,
    variants: [
      {
        id: "HUZAM",
        name: "Χουζάμ",
        isMain: true,
        direction: "ASC|DESC",
        segments: [
          { id: "HUZAM", size: 5, position: 0 },
          { id: "HIJAZ", size: 5, position: 2 },
        ],
        entryNotes: [3],
        endingNote: 1,
        dominantNotes: [1, 3],
      },
    ],
  },
  {
    id: "HIJAZ",
    name: "Χιτζάζ",
    octavePosition: 1,
    variants: [
      {
        id: "HIJAZ_ASC",
        name: "Ανιούσα",
        isMain: true,
        direction: "ASC",
        segments: [
          { id: "HIJAZ", size: 4, position: 0 },
          { id: "RAST", size: 5 },
        ],
        entryNotes: [1, 4],
        endingNote: 1,
        dominantNotes: [1, 4],
      },
      {
        id: "HIJAZ_DESC",
        name: "Κατιούσα",
        isMain: true,
        direction: "DESC",
        segments: [
          { id: "HIJAZ", size: 4, position: 0 },
          { id: "USAK", size: 5 },
        ],
        entryNotes: [1, 4],
        endingNote: 1,
        dominantNotes: [1, 4],
      },
    ],
  },
];
