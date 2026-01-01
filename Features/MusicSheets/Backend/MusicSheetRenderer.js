const sheetOptions = {
  noteDuration: "w",
  minWidth: 768,
  scale: 1.0,
};

function toVexTab(options) {
  const { notes: inputNotes, texts = {} } = options;

  function parseNote(rwaNote) {
    const accidentalMap = { "#": "#", b: "@" };
    let [, note, accidental, octave] = rwaNote.match(/^([A-G])(#|b)?(\d)$/);
    accidental = accidentalMap[accidental] || "";
    return { note: note + accidental, octave: Number(octave) };
  }

  function getVtNotes() {
    const block = { notes: [], labels: [] };
    inputNotes.forEach((inputeNote) => {
      const { note, octave } = parseNote(inputeNote.note);
      block.notes.push(`${note}/${octave}`);
      block.labels.push(inputeNote.label);
    });

    return `notes :${sheetOptions.noteDuration} ${block.notes.join(
      "-"
    )} $.bottom.${block.labels.join(",")}$`;
  }

  function getVtText() {
    const mappedNotes = inputNotes.map((_, i) => texts[i] ?? " ");
    while (mappedNotes.at(-1) === " ") {
      mappedNotes.pop();
    }

    if (mappedNotes.length === 0) {
      return "";
    }

    return `text :${sheetOptions.noteDuration},${mappedNotes.join(",")}`;
  }

  const lines = [
    `options font-size=8`,
    `tabstave notation=true tablature=false`,
    getVtNotes(),
    getVtText(),
  ];
  return lines.filter(Boolean).join("\n");
}

function setVexTabProperties(sheetDiv) {
  const propertiesToAdd = {
    width: `${sheetOptions.minWidth}`,
    scale: `${sheetOptions.scale}`,
    editor: "false",
  };

  const stylesToAdd = { maxWidth: `${sheetOptions.minWidth}px`, overflowX: "auto" };

  for (const [key, value] of Object.entries(propertiesToAdd)) {
    if (!sheetDiv.hasAttribute(key)) {
      sheetDiv.setAttribute(key, value);
    }
  }

  for (const [key, value] of Object.entries(stylesToAdd)) {
    if (!sheetDiv.style[key]) {
      sheetDiv.style[key] = value;
    }
  }
}

export function render(sheetDiv, options) {
  // Clean up previous rendering
  sheetDiv.querySelectorAll("svg").forEach((svg) => svg.remove());

  // Render
  const VexTab = window.vextab;
  const VF = VexTab.Vex.Flow;

  const renderer = new VF.Renderer(sheetDiv, VF.Renderer.Backends.SVG);
  const artist = new VexTab.Artist(10, 10, sheetOptions.minWidth * 1.5, {
    scale: sheetOptions.scale,
  });
  const tab = new VexTab.VexTab(artist);

  setVexTabProperties(sheetDiv);
  const vtCode = toVexTab(options);

  try {
    tab.parse(vtCode);
    artist.render(renderer);
  } catch (error) {
    console.warn({
      options,
      vtCode,
    });
    throw error;
  }

  // Remove watermarks
  sheetDiv.querySelectorAll("text").forEach((text) => {
    if (text.textContent.includes("vex")) {
      text.remove();
    }
  });
}

/**
  Example of ranges:
    const lowRange = [
        { note: "F3", label: "Καμπάχ Τσαργκιάχ" },
        { note: "G3", label: "Γεγκιάχ" },
        { note: "A3", label: "Χουσεϊνί ασιράν" },
        { note: "B3", label: "Ιράκ" },
      ];

    const midRange = [
      { note: "C4", label: "Ραστ" },
      { note: "D4", label: "Ντουγκιάχ" },
      { note: "E4", label: "Σεγκιάχ" },
      { note: "F4", label: "Τσαργκιάχ" },
      { note: "G4", label: "Νεβά" },
      { note: "A4", label: "Χουσεϊνί" },
      { note: "B4", label: "Εβίτς" },
      { note: "C5", label: "Γκερντανιγιέ" },
    ];

    const highRange = [
      { note: "D5", label: "Μουχαγιέρ" },
      { note: "E5", label: "Τιζ Σεγκιάχ" },
      { note: "F5", label: "Τιζ Τσαργκιάχ" },
      { note: "G5", label: "Τιζ Νεβά" },
    ];
 */
