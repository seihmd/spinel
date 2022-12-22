import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { DropConstraintStatement } from './DropConstraintStatement';

export class DropConstraintQuery {
  constructor(
    private readonly sessionProvider: SessionProviderInterface,
    private readonly statement: DropConstraintStatement
  ) {}

  getStatement(): string {
    return this.statement.get();
  }

  async run(): Promise<void> {
    await this.sessionProvider.run(this.getStatement(), {});
  }
}
