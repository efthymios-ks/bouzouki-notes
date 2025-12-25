export default [
  {
    id: "RAST",
    name: "Ραστ",
    octavePosition: 0,
    mainVariant: {
      id: "RAST_ASC",
      name: "Ανιούσα",
      isHidden: false,
      direction: "ASC",
      segments: [
        { id: "RAST", size: 5, position: 0 },
        { id: "RAST", size: 4 },
      ],
      entryNotes: [1, 5],
      endingNote: 1,
      dominantNotes: [1, 3, 5],
    },
    variants: [
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
        name: "Επέκταση κάτω της οκτάβας",
        isHidden: true,
        segments: [
          { id: "RAST", size: 4, position: -3 },
          { id: "RAST", size: 5 },
          { id: "RAST", size: 4 },
        ],
      },
      {
        id: "RAST_EXTENDED_UPPER",
        name: "Επέκταση άνω της οκτάβας",
        isHidden: true,
        segments: [
          { id: "RAST", size: 5, position: 0 },
          { id: "RAST", size: 4 },
          { id: "RAST", size: 5 },
        ],
      },
      {
        id: "RAST_SAZKAR",
        name: "Σαζκιάρ",
        isHidden: true,
        segments: [
          { id: "SAZKAR", size: 5, position: 0 },
          { id: "RAST", size: 4 },
        ],
      },
    ],
  },
  {
    id: "USAK",
    name: "Ουσάκ",
    octavePosition: 1,
    mainVariant: {
      id: "USAK_ASC",
      name: "Ανιούσα",
      isHidden: false,
      direction: "ASC",
      segments: [
        { id: "USAK", size: 4, position: 0 },
        { id: "BUSELIK", size: 5 },
      ],
      entryNotes: [1, 4],
      endingNote: 1,
      dominantNotes: [1, 4],
    },
    variants: [
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
        name: "Επέκταση κάτω της οκτάβας",
        isHidden: true,
        segments: [
          { id: "RAST", size: 5, position: -4 },
          { id: "USAK", size: 4, position: 0 },
          { id: "BUSELIK", size: 5 },
        ],
      },
      {
        id: "USAK_EXTENDED_UPPER",
        name: "Επέκταση άνω της οκτάβας",
        isHidden: true,
        segments: [
          { id: "USAK", size: 4, position: 0 },
          { id: "BUSELIK", size: 5 },
          { id: "USAK", size: 4 },
        ],
      },
      {
        id: "USAK_RAST",
        name: "Ουσάκ με Ραστ",
        isHidden: true,
        segments: [
          { id: "USAK", size: 4, position: 0 },
          { id: "RAST", size: 5 },
        ],
      },
    ],
  },
];
