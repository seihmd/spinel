import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { DropIndexStatement } from './DropIndexStatement';

export class DropIndexQuery {
  constructor(
    private readonly sessionProvider: SessionProviderInterface,
    private readonly statement: DropIndexStatement
  ) {}

  getStatement(): string {
    return this.statement.get();
  }

  async run(): Promise<void> {
    await this.sessionProvider.run(this.getStatement(), {});
  }
}
