import bible from "../../../data/bible/bible.json";

export type BibleVerse = {
  verse: number;
  text: string;
};

export type BibleChapter = {
  chapter: number;
  title: string;
  file: string;
  verses: BibleVerse[];
};

export type BibleBook = {
  number: number;
  title: string;
  chapters: BibleChapter[];
};

const bibleData = bible as BibleBook[];

// ============================================================
// BOOK ALIASES
// ============================================================

const BOOK_ALIASES: Record<string, string> = {
  // Old Testament
  genesis: "उत्पत्ति",
  exodus: "निर्गमन",
  leviticus: "लेवी",
  numbers: "गणना",
  deuteronomy: "विधि-विवरण",
  joshua: "योशुआ",
  judges: "न्यायकर्ता",
  ruth: "रूत",

  "1 samuel": "समूएल का पहला ग्रन्थ",
  "2 samuel": "समूएल का दुसरा ग्रन्थ",

  "1 kings": "राजाओं का पहला ग्रन्थ",
  "2 kings": "राजाओं का दुसरा ग्रन्थ",

  "1 chronicles": "पहला इतिहास ग्रन्थ",
  "2 chronicles": "दुसरा इतिहास ग्रन्थ",

  ezra: "एज़्रा",
  nehemiah: "नहेम्या",

  tobit: "टोबीत",
  judith: "यूदीत",
  esther: "एस्तेर",

  "1 maccabees": "मक्काबियों का पहला ग्रन्थ",
  "2 maccabees": "मक्काबियों का दूसरा ग्रन्थ",

  job: "योब",

  psalm: "स्तोत्र",
  psalms: "स्तोत्र",

  proverbs: "सूक्ति",
  ecclesiastes: "उपदेशक",
  "song of songs": "सुलेमान का सर्वश्रेष्ठ गीत",

  wisdom: "प्रज्ञा",
  sirach: "प्रवक्ता",

  isaiah: "इसायाह",
  jeremiah: "यिरमियाह",
  lamentations: "शोक गीत",
  baruch: "बारूक",
  ezekiel: "एज़ेकिएल",
  daniel: "दानिएल",

  hosea: "होशेआ",
  joel: "योएल",
  amos: "आमोस",
  obadiah: "ओबद्याह",
  jonah: "योना",
  micah: "मीकाह",
  nahum: "नहूम",
  habakkuk: "हबक्कूक",
  zephaniah: "सफ़न्याह",
  haggai: "हग्गय",
  zechariah: "ज़कारिया",
  malachi: "मलआकी",

  // New Testament
  matthew: "मत्ती",
  mark: "मारकुस",
  luke: "लूकस",
  john: "योहन",

  acts: "प्रेरित-चरित",
  "acts of the apostles": "प्रेरित-चरित",

  romans: "रोमियों",

  "1 corinthians": "1 कुरिन्थियों",
  "2 corinthians": "2 कुरिन्थियों",

  galatians: "गलातियों",
  ephesians: "एफ़ेसियों",
  philippians: "फ़िलिप्पियों",
  colossians: "कलोसियों",

  "1 thessalonians": "1 थेसलनीकियों",
  "2 thessalonians": "2 थेसलनीकियों",

  "1 timothy": "1 तिमथी",
  "2 timothy": "2 तिमथी",

  titus: "तीतुस",
  philemon: "फ़िलेमोन",

  hebrews: "इब्रानियों",
  james: "याकूब",

  "1 peter": "1 पेत्रुस",
  "2 peter": "2 पेत्रुस",

  "1 john": "1 योहन",
  "2 john": "2 योहन",
  "3 john": "3 योहन",

  jude: "यूदस",

  revelation: "प्रकाशना",
  revelations: "प्रकाशना",
  apocalypse: "प्रकाशना",
};

// ============================================================
// NORMALIZE
// ============================================================

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[–—−]/g, "-")
    .replace(/\s+/g, " ");
}

// ============================================================
// FIND BOOK
// ============================================================

function findBook(bookName: string): BibleBook | undefined {
  const normalized = normalize(bookName);

  // ----------------------------------------------------------
  // Direct Hindi title match
  // ----------------------------------------------------------

  const direct = bibleData.find(
    (book) => normalize(book.title) === normalized
  );

  if (direct) {
    return direct;
  }

  // ----------------------------------------------------------
  // English → Hindi mapping
  // ----------------------------------------------------------

  const hindiTitle = BOOK_ALIASES[normalized];

  if (!hindiTitle) {
    return undefined;
  }

  return bibleData.find(
    (book) =>
      normalize(book.title) === normalize(hindiTitle)
  );
}

// ============================================================
// VERSE RANGE TYPE
// ============================================================

export type BibleVerseRange = {
  startVerse: number;
  endVerse: number;

  /**
   * Catholic Bible references can contain:
   *
   * 6a
   * 6b
   *
   * These indicate a portion of the verse.
   */
  startPart?: "a" | "b";

  endPart?: "a" | "b";
};

// ============================================================
// PARSE SINGLE VERSE RANGE
// ============================================================

function parseVerseRange(
  value: string
): BibleVerseRange | null {
  const part = value.trim();

  /*
    Supported:

    6
    6a
    6b

    6-15
    6a-15
    6b-15

    6-15a
    6-15b

    6a-15b
  */

  const match = part.match(
    /^(\d+)([ab])?(?:-(\d+)([ab])?)?$/
  );

  if (!match) {
    return null;
  }

  const startVerse = Number(match[1]);

  const startPart = match[2] as
    | "a"
    | "b"
    | undefined;

  const endVerse = match[3]
    ? Number(match[3])
    : startVerse;

  const endPart = match[4] as
    | "a"
    | "b"
    | undefined;

  // ----------------------------------------------------------
  // Validate numbers
  // ----------------------------------------------------------

  if (
    !Number.isInteger(startVerse) ||
    !Number.isInteger(endVerse) ||
    startVerse <= 0 ||
    endVerse <= 0
  ) {
    return null;
  }

  // ----------------------------------------------------------
  // Invalid range
  // Example: 15-6
  // ----------------------------------------------------------

  if (endVerse < startVerse) {
    return null;
  }

  return {
    startVerse,
    endVerse,
    startPart,
    endPart,
  };
}

// ============================================================
// PARSE BIBLE REFERENCE
// ============================================================

export function parseBibleReference(
  reference: string
) {
  if (!reference || typeof reference !== "string") {
    return null;
  }

  const value = reference
    .trim()
    .replace(/[–—−]/g, "-")
    .replace(/\s+/g, " ");

  /*
    Supported examples:

    Matthew 23:1-12

    John 3:16

    Psalm 37:3-4,5-6,27-28,39-40

    1 Corinthians 4:1-5

    1 Corinthians 4:6b-15

    1 Corinthians 4:6a-15

    1 Corinthians 4:6

    1 Corinthians 4:6b
  */

  // ----------------------------------------------------------
  // Separate book + chapter + verses
  // ----------------------------------------------------------

  const match = value.match(
    /^(.+?)\s+(\d+):(.+)$/
  );

  if (!match) {
    return null;
  }

  const [, rawBookName, chapterString, versePart] =
    match;

  // ----------------------------------------------------------
  // Chapter
  // ----------------------------------------------------------

  const chapter = Number(chapterString);

  if (
    !Number.isInteger(chapter) ||
    chapter <= 0
  ) {
    return null;
  }

  // ----------------------------------------------------------
  // Find book
  // ----------------------------------------------------------

  const book = findBook(rawBookName);

  if (!book) {
    return null;
  }

  // ----------------------------------------------------------
  // Parse verse ranges
  // ----------------------------------------------------------

  const ranges = versePart
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map(parseVerseRange);

  // ----------------------------------------------------------
  // Invalid ranges
  // ----------------------------------------------------------

  if (
    ranges.length === 0 ||
    ranges.some((range) => range === null)
  ) {
    return null;
  }

  return {
    book,
    chapter,
    ranges: ranges as BibleVerseRange[],
  };
}

// ============================================================
// GET BIBLE READING
// ============================================================

export function getBibleReading(
  reference: string
) {
  const parsed = parseBibleReference(reference);

  if (!parsed) {
    return null;
  }

  const {
    book,
    chapter,
    ranges,
  } = parsed;

  // ----------------------------------------------------------
  // Find chapter
  // ----------------------------------------------------------

  const chapterData = book.chapters.find(
    (item) => item.chapter === chapter
  );

  if (!chapterData) {
    return null;
  }

  // ----------------------------------------------------------
  // Get requested verses
  // ----------------------------------------------------------

  const verses = chapterData.verses.filter(
    (verse) =>
      ranges.some(
        (range) =>
          verse.verse >= range.startVerse &&
          verse.verse <= range.endVerse
      )
  );

  // ----------------------------------------------------------
  // No verses found
  // ----------------------------------------------------------

  if (verses.length === 0) {
    return null;
  }

  // ----------------------------------------------------------
  // Return result
  // ----------------------------------------------------------

  return {
    bookNumber: book.number,
    bookTitle: book.title,
    chapter: chapterData.chapter,
    chapterTitle: chapterData.title,
    file: chapterData.file,
    ranges,
    verses,
  };
}

// ============================================================
// GET BOOK
// ============================================================

export function getBibleBook(
  bookName: string
): BibleBook | null {
  return findBook(bookName) ?? null;
}

// ============================================================
// GET CHAPTER
// ============================================================

export function getBibleChapter(
  bookName: string,
  chapterNumber: number
): BibleChapter | null {
  const book = findBook(bookName);

  if (!book) {
    return null;
  }

  return (
    book.chapters.find(
      (chapter) =>
        chapter.chapter === chapterNumber
    ) ?? null
  );
}

// ============================================================
// GET VERSE
// ============================================================

export function getBibleVerse(
  bookName: string,
  chapterNumber: number,
  verseNumber: number
): BibleVerse | null {
  const chapter = getBibleChapter(
    bookName,
    chapterNumber
  );

  if (!chapter) {
    return null;
  }

  return (
    chapter.verses.find(
      (verse) =>
        verse.verse === verseNumber
    ) ?? null
  );
}

// ============================================================
// TEST REFERENCES
// ============================================================

/*
  These examples should now work:

  parseBibleReference("Matthew 23:1-12");

  parseBibleReference("John 3:16");

  parseBibleReference("Psalm 37:3-4,5-6,27-28,39-40");

  parseBibleReference("1 Corinthians 4:1-5");

  parseBibleReference("1 Corinthians 4:6b-15");

  parseBibleReference("1 Corinthians 4:6a-15");

  parseBibleReference("1 Corinthians 4:6");

  getBibleReading("1 Corinthians 4:6b-15");
*/