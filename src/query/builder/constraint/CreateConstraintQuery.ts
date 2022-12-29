import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { CreateConstraintStatement } from './CreateConstraintStatement';

export class CreateConstraintQuery {
  constructor(
    private readonly sessionProvider: SessionProviderInterface,
    private readonly statement: CreateConstraintStatement
  ) {}

  getStatement(): string {
    return this.statement.get();
  }

  async run(): Promise<void> {
    await this.sessionProvider.run(this.getStatement(), {});
  }
}
