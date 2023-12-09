declare global {
  // eslint-disable-next-line
  interface PromiseConstructor {
    parallel: typeof parallel;
  }
}

function hasValue<T extends object>(
  item: T & { value?: unknown },
): item is T & { value: unknown } {
  return !item || 'value' in item;
}

async function parallel<T extends readonly unknown[] | []>(values: T) {
  const results = await Promise.all(
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
  );
  const rejected = results.find(
    (result) => result && result.state === 'rejected',
  );

  if (rejected && 'reason' in rejected) {
    return Promise.reject(rejected.reason);
  }

  return results
    .filter(hasValue)
    .map((result) => result.value) as unknown as Promise<{
    -readonly [P in keyof T]: Awaited<T[P]>;
  }>;
}

void Object.defineProperty(Promise, 'parallel', {
  value: parallel,
  configurable: false,
  enumerable: false,
  writable: false,
});

export {};
