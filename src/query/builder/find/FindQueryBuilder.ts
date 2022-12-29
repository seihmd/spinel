import { ClassConstructor } from '../../../domain/type/ClassConstructor';
import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { ParameterBag } from '../../parameter/ParameterBag';
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
