import SongsData from "./Songs.js";

export class Song {
  #name = null;
  #authors = [];
  #makamIds = [];
  #year = null;

  constructor({ name, authors, makamIds, year }) {
    if (!name) {
      throw new Error("Name cannot be empty");
    }

    if (!authors || authors.length === 0) {
      throw new Error("Authors cannot be empty");
    }

    if (!makamIds || makamIds.length === 0) {
      throw new Error("MakamIds cannot be empty");
    }

    this.#name = name;
    this.#authors = authors;
    this.#makamIds = makamIds;
    this.#year = year;

    Object.freeze(this);
  }

  get name() {
    return this.#name;
  }

  get authors() {
    return this.#authors;
  }

  get makamIds() {
    return this.#makamIds;
  }

  get year() {
    return this.#year;
  }

  static #splitPipeDelimited(value) {
    const items = Array.isArray(value) ? value : [value];
    return items.flatMap((item) => item.split("|")).map((item) => item.trim());
  }

  static #parseSongs() {
    return SongsData.map((song) => {
      return new Song({
        name: song.name,
        authors: Song.#splitPipeDelimited(song.authors),
        makamIds: Song.#splitPipeDelimited(song.makamIds),
        year: song.year,
      });
    });
  }

  static getAll() {
    return Song.#parseSongs();
  }

  static getByMakamId(makamId) {
    if (!makamId) {
      throw new Error("makamId parameter is required");
    }

    return Song.#parseSongs().filter((song) => song.makamIds.includes(makamId));
  }

  static getByAuthor(author) {
    if (!author) {
      throw new Error("author parameter is required");
    }

    return Song.#parseSongs().filter((song) => song.authors.includes(author));
  }

  deconstruct() {
    return {
      name: this.#name,
      authors: this.#authors,
      makamIds: this.#makamIds,
    };
  }
}
