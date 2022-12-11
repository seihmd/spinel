import { ClassConstructor } from '../../../domain/type/ClassConstructor';
import { toInstance } from '../../../util/toInstance';
import { ParameterBag } from '../../parameter/ParameterBag';
import { SessionProviderInterface } from '../session/SessionProviderInterface';
import { FindGraphStatement } from './FindGraphStatement';
import { FindNodeStatement } from './FindNodeStatement';

export class FindQuery<T> {
  private readonly sessionProvider: SessionProviderInterface;
  private readonly statement: FindNodeStatement | FindGraphStatement;
  private readonly parameterBag: ParameterBag;
  private readonly cstr: ClassConstructor<T>;

  constructor(
    sessionProvider: SessionProviderInterface,
    statement: FindNodeStatement | FindGraphStatement,
    parameterBag: ParameterBag,
    cstr: ClassConstructor<T>
  ) {
    this.cstr = cstr;
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

  async run(): Promise<T[]> {
    const result = await this.sessionProvider
      .get()
      .run(this.getStatement(), this.getParameters());

    return result.records.map((record) => {
      return toInstance(this.cstr, record.toObject()[this.statement.as()]);
    });
  }
}
