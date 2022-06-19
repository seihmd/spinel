export declare type ClassConstructor<T> = {
  new (...args: any[]): T;
};

export declare type AnyClassConstructor = ClassConstructor<any>;
