import Result from 'neo4j-driver-core/types/result';
import { Query } from 'neo4j-driver-core/types/types';

export interface SessionInterface {
  run(query: Query, parameters?: unknown): Result;
}
