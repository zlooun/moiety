declare global {
  // eslint-disable-next-line
  interface PromiseConstructor {
    parallel: typeof parallel;
  }
}

async function parallel<T extends readonly unknown[] | []>(
  values: T,
): Promise<{
  -readonly [P in keyof T]: Awaited<T[P]>;
}> {
  const results = await Promise.allSettled(values);
  const rejected = results.find(({ status }) => status === 'rejected');

  if (rejected) {
    return Promise.reject((rejected as PromiseRejectedResult).reason);
  }

  //@ts-ignore
  return results.map(({ value }) => value);
}

void Object.defineProperty(Promise, 'parallel', {
  value: parallel,
  configurable: false,
  enumerable: false,
  writable: false,
});

export {};
