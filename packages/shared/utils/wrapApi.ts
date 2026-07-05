type AsyncFn = (...args: any[]) => Promise<any>;

type WrappedApi<T> = {
  [K in keyof T]: T[K] extends AsyncFn
    ? (...args: Parameters<T[K]>) => ReturnType<T[K]>
    : T[K];
};

export function WrapApi<T extends Record<string, any>>(
  apiModule: T,
): WrappedApi<T> {
  const wrapped = {} as WrappedApi<T>;

  for (const key in apiModule) {
    const value = apiModule[key];

    if (typeof value === "function") {
      wrapped[key] = (async (...args: Parameters<typeof value>) => {
        const res = await value(...args);

        if (res?.status === "error") {
          throw new Error(res.message);
        }

        return res;
      }) as WrappedApi<T>[typeof key];
    } else {
      wrapped[key] = value as WrappedApi<T>[typeof key];
    }
  }

  return wrapped;
}
