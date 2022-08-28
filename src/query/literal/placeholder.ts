const regex = new RegExp(/{ *(\*|(\*\.)?\w+ *)}/, 'gm');

export function placeholder(
  query: string,
  parameters: { [key: string]: string }
): string {
  return query.replace(regex, (matched: string) => {
    const from = matched.replace(/[ {}]/g, '');
    const to = parameters[from];
    if (to === undefined) {
      throw new Error(`Missing value for ${from}`);
    }
    return to;
  });
}
