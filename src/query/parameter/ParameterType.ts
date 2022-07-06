export type GraphParameterType = { [key: string]: EntityParameterType };
export type EntityParameterType = { [key: string]: EntityParameterValueType };
export type EntityParameterValueType =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | boolean[];
