import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { ParameterBag } from '../../parameter/ParameterBag';
import { SaveStatement } from './SaveStatement';

export class SaveQuery {
  private readonly sessionProvider: SessionProviderInterface;
  private readonly statement: SaveStatement;
  private readonly parameterBag: ParameterBag;

  constructor(
    sessionProvider: SessionProviderInterface,
    statement: SaveStatement,
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
