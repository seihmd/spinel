import { ParameterNameLiteral } from './ParameterNameLiteral';
import { AnyNodeElement, AnyRelationshipElement } from '../../element/Element';
import { EntityParameter } from '../../parameter/EntityParameter';
import { GraphParameter } from '../../parameter/GraphParameter';

export class ParameterLiteral {
  static new(
    entityElement: AnyNodeElement | AnyRelationshipElement,
    graphParameter: GraphParameter
  ): ParameterLiteral {
    const key = entityElement.getGraphParameterKey();
    if (key === null) {
      return new ParameterLiteral('', new EntityParameter({}));
    }

    return new ParameterLiteral(
      graphParameter.getKeyWithRoot(key),
      graphParameter.get(key)
    );
  }

  private readonly name: string;
  private readonly value: EntityParameter;

  constructor(name: string, value: EntityParameter) {
    this.name = name;
    this.value = value;
  }

  get(): string {
    if (this.name === '') {
      return '';
    }

    const keys = Object.keys(this.value.get());
    if (keys.length === 0) {
      return '';
    }

    const parameters: Record<string, string> = {};
    const nameLiteral = new ParameterNameLiteral(this.name);
    keys.forEach((key) => {
      parameters[key] = `${nameLiteral.$()}.${key}`;
    });
    return JSON.stringify(parameters).replaceAll('"', '');
  }
}
