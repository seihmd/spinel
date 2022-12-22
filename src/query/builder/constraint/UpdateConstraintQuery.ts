import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { CreateConstraintStatement } from './CreateConstraintStatement';
import { CreateIndexStatement } from './CreateIndexStatement';
import { DropConstraintStatement } from './DropConstraintStatement';
import { DropIndexStatement } from './DropIndexStatement';

export class UpdateConstraintQuery {
  constructor(
    private readonly sessionProvider: SessionProviderInterface,
    private readonly statement:
      | CreateConstraintStatement
      | CreateIndexStatement
      | DropConstraintStatement
      | DropIndexStatement
  ) {}

  getStatement(): string {
    return this.statement.get();
  }

  async run(): Promise<void> {
    await this.sessionProvider.run(this.getStatement(), {});
  }
}
