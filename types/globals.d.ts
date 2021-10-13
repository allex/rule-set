/* tslint:disable: no-empty-interface */

// Ensure this is treated as a module.
export {}

declare global {
  type IFunc = (...args: any[]) => any
  type IArgs = IArguments | any[]
  type Newable<T> = new (...args: any[]) => T
  type ICallback = (error?: Error | any, data?: any) => void

  type PartialDeep<T> = {
    [P in keyof T]?: PartialDeep<T[P]>
  }

  /** Common interface between Arrays and jQuery objects */
  type List<T> = ArrayLike<T>

  // https://fnune.com/typescript/2019/01/30/typescript-series-1-record-is-usually-not-the-best-choice/
  type Dictionary<K extends keyof any, T> = Partial<Record<K, T>>

  interface NumericDictionary<T> {
    [index: number]: T;
  }

  interface Kv<T = any> {
    [index: string | symbol ]: T
  }

  /**
   * Same as Partial<T> but goes deeper and makes Partial<T> all its properties and sub-properties.
   */
  type DeepPartial<T> = {
    [P in keyof T]?:
      T[P] extends Array<infer U> ? Array<DeepPartial<U>> :
      T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> :
      DeepPartial<T[P]>
  };

  type Many<T> = T | ReadonlyArray<T>
  type PropertyName = string | number | symbol
  type PropertyPath = Many<PropertyName>

  type NotVoid = {} | null | undefined
  type IterateeShorthand<T> = PropertyName | [PropertyName, any] | PartialDeep<T>
  type ArrayIterator<T, TResult> = (value: T, index: number, collection: T[]) => TResult
  type ListIterator<T, TResult> = (value: T, index: number, collection: List<T>) => TResult
  type ListIteratee<T> = ListIterator<T, NotVoid> | IterateeShorthand<T>
  type ListIterateeCustom<T, TResult> = ListIterator<T, TResult> | IterateeShorthand<T>
  type MemoObjectIterator<T, TResult, TList> = (prev: TResult, curr: T, key: string, list: TList) => TResult;

  /* overrides */
  interface Error extends Kv {}
  interface Promise<T> extends Kv {}
  interface Event extends Kv { data: any; }
  function parseInt (s: string | number, radix?: number): number
}
