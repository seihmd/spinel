import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { ParameterBag } from '../../parameter/ParameterBag';

import { DetachStatement } from './DetachStatement';

export class DetachQuery {
  private readonly sessionProvider: SessionProviderInterface;
  private readonly statement: DetachStatement;
  private readonly parameterBag: ParameterBag;

  constructor(
    sessionProvider: SessionProviderInterface,
    statement: DetachStatement,
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
    await this.sessionProvider.run(this.getStatement(), this.getParameters());
  }
}
