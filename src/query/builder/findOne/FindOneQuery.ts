import { ClassConstructor } from '../../../domain/type/ClassConstructor';
import { toInstance } from '../../../util/toInstance';
import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { ParameterBag } from '../../parameter/ParameterBag';
import { FindGraphStatement } from '../find/FindGraphStatement';
import { FindNodeStatement } from '../find/FindNodeStatement';

export class FindOneQuery<T> {
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

  async run(): Promise<T | null> {
    const result = await this.sessionProvider.run(
      this.getStatement(),
      this.getParameters()
    );

    if (result.records.length > 1) {
      throw new Error(
        `Expected 1 result, but ${result.records.length} results found.`
      );
    }

    if (result.records.length === 0) {
      return null;
    }

    return toInstance(
      this.cstr,
      result.records[0].toObject()[this.statement.as()]
    ) as T;
  }
}
