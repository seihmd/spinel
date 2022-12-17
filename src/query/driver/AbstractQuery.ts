import { AbstractStatement } from '../builder/AbstractStatement';
import { ParameterBag } from '../parameter/ParameterBag';
import { SessionProviderInterface } from './SessionProviderInterface';

export abstract class AbstractQuery<T> {
  protected readonly statement: AbstractStatement;
  protected readonly parameterBag: ParameterBag;
  protected readonly sessionProvider: SessionProviderInterface;

  protected constructor(
    sessionProvider: SessionProviderInterface,
    statement: AbstractStatement,
    parameterBag: ParameterBag
  ) {
    this.sessionProvider = sessionProvider;
    this.statement = statement;
    this.parameterBag = parameterBag;
  }

  getStatement(): string {
    return this.statement.get();
  }

  getParameters(): unknown {
    return this.parameterBag.toPlain();
  }

  abstract run(): Promise<T>;
}
