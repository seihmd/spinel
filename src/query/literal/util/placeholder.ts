import { VariableMap } from './VariableMap';

const regex = new RegExp(/{ *(\*|(\*\.)?\w+ *)}/, 'gm');

export function placeholder(query: string, variableMap: VariableMap): string {
  return query.replace(regex, (matched: string) => {
    const from = matched.replace(/[ {}]/g, '');
    const to = variableMap.get(from);
    if (to === null) {
      throw new Error(`Missing value for ${from}`);
    }
    return to;
  });
}
