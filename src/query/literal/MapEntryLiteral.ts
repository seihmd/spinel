import { MapEntry } from './MapEntries';

export class MapEntryLiteral {
  static new(entries: MapEntry[]): MapEntryLiteral[] {
    return entries.map((entry) => new MapEntryLiteral(entry));
  }

  private readonly entry: MapEntry;

  constructor(entry: MapEntry) {
    this.entry = entry;
  }

  get(): string {
    return `${this.entry[0]}:${this.getValue()}`;
  }

  getValue(): string {
    return this.entry[1];
  }
}
