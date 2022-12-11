import { Parameter } from './Parameter';

export class ParameterBag {
  static new(parameters: Record<string, unknown>): ParameterBag {
    const parameterBag = new ParameterBag();
    Object.entries(parameters).forEach(([key, value]) => {
      parameterBag.add(Parameter.new(key, value));
    });

    return parameterBag;
  }

  private readonly parameterMap: Map<string, Parameter> = new Map();

  add(parameter: Parameter): void {
    if (this.parameterMap.has(parameter.getName())) {
      throw new Error(`Parameter "${parameter.getName()}" is duplicate`);
    }

    this.parameterMap.set(parameter.getName(), parameter);
  }

  get(name: string): Parameter {
    const parameter = this.parameterMap.get(name);
    if (!parameter) {
      throw new Error(`Parameter "${name}" is not added`);
    }

    return parameter;
  }

  toPlain(): unknown {
    let plain = {};
    for (const parameter of this.parameterMap.values()) {
      plain = Object.assign(plain, parameter.toPlain());
    }

    return plain;
  }
}
