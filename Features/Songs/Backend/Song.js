import SongsData from "./Songs.js";

export class Song {
  #name = null;
  #authors = [];
  #makamIds = [];

  constructor({ name, authors, makamIds }) {
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

  static #parseSongs() {
    return SongsData.map((song) => new Song(song));
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
