import { NodeTerm, Term } from '../term/Term';
import { RelationshipKeyTerm } from '../term/RelationshipKeyTerm';
import { NodeKeyTerm } from '../term/NodeKeyTerm';
import { parseFormula } from './parseFormula';
import { normalizeFormula } from './normalizeFormula';
import { reverseFormula } from './reverseFormula';

export abstract class PatternFormula {
  protected readonly terms: Term[];
  protected readonly formula: string;

  constructor(formula: string) {
    const terms = this.parse(formula);
    this.assert(terms);

    this.terms = terms;
    this.formula = formula;
  }

  get(): Term[] {
    return this.terms;
  }

  isRootKey(key: string): boolean {
    return this.getRootTerm().getKey() === key;
  }

  isTerminalKey(key: string): boolean {
    return this.getTerminalTerm().getKey() === key;
  }

  getRootTerm(): NodeTerm {
    return this.terms[0] as NodeTerm;
  }

  getTerminalTerm(): Term {
    return this.terms[this.terms.length - 1];
  }

  protected getTermsString(): string {
    return this.terms.map((term) => term.getValue()).join('');
  }

  protected parse(formula: string): Term[] {
    return parseFormula(normalizeFormula(formula), this.getParseStartIndex());
  }

  protected abstract getParseStartIndex(): 0 | 1;

  protected abstract reverse(): PatternFormula;

  getFormula(): string {
    return this.formula;
  }

  reverseFormula(): string {
    return reverseFormula(this.formula, this.getParseStartIndex());
  }

  protected assert(terms: Term[]) {
    const keys = terms
      .filter(
        (term): boolean =>
          term instanceof NodeKeyTerm || term instanceof RelationshipKeyTerm
      )
      .map((term) => term.getValue());

    if (new Set(keys).size !== keys.length) {
      throw new Error(`Pattern has duplicate keys.`);
    }
  }
}
