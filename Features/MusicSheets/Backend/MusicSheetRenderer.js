const sheetOptions = {
  noteDuration: "w",
  minWidth: 768,
  scale: 1.0,
};

function toVexTab(options) {
  const { notes, texts = {} } = options;

  function parseNote(rwaNote) {
    const accidentalMap = { "#": "#", b: "@" };
    let [, note, accidental, octave] = rwaNote.match(/^([A-G])(#|b)?(\d)$/);
    accidental = accidentalMap[accidental] || "";
    return { note: note + (accidental || ""), octave: Number(octave) };
  }

  function hasTopLabel(rawNote) {
    const { note, octave } = parseNote(rawNote);
    return octave < 4 || (octave === 4 && note === "C");
  }

  function getVtNotes() {
    let noteBlocks = [];
    let current = null;
    notes.forEach((inputNote) => {
      const labelPosition = hasTopLabel(inputNote.note) ? "top" : "bottom";
      if (!current || current.labelPosition !== labelPosition) {
        current = { labelPosition, notes: [], labels: [] };
        noteBlocks.push(current);
      }

      const { note, octave } = parseNote(inputNote.note);
      current.notes.push(`${note}/${octave}`);
      current.labels.push(inputNote.label);
    });

    return noteBlocks
      .map(
        (noteBlock) =>
          `notes :${sheetOptions.noteDuration} ${noteBlock.notes.join("-")} $.${
            noteBlock.labelPosition
          }.${noteBlock.labels.join(",")}$`
      )
      .join("\n");
  }

  function getVtText() {
    const textArray = notes.map((_, i) => texts[i] ?? " ");
    while (textArray.length && textArray[textArray.length - 1] === " ") {
      textArray.pop();
    }

    return textArray.length ? `text :${sheetOptions.noteDuration},${textArray.join(",")}` : "";
  }

  function formatLines(lines) {
    return lines
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n");
  }

  const vtNotes = getVtNotes();
  const vtText = getVtText();
  const code = `
    options font-size=8
    tabstave notation=true tablature=false
    ${vtNotes}
    ${vtText}
  `;
  return formatLines(code);
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
  const artist = new VexTab.Artist(10, 10, 680, { scale: sheetOptions.scale });
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
