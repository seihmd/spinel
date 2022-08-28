export type MapEntry = [string, string];

export class MapEntries {
  private readonly entries: MapEntry[];

  constructor(entries: MapEntry[]) {
    this.entries = entries;
  }

  get(): MapEntry[] {
    return this.entries;
  }
}
