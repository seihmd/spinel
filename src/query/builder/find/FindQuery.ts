import { ClassConstructor } from '../../../domain/type/ClassConstructor';
import { toInstance } from '../../../util/toInstance';
import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { ParameterBag } from '../../parameter/ParameterBag';
import { FindGraphStatement } from './FindGraphStatement';
import { FindNodeStatement } from './FindNodeStatement';

export class FindQuery<T> {
  constructor(
    private readonly sessionProvider: SessionProviderInterface,
    private readonly statement: FindNodeStatement | FindGraphStatement,
    private readonly parameterBag: ParameterBag,
    private readonly cstr: ClassConstructor<T>
  ) {}

  getStatement(): string {
    return this.statement.get();
  }

  getParameters(): unknown {
    return this.parameterBag.toPlain();
  }

  async run(): Promise<T[]> {
    const result = await this.sessionProvider.run(
      this.getStatement(),
      this.getParameters()
    );

    return result.records.map((record) => {
      return toInstance(this.cstr, record.toObject()[this.statement.as()]) as T;
    });
  }
}
