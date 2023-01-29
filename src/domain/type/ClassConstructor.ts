export declare type ClassConstructor<T> = {
  new (...args: any[]): T;
};

export declare type AnyClassConstructor = ClassConstructor<any>;
export declare type ObjectClassConstructor = ClassConstructor<object>;
