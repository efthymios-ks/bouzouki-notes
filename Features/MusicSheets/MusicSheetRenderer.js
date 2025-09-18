function injectGlobalSheetStyles() {
  const stylesId = "music-sheet-styles";
  if (document.getElementById(stylesId)) {
    return;
  }

  const style = document.createElement("style");
  style.id = stylesId;
  style.textContent = `
      .sheet { 
        overflow-x: auto; 
        overflow-y: hidden;
      } 

      .sheet svg { 
        height: auto !important;
        min-width: 100%;
      }
    `;

  document.head.appendChild(style);
}

function remToPx(rem) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function parseNote(note) {
  if (typeof note !== "string") {
    console.warn("Invalid note skipped:", note);
    return null;
  }

  const match = note.match(/^([A-Ga-g])([#b]?)(\d)$/);
  if (!match) {
    console.warn("Invalid note skipped:", note);
    return null;
  }

  const [, letter, accidental, octave] = match;
  return { key: `${letter.toLowerCase()}/${octave}`, accidental };
}

function makeNotes(notes) {
  return notes
    .map((item) => {
      const parsed = parseNote(item.note);
      if (!parsed) return null;

      const note = new Vex.Flow.StaveNote({
        clef: "treble",
        keys: [parsed.key],
        duration: "w",
        auto_stem: false,
      });

      if (parsed.accidental) {
        note.addModifier(new Vex.Flow.Accidental(parsed.accidental), 0);
      }

      if (item.label) {
        note.addModifier(
          new Vex.Flow.Annotation(item.label)
            .setFont("Arial", remToPx(0.6), "normal")
            .setVerticalJustification(Vex.Flow.Annotation.VerticalJustify.BOTTOM),
          0
        );
      }

      return note;
    })
    .filter((n) => n !== null);
}

export function renderMusicSheet(container, notes) {
  injectGlobalSheetStyles();

  const sheet = document.createElement("div");
  sheet.className = "sheet";
  container.appendChild(sheet);

  const renderer = new Vex.Flow.Renderer(sheet, Vex.Flow.Renderer.Backends.SVG);

  function draw() {
    const noteWidth = remToPx(6);
    const baseWidth = remToPx(12);
    const extraWidth = remToPx(10);

    const calculatedWidth = baseWidth + notes.length * noteWidth + extraWidth;

    const width = Math.max(container.clientWidth, calculatedWidth, remToPx(50));

    const baseHeight = remToPx(8);
    const labelSpace = remToPx(3);
    const topPadding = remToPx(0.1);

    let minOctave = 5,
      maxOctave = 3;
    notes.forEach((item) => {
      const parsed = parseNote(item.note);
      if (parsed) {
        const octave = parseInt(parsed.key.split("/")[1]);
        minOctave = Math.min(minOctave, octave);
        maxOctave = Math.max(maxOctave, octave);
      }
    });

    let extraHeight = 0;
    if (minOctave <= 3) extraHeight += remToPx(2);
    if (maxOctave >= 5) extraHeight += remToPx(1);

    const height = baseHeight + labelSpace + topPadding + extraHeight;
    renderer.resize(width, height);

    const context = renderer.getContext();
    context.clear();

    const stave = new Vex.Flow.Stave(0, remToPx(1), width);
    stave.addClef("treble").setContext(context).draw();

    Vex.Flow.Formatter.FormatAndDraw(context, stave, makeNotes(notes));
  }

  window.addEventListener("resize", draw);
  draw();
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
