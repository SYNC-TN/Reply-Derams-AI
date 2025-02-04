// gtts.d.ts
declare module "gtts" {
  import { Readable } from "stream";

  class Gtts {
    constructor(text: string, lang?: string);
    save(filepath: string, callback?: (err: Error | null) => void): void;
    stream(): Readable;
  }
  export = Gtts;
}
