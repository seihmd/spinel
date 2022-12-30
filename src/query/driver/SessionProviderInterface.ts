import { QueryResult } from 'neo4j-driver';

export interface SessionProviderInterface {
  run(statement: string, parameters: unknown): Promise<QueryResult>;
}
