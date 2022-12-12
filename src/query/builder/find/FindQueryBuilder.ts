import { ClassConstructor } from '../../../domain/type/ClassConstructor';
import { ParameterBag } from '../../parameter/ParameterBag';
import { SessionProviderInterface } from '../session/SessionProviderInterface';
import { AbstractFindQueryBuilder } from './AbstractFindQueryBuilder';
import { FindGraphStatement } from './FindGraphStatement';
import { FindNodeStatement } from './FindNodeStatement';
import { FindQuery } from './FindQuery';

export class FindQueryBuilder<T> extends AbstractFindQueryBuilder<
  T,
  FindQuery<T>
> {
  protected createQuery(
    sessionProvider: SessionProviderInterface,
    statement: FindGraphStatement | FindNodeStatement,
    parameterBag: ParameterBag,
    cstr: ClassConstructor<T>
  ): FindQuery<T> {
    return new FindQuery<T>(sessionProvider, statement, parameterBag, cstr);
  }
}
