import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { CreateIndexStatement } from './CreateIndexStatement';

export class CreateIndexQuery {
  constructor(
    private readonly sessionProvider: SessionProviderInterface,
    private readonly statement: CreateIndexStatement
  ) {}

  getStatement(): string {
    return this.statement.get();
  }

  async run(): Promise<void> {
    await this.sessionProvider.run(this.getStatement(), {});
  }
}
