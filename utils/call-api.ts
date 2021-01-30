import { HttpMethod } from '@api';
import { addUrlParams } from './url';

export type CallApiType = 'names';

export interface CallApiOptions<Q extends {} = {}, B extends {} = {}> {
  /**
   * Data to pass in the query string
   */
  params?: Q;
  /**
   * Data to pass in the body
   */
  data?: B;
  /**
   * Milliseconds before timing-out (falsy or <0 value to disable)
   * Default is 10 seconds.
   */
  timeout?: number;
}

type MethodOptions<
  M extends HttpMethod,
  Q extends {} = {},
  B extends {} = {}
> = CallApiOptions<Q, M extends 'GET' | 'HEAD' ? never : B>;

const defaultOptions: Partial<CallApiOptions> = {
  timeout: 10000,
};

export function callApi<
  R extends {},
  Q extends {} = {},
  B extends {} = {},
  M extends HttpMethod = 'GET'
>(api: CallApiType, method: M, opt: MethodOptions<M, Q, B> = {}): Promise<R> {
  const options = {
    ...defaultOptions,
    ...opt,
  };

  return new Promise<R>((resolve, reject) => {
    let timeoutHandler: number;
    if (options.timeout! > 0) {
      timeoutHandler = window.setTimeout(
        () => reject('timeout'),
        options.timeout!
      );
    }

    const body = options.data ? JSON.stringify(options.data) : undefined;
    const url = options.params
      ? addUrlParams(`/api/${api}`, options.params)
      : `/api/${api}`;

    fetch(url, {
      method,
      body,
    }).then((response) => {
      clearTimeout(timeoutHandler);
      resolve(response.json());
    });
  });
}
