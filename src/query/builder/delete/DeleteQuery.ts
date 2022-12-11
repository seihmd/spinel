import { ParameterBag } from '../../parameter/ParameterBag';
import { SessionProviderInterface } from '../session/SessionProviderInterface';
import { DeleteNodeStatement } from './DeleteNodeStatement';
import { DeleteRelationshipStatement } from './DeleteRelationshipStatement';

export class DeleteQuery {
  private readonly sessionProvider: SessionProviderInterface;
  private readonly statement: DeleteNodeStatement | DeleteRelationshipStatement;
  private readonly parameterBag: ParameterBag;

  constructor(
    sessionProvider: SessionProviderInterface,
    statement: DeleteNodeStatement | DeleteRelationshipStatement,
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
