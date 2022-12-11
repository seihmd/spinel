import { SessionInterface } from './SessionInterface';

export interface SessionProviderInterface {
  get(): SessionInterface;
}
