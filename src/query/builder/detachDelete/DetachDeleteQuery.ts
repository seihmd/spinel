import { ParameterBag } from '../../parameter/ParameterBag';
import { SessionProviderInterface } from '../session/SessionProviderInterface';
import { DetachDeleteGraphStatement } from './DetachDeleteGraphStatement';
import { DetachDeleteNodeStatement } from './DetachDeleteNodeStatement';

export class DetachDeleteQuery {
  private readonly sessionProvider: SessionProviderInterface;
  private readonly statement:
    | DetachDeleteNodeStatement
    | DetachDeleteGraphStatement;
  private readonly parameterBag: ParameterBag;

  constructor(
    sessionProvider: SessionProviderInterface,
    statement: DetachDeleteNodeStatement | DetachDeleteGraphStatement,
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

  async run(): Promise<void> {
    await this.sessionProvider
      .get()
      .run(this.getStatement(), this.getParameters());
  }
}
