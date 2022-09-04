import { MapEntryLiteral } from './MapEntryLiteral';
import { EntityParameter } from '../parameter/EntityParameter';

export class MapLiteral {
  static withEntityParameter(entityParameter: EntityParameter): MapLiteral {
    return new MapLiteral(
      Object.entries(entityParameter.toParameter()).map(
        ([key, parameterName]): MapEntryLiteral => {
          return new MapEntryLiteral([key, parameterName]);
        }
      )
    );
  }

  private readonly as: string;
  private readonly mapEntryLiterals: MapEntryLiteral[];

  constructor(entries: MapEntryLiteral[], as = '') {
    this.mapEntryLiterals = entries;
    this.as = as;
  }

  get(): string {
    return `{${this.getProperties()}}${this.getAs()}`;
  }

  private getProperties(): string {
    return this.mapEntryLiterals
      .map((entry) => {
        return entry.get();
      })
      .join(',');
  }

  private getAs(): string {
    if (this.as === '') {
      return '';
    }

    return ` AS ${this.as}`;
  }
}
