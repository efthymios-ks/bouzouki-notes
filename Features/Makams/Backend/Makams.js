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
        isMain: true,
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
    id: "USSAK",
    name: "Ουσάκ",
    octavePosition: 1,
    variants: [
      {
        id: "USSAK_ASC",
        name: "Ανιούσα",
        isMain: true,
        direction: "ASC",
        segments: [
          { id: "USSAK", size: 4, position: 0 },
          { id: "BUSELIK", size: 5 },
        ],
        entryNotes: [1, 4],
        endingNote: 1,
        dominantNotes: [1, 4],
      },
      {
        id: "USSAK_DESC",
        name: "Κατιούσα",
        isMain: true,
        direction: "DESC",
        segments: [
          { id: "USSAK", intervals: [1, 2, 2], position: 0 },
          { id: "BUSELIK", size: 5 },
        ],
      },
      {
        id: "USSAK_EXTENDED_LOWER",
        name: "Επέκταση χαμηλά",
        segments: [
          { id: "RAST", size: 5, position: -4 },
          { id: "USSAK", size: 4, position: 0 },
          { id: "BUSELIK", size: 5 },
        ],
      },
      {
        id: "USSAK_EXTENDED_UPPER",
        name: "Επέκταση ψηλά",
        segments: [
          { id: "USSAK", size: 4, position: 0 },
          { id: "BUSELIK", size: 5 },
          { id: "USSAK", size: 4 },
        ],
      },
      {
        id: "USSAK_RAST",
        name: "Ουσάκ με Ραστ",
        segments: [
          { id: "USSAK", size: 4, position: 0 },
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
        entryNotes: [1, 5],
        endingNote: 1,
        dominantNotes: [1, 5],
      },
      {
        id: "SEGAH_RAST_ASC",
        name: "Σεγκιάχ με Ραστ (Ανιούσα)",
        direction: "ASC",
        segments: [
          { id: "SEGAH", size: 3, position: 0 },
          { id: "RAST", size: 5 },
        ],
        dominantNotes: [1, 3],
      },
      {
        id: "SEGAH_RAST_DESC",
        name: "Σεγκιάχ με Ραστ (Κατιούσα)",
        direction: "DESC",
        segments: [
          { id: "SEGAH", size: 3, position: 0 },
          { id: "BUSELIK", size: 5 },
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
          { id: "USSAK", size: 5, position: 0 },
          { id: "RAST", size: 5, position: 3 },
          { id: "USSAK", size: 4, position: 4 },
        ],
        entryNotes: [5],
        endingNote: 1,
        dominantNotes: [1, 4, 5],
      },
      {
        id: "HUSEYNI_DESC",
        name: "Κατιούσα",
        isMain: true,
        direction: "DESC",
        segments: [
          { id: "USSAK", size: 5, position: 0 },
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
        dominantNotes: [1, 3, 7],
      },
      {
        id: "SABAH_EXTENDED_UPPER_NIKRIZ",
        name: "Επέκταση ψηλά με Νικρίζ",
        segments: [
          { id: "SABAH", size: 4, position: 0 },
          { id: "HIJAZ", size: 5, position: 2 },
          { id: "NIKRIZ", size: 5, position: 5 },
        ],
        dominantNotes: [1, 3, 6],
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
          { id: "USSAK", size: 5 },
        ],
      },
    ],
  },
  {
    id: "UZZAL",
    name: "Ουζάλ",
    octavePosition: 1,
    variants: [
      {
        id: "UZZAL_ASC",
        name: "Ανιούσα",
        isMain: true,
        direction: "ASC|DESC",
        segments: [
          { id: "HIJAZ", size: 5, position: 0 },
          { id: "RAST", size: 5, position: 3 },
          { id: "USSAK", size: 4, position: 4 },
        ],
        entryNotes: [5],
        endingNote: 1,
        dominantNotes: [1, 4, 5],
      },
      {
        id: "UZZAL_DESC",
        name: "Κατιούσα",
        isMain: true,
        direction: "DESC",
        segments: [
          { id: "HIJAZ", size: 5, position: 0 },
          { id: "BUSELIK", size: 5, position: 3 },
          { id: "USSAK", intervals: [1, 2, 2], position: 4 },
        ],
      },
    ],
  },
  {
    id: "HIJAZ_ZIRGULELI",
    name: "Ζιργκιουλελί Χιτζάζ",
    octavePosition: 1,
    variants: [
      {
        id: "HIJAZ_ZIRGULELI",
        name: "Ζιργκιουλελί Χιτζάζ",
        isMain: true,
        direction: "ASC",
        segments: [
          { id: "HIJAZ_ZIRGULELI", size: 5, position: 0 },
          { id: "HIJAZ", size: 4 },
        ],
        entryNotes: [1, 5],
        endingNote: 1,
        dominantNotes: [1, 5],
      },
      {
        id: "HIJAZ_ZIRGULELI_WITH_HIJAZ",
        name: "Ζιργκιουλελί Χιτζάζ με απλό Χιτζάζ",
        isMain: true,
        segments: [
          { id: "HIJAZ", size: 4, position: 0 },
          { id: "BUSELIK", size: 5 },
        ],
        dominantNotes: [1, 4],
      },
    ],
  },
  {
    id: "NIKRIZ",
    name: "Νικρίζ",
    octavePosition: 0,
    variants: [
      {
        id: "NIKRIZ_ASC",
        name: "Ανιούσα",
        isMain: true,
        direction: "ASC",
        segments: [
          { id: "NIKRIZ", size: 5, position: 0 },
          { id: "RAST", size: 4 },
        ],
        entryNotes: [1, 5],
        endingNote: 1,
        dominantNotes: [1, 5],
      },
      {
        id: "NIKRIZ_DESC",
        name: "Κατιούσα",
        isMain: true,
        direction: "DESC",
        segments: [
          { id: "NIKRIZ", size: 5, position: 0 },
          { id: "BUSELIK", size: 4 },
        ],
      },
    ],
  },
  {
    id: "KARCIGAR",
    name: "Καρτσιγιάρ",
    octavePosition: 1,
    variants: [
      {
        id: "KARCIGAR_ASC",
        name: "Ανιούσα",
        isMain: true,
        direction: "ASC|DESC",
        segments: [
          { id: "USSAK", size: 4, position: 0 },
          { id: "NIKRIZ", size: 5, position: 2 },
          { id: "HIJAZ", size: 5, position: 3 },
        ],
        entryNotes: [4],
        endingNote: 1,
        dominantNotes: [1, 3, 4],
      },
      {
        id: "KARCIGAR_DESC",
        name: "Κατιούσα",
        isMain: true,
        direction: "DESC",
        segments: [
          { id: "USSAK", intervals: [1, 2, 2], position: 0 },
          { id: "NIKRIZ", size: 5, position: 2 },
          { id: "HIJAZ", size: 5, position: 3 },
        ],
      },
    ],
  },
  {
    id: "MUHAYER",
    name: "Μουχαγιέρ",
    octavePosition: 1,
    variants: [
      {
        id: "MUHAYER_DESC",
        name: "Κατιούσα",
        isMain: true,
        direction: "DESC",
        segments: [
          { id: "USSAK", size: 5, position: 0 },
          { id: "USSAK", intervals: [1, 2, 2] },
        ],
        entryNotes: [8],
        endingNote: 1,
        dominantNotes: [1, 5, 8],
      },
      {
        id: "MUHAYER_ASC",
        name: "Ανιούσα",
        isMain: true,
        direction: "ASC",
        segments: [
          { id: "USSAK", size: 5, position: 0 },
          { id: "USSAK", size: 4 },
        ],
      },
      {
        id: "MUHAYER_EXTENDED_HIGHER",
        name: "Επεκταση ψηλά",
        segments: [
          { id: "USSAK", size: 5, position: 0 },
          { id: "USSAK", intervals: [1, 2, 2] },
          { id: "USSAK", size: 4 },
        ],
      },
    ],
  },
  {
    id: "HIJAZKAR",
    name: "Χιτζασκιάρ",
    octavePosition: 0,
    variants: [
      {
        id: "HIJAZKAR",
        name: "Χιτζασκιάρ",
        isMain: true,
        direction: "DESC",
        segments: [
          { id: "HIJAZ", size: 5, position: 0, leadingInterval: 1 },
          { id: "NIKRIZ", size: 5, position: 3 },
          { id: "HIJAZ", size: 4, position: 4 },
        ],
        entryNotes: [8],
        endingNote: 1,
        dominantNotes: [1, 4, 5, 8],
      },
      {
        id: "HIJAZKAR_EXTENDED_HIGHER_HIJAZ",
        name: "Επέκταση ψηλά με Χιτζάζ",
        segments: [
          { id: "HIJAZ", size: 5, position: 0, leadingInterval: 1 },
          { id: "HIJAZ", size: 4, position: 4 },
          { id: "HIJAZ", size: 5, position: 7 },
        ],
      },
      {
        id: "HIJAZKAR_EXTENDED_HIGHER_BUSELIK",
        name: "Επέκταση ψηλά με Μπουσελίκ",
        segments: [
          { id: "HIJAZ", size: 5, position: 0, leadingInterval: 1 },
          { id: "HIJAZ", size: 4, position: 4 },
          { id: "BUSELIK", size: 5, position: 7 },
        ],
        dominantNotes: [1, 5, 8],
      },
    ],
  },
  {
    id: "SUZINAK_ZIRGULELI",
    name: "Ζιργκιουλελί Σουζινάκ",
    octavePosition: 0,
    variants: [
      {
        id: "SUZINAK_ZIRGULELI",
        name: "Ζιργκιουλελί Χιτζάζ",
        isMain: true,
        direction: "ASC|DESC",
        segments: [
          { id: "HIJAZ_ZIRGULELI", size: 5, position: 0 },
          { id: "HIJAZ", size: 4 },
        ],
        entryNotes: [5],
        endingNote: 1,
        dominantNotes: [1, 3, 5],
      },
    ],
  },
  {
    id: "SUZINAK_ZIRGULELI_PIREOTIKO",
    name: "Πειραιώτικος",
    octavePosition: 0,
    variants: [
      {
        id: "SUZINAK_ZIRGULELI_PIREOTIKO",
        name: "Πειραιώτικος",
        isMain: true,
        direction: "ASC|DESC",
        segments: [
          { id: "PIREOTIKO", size: 5, position: 0 },
          { id: "HIJAZ", size: 4 },
        ],
        entryNotes: [5],
        endingNote: 1,
        dominantNotes: [1, 3, 5],
      },
    ],
  },
  {
    id: "BUSELIK",
    name: "Μπουσελίκ",
    octavePosition: 1,
    variants: [
      {
        id: "BUSELIK_RAST",
        name: "Μπουσελίκ με Ραστ",
        isMain: true,
        direction: "ASC|DESC",
        segments: [
          { id: "RAST", size: 4, position: -1 },
          { id: "BUSELIK", size: 5, position: 0 },
          { id: "CARGAH", size: 5, position: 2 },
        ],
        entryNotes: [3],
        endingNote: 1,
        dominantNotes: [0, 1, 3],
      },
      {
        id: "BUSELIK",
        name: "Μπουσελίκ",
        segments: [
          { id: "BUSELIK", size: 5, position: 0 },
          { id: "CARGAH", size: 5, position: 2 },
        ],
      },
    ],
  },
  {
    id: "NIHAVENT",
    name: "Νιαβέντ",
    octavePosition: 0,
    variants: [
      {
        id: "NIHAVENT_HIJAZ",
        name: "Νιαβέντ με Χιτζάζ",
        isMain: true,
        direction: "ASC",
        segments: [
          { id: "NIHAVEND", size: 5, position: 0 },
          { id: "HIJAZ", size: 4, position: 4 },
        ],
        entryNotes: [5],
        endingNote: 1,
        dominantNotes: [1, 4, 5],
      },
      {
        id: "NIHAVENT",
        name: "Νιαβέντ",
        isMain: true,
        segments: [
          { id: "NIHAVEND", size: 5, position: 0 },
          { id: "NIHAVEND", size: 5, position: 3 },
        ],
      },
    ],
  },
  {
    id: "NEVESER",
    name: "Νεβεσέρ",
    octavePosition: 0,
    variants: [
      {
        id: "NEVESER",
        name: "Νεβεσέρ",
        isMain: true,
        direction: "ASC",
        segments: [
          { id: "NIKRIZ", size: 5, position: 0 },
          { id: "HIJAZ", size: 4 },
        ],
        entryNotes: [1, 5],
        endingNote: 1,
        dominantNotes: [1, 5],
      },
    ],
  },
];
