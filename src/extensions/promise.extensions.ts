type TValue<T> = T | PromiseLike<T>;
type TResultFulfilled<T> = {
  state: string;
  value: T;
  reason?: unknown;
};
type TResultRejected = {
  state: string;
  reason: unknown;
};

declare global {
  // eslint-disable-next-line
  interface PromiseConstructor {
    parallel: typeof parallel;
  }
}

Promise.parallel = parallel;

function hasValue<T>(
  item: TResultFulfilled<T> | TResultRejected,
): item is TResultFulfilled<T> {
  return !item || 'value' in item;
}

// type-coverage:ignore-next-line
void Object.defineProperty(Promise.prototype, 'parallel', {
  value: parallel,
  configurable: false,
  enumerable: false,
  writable: false,
});

//<editor-fold defaultstate="expanded" desc="Overrides for typings">
function parallel<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(
  values: [
    TValue<T1>,
    TValue<T2>,
    TValue<T3>,
    TValue<T4>,
    TValue<T5>,
    TValue<T6>,
    TValue<T7>,
    TValue<T8>,
    TValue<T9>,
    TValue<T10>,
    TValue<T11>,
  ],
): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11]>;
function parallel<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  values: [
    TValue<T1>,
    TValue<T2>,
    TValue<T3>,
    TValue<T4>,
    TValue<T5>,
    TValue<T6>,
    TValue<T7>,
    TValue<T8>,
    TValue<T9>,
    TValue<T10>,
  ],
): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;
function parallel<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  values: [
    TValue<T1>,
    TValue<T2>,
    TValue<T3>,
    TValue<T4>,
    TValue<T5>,
    TValue<T6>,
    TValue<T7>,
    TValue<T8>,
    TValue<T9>,
  ],
): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
function parallel<T1, T2, T3, T4, T5, T6, T7, T8>(
  values: [
    TValue<T1>,
    TValue<T2>,
    TValue<T3>,
    TValue<T4>,
    TValue<T5>,
    TValue<T6>,
    TValue<T7>,
    TValue<T8>,
  ],
): Promise<[T1, T2, T3, T4, T5, T6, T7, T8]>;
function parallel<T1, T2, T3, T4, T5, T6, T7>(
  values: [
    TValue<T1>,
    TValue<T2>,
    TValue<T3>,
    TValue<T4>,
    TValue<T5>,
    TValue<T6>,
    TValue<T7>,
  ],
): Promise<[T1, T2, T3, T4, T5, T6, T7]>;
function parallel<T1, T2, T3, T4, T5, T6>(
  values: [
    TValue<T1>,
    TValue<T2>,
    TValue<T3>,
    TValue<T4>,
    TValue<T5>,
    TValue<T6>,
  ],
): Promise<[T1, T2, T3, T4, T5, T6]>;
function parallel<T1, T2, T3, T4, T5>(
  values: [TValue<T1>, TValue<T2>, TValue<T3>, TValue<T4>, TValue<T5>],
): Promise<[T1, T2, T3, T4, T5]>;
function parallel<T1, T2, T3, T4>(
  values: [TValue<T1>, TValue<T2>, TValue<T3>, TValue<T4>],
): Promise<[T1, T2, T3, T4]>;
function parallel<T1, T2, T3>(
  values: [TValue<T1>, TValue<T2>, TValue<T3>],
): Promise<[T1, T2, T3]>;
function parallel<T1, T2>(values: [TValue<T1>, TValue<T2>]): Promise<[T1, T2]>;
function parallel<T>(values: TValue<T>[]): Promise<T[]>;
//</editor-fold>

function parallel<T>(values: readonly TValue<T>[]): Promise<T[]> {
  return Promise.all(
    values.map((p) =>
      Promise.resolve(p).then(
        (v) => ({
          state: 'fulfilled',
          value: v,
        }),
        (r: unknown) => ({
          state: 'rejected',
          reason: r,
        }),
      ),
    ),
  ).then((results: (TResultFulfilled<T> | TResultRejected)[]) => {
    const rejected = results.find(
      (result) => result && result.state === 'rejected',
    );

    if (rejected) {
      return Promise.reject(rejected.reason);
    }

    return results.filter(hasValue).map((result) => result?.value);
  });
}

export {};
