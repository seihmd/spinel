import { QueryResult } from 'neo4j-driver';
import TransactionPromise from 'neo4j-driver-core/types/transaction-promise';
import { SessionProviderInterface } from './SessionProviderInterface';

export class TransactionalSessionProvider implements SessionProviderInterface {
  private readonly txc: TransactionPromise;

  constructor(txc: TransactionPromise) {
    this.txc = txc;
  }

  async run(statement: string, parameters: unknown): Promise<QueryResult> {
    return await this.txc.run(statement, parameters);
  }
}
