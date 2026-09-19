import { cacheLife, cacheTag } from "next/cache";
import { FreeUseBibleApi } from "free-use-bible-api";

const bibleApi = new FreeUseBibleApi();

type Verse = {
  number: number;
  text: string;
};

type ReferencePart = {
  book: string;
  chapter: number;
  start: number;
  end: number;
};

/**
 * ============================================================
 * NORMALIZE BOOK NAME
 * ============================================================
 */
function normalizeBookName(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[–—−]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * ============================================================
 * BIBLE BOOK IDS
 * ============================================================
 *
 * Free Use Bible API book IDs
 */
const BOOK_IDS: Record<string, string> = {
  // ----------------------------------------------------------
  // OLD TESTAMENT
  // ----------------------------------------------------------

  genesis: "GEN",
  exodus: "EXO",
  leviticus: "LEV",
  numbers: "NUM",
  deuteronomy: "DEU",

  joshua: "JOS",
  judges: "JDG",
  ruth: "RUT",

  "1 samuel": "1SA",
  "2 samuel": "2SA",

  "1 kings": "1KI",
  "2 kings": "2KI",

  "1 chronicles": "1CH",
  "2 chronicles": "2CH",

  ezra: "EZR",
  nehemiah: "NEH",
  esther: "EST",

  job: "JOB",

  psalm: "PSA",
  psalms: "PSA",

  proverbs: "PRO",
  ecclesiastes: "ECC",

  "song of solomon": "SNG",
  "song of songs": "SNG",

  isaiah: "ISA",
  jeremiah: "JER",
  lamentations: "LAM",

  ezekiel: "EZK",
  daniel: "DAN",

  hosea: "HOS",
  joel: "JOL",
  amos: "AMO",
  obadiah: "OBA",
  jonah: "JON",
  micah: "MIC",
  nahum: "NAM",
  habakkuk: "HAB",
  zephaniah: "ZEP",
  haggai: "HAG",
  zechariah: "ZEC",
  malachi: "MAL",

  // ----------------------------------------------------------
  // DEUTEROCANONICAL / CATHOLIC BOOKS
  // ----------------------------------------------------------

  tobit: "TOB",
  tobith: "TOB",

  judith: "JDT",

  wisdom: "WIS",
  "wisdom of solomon": "WIS",

  sirach: "SIR",
  ecclesiasticus: "SIR",

  baruch: "BAR",

  "1 maccabees": "1MA",
  "2 maccabees": "2MA",

  // ----------------------------------------------------------
  // NEW TESTAMENT
  // ----------------------------------------------------------

  matthew: "MAT",
  matt: "MAT",

  mark: "MRK",

  luke: "LUK",

  john: "JHN",

  acts: "ACT",
  "acts of the apostles": "ACT",

  romans: "ROM",

  "1 corinthians": "1CO",
  "2 corinthians": "2CO",

  galatians: "GAL",

  ephesians: "EPH",

  philippians: "PHP",

  colossians: "COL",

  "1 thessalonians": "1TH",
  "2 thessalonians": "2TH",

  "1 timothy": "1TI",
  "2 timothy": "2TI",

  titus: "TIT",

  philemon: "PHM",

  hebrews: "HEB",

  james: "JAS",

  "1 peter": "1PE",
  "2 peter": "2PE",

  "1 john": "1JN",
  "2 john": "2JN",
  "3 john": "3JN",

  jude: "JUD",

  revelation: "REV",
  revelations: "REV",
  apocalypse: "REV",
};

/**
 * ============================================================
 * GET BOOK ID
 * ============================================================
 */
function getBookId(bookName: string): string | undefined {
  return BOOK_IDS[normalizeBookName(bookName)];
}

/**
 * ============================================================
 * PARSE VERSE ENDPOINT
 * ============================================================
 *
 * Converts:
 *
 * 18b -> 18
 * 18a -> 18
 * 18 -> 18
 */
function parseVerseNumber(value: string): number | null {
  const match = value.trim().match(/^(\d+)[a-z]?$/i);

  if (!match) {
    return null;
  }

  return Number(match[1]);
}

/**
 * ============================================================
 * PARSE VERSE RANGES
 * ============================================================
 *
 * Supports:
 *
 * 27-32
 *
 * 3-4, 5-6, 12-13, 14 and 17
 *
 * 13-18b
 *
 * 6b-15
 *
 * 6a-15
 */
function parseVerseRanges(
  book: string,
  chapter: number,
  verseText: string
): ReferencePart[] {
  const normalized = verseText
    .replace(/\s+and\s+/gi, ", ")
    .replace(/\s*&\s*/g, ", ")
    .trim();

  const parts = normalized
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const results: ReferencePart[] = [];

  for (const part of parts) {
    /**
     * Examples:
     *
     * 14
     * 17
     * 18b
     * 13-18
     * 13-18b
     * 6b-15
     */
    const match = part.match(
      /^(\d+)([a-z])?(?:-(\d+)([a-z])?)?$/i
    );

    if (!match) {
      console.warn(
        `Unable to parse verse range "${part}" from "${book} ${chapter}:${verseText}"`
      );

      continue;
    }

    const start = Number(match[1]);

    const end = match[3]
      ? Number(match[3])
      : start;

    if (
      !Number.isInteger(start) ||
      !Number.isInteger(end)
    ) {
      continue;
    }

    if (start > end) {
      continue;
    }

    results.push({
      book,
      chapter,
      start,
      end,
    });
  }

  return results;
}

/**
 * ============================================================
 * PARSE CATHOLIC BIBLE REFERENCE
 * ============================================================
 *
 * Examples:
 *
 * Matthew 23:27-32
 *
 * Psalm 90:3-4, 5-6, 12-13, 14 and 17
 *
 * Philemon 9-10, 12-17
 *
 * Wisdom 9:13-18b
 *
 * 1 Corinthians 4:6b-15
 */
function parseReferenceParts(
  reference: string
): ReferencePart[] {
  let value = reference
    .replace(/\u00a0/g, " ")
    .replace(/[–—−]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  if (!value) {
    return [];
  }

  /**
   * Normalize "and"
   */
  value = value.replace(/\s+and\s+/gi, ", ");

  /**
   * ----------------------------------------------------------
   * CASE 1
   *
   * Reference contains ":"
   *
   * Example:
   *
   * 1 Corinthians 4:6b-15
   */
  const colonIndex = value.indexOf(":");

  if (colonIndex !== -1) {
    const beforeColon = value
      .slice(0, colonIndex)
      .trim();

    const verseText = value
      .slice(colonIndex + 1)
      .trim();

    /**
     * Separate book name and chapter.
     *
     * Matthew 23
     * 1 Corinthians 4
     * Psalm 90
     */
    const chapterMatch =
      beforeColon.match(/^(.+?)\s+(\d+)$/);

    if (!chapterMatch) {
      console.warn(
        "Unable to parse chapter:",
        reference
      );

      return [];
    }

    const book = chapterMatch[1].trim();

    const chapter = Number(
      chapterMatch[2]
    );

    if (!getBookId(book)) {
      console.warn(
        "Book not recognized:",
        book
      );

      return [];
    }

    return parseVerseRanges(
      book,
      chapter,
      verseText
    );
  }

  /**
   * ----------------------------------------------------------
   * CASE 2
   *
   * One-chapter books.
   *
   * Examples:
   *
   * Philemon 9-10, 12-17
   *
   * Jude 3-7
   *
   * Obadiah 15-21
   */
  const singleChapterMatch =
    value.match(/^(.+?)\s+(.+)$/);

  if (!singleChapterMatch) {
    console.warn(
      "Unable to parse Bible reference:",
      reference
    );

    return [];
  }

  const book =
    singleChapterMatch[1].trim();

  const verseText =
    singleChapterMatch[2].trim();

  if (!getBookId(book)) {
    console.warn(
      "Book not recognized:",
      book
    );

    return [];
  }

  return parseVerseRanges(
    book,
    1,
    verseText
  );
}

/**
 * ============================================================
 * GET HINDI BIBLE PASSAGE
 * ============================================================
 *
 * Uses:
 *
 * HINIRV
 *
 * from Free Use Bible API.
 */
export async function getHindiBiblePassage(
  reference: string
): Promise<Verse[]> {
  const parts =
    parseReferenceParts(reference);

  if (parts.length === 0) {
    console.warn(
      "No Bible reference parts found:",
      reference
    );

    return [];
  }

  const allVerses: Verse[] = [];

  for (const part of parts) {
    const bookId =
      getBookId(part.book);

    if (!bookId) {
      console.warn(
        `Book not recognized: ${part.book}`
      );

      continue;
    }

    try {
      console.log(
        `Fetching ${bookId} ${part.chapter}:${part.start}-${part.end}`
      );

      /**
       * IMPORTANT:
       *
       * HINIRV
       *
       * Not HINERV.
       */
      const data =
        await bibleApi.getSimpleTranslationBookChapter(
          "HINIRV",
          bookId,
          part.chapter
        );

      const content =
        data.chapter?.content ?? [];

      const verses: Verse[] =
        content
          .filter(
            (node: any) =>
              node.type === "verse"
          )
          .map((verse: any) => ({
            number: Number(
              verse.number
            ),
            text: String(
              verse.text ?? ""
            ).trim(),
          }))
          .filter(
            (verse: Verse) =>
              Number.isInteger(
                verse.number
              ) &&
              verse.number >= part.start &&
              verse.number <= part.end &&
              verse.text.length > 0
          );

      allVerses.push(...verses);
    } catch (error) {
      console.error(
        `Failed to fetch ${bookId} ${part.chapter}:`,
        error
      );
    }
  }

  /**
   * ----------------------------------------------------------
   * REMOVE DUPLICATES
   * ----------------------------------------------------------
   */
  const unique = Array.from(
    new Map(
      allVerses.map((verse) => [
        verse.number,
        verse,
      ])
    ).values()
  );

  /**
   * Sort by verse number.
   */
  unique.sort(
    (a, b) =>
      a.number - b.number
  );

  return unique;
}

/**
 * ============================================================
 * GET TODAY'S CATHOLIC READINGS
 * ============================================================
 */
export async function getTodayBibleReadings() {
  "use cache";

  cacheLife({
    stale: 86400,
    revalidate: 86400,
    expire: 86400,
  });

  cacheTag("church-daily-bible");

  const today = new Date();

  const year =
    today.getFullYear();

  const month =
    String(today.getMonth() + 1)
      .padStart(2, "0");

  const day =
    String(today.getDate())
      .padStart(2, "0");

  const date =
    `${year}/${month}-${day}`;

  console.log(
    "Fetching Catholic readings:",
    date
  );

  const response =
    await fetch(
      `https://cpbjr.github.io/catholic-readings-api/readings/${date}.json`,
      {
        next: {
          revalidate: 86400,
        },
      }
    );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Catholic readings: ${response.status}`
    );
  }

  const data =
    await response.json();

  const readings =
    data.readings ?? {};

  /**
   * ----------------------------------------------------------
   * FETCH BIBLE TEXT
   * ----------------------------------------------------------
   *
   * Promise.all makes the four requests
   * run at the same time.
   */
  const [
    firstVerses,
    psalmVerses,
    secondVerses,
    gospelVerses,
  ] = await Promise.all([
    readings.firstReading
      ? getHindiBiblePassage(
          readings.firstReading
        )
      : Promise.resolve(null),

    readings.psalm
      ? getHindiBiblePassage(
          readings.psalm
        )
      : Promise.resolve(null),

    readings.secondReading
      ? getHindiBiblePassage(
          readings.secondReading
        )
      : Promise.resolve(null),

    readings.gospel
      ? getHindiBiblePassage(
          readings.gospel
        )
      : Promise.resolve(null),
  ]);

  return {
    date,

    readings,

    firstVerses,
    psalmVerses,
    secondVerses,
    gospelVerses,
  };
}

