import { ClassConstructor } from '../../../domain/type/ClassConstructor';
import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { ParameterBag } from '../../parameter/ParameterBag';
import { AbstractFindQueryBuilder } from '../find/AbstractFindQueryBuilder';
import { FindGraphStatement } from '../find/FindGraphStatement';
import { FindNodeStatement } from '../find/FindNodeStatement';
import { FindOneQuery } from './FindOneQuery';

export class FindOneQueryBuilder<T> extends AbstractFindQueryBuilder<
  T,
  FindOneQuery<T>
> {
  protected createQuery(
    sessionProvider: SessionProviderInterface,
    statement: FindGraphStatement | FindNodeStatement,
    parameterBag: ParameterBag,
    cstr: ClassConstructor<T>
  ): FindOneQuery<T> {
    return new FindOneQuery<T>(sessionProvider, statement, parameterBag, cstr);
  }
}
