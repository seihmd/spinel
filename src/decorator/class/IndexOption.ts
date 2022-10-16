import { IndexType } from '../../domain/index/IndexType';

export type IndexOption = {
  name?: string;
  type: IndexType;
  on: string[];
  options?: string;
};
