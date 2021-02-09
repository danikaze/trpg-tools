import { NextApiHandler, NextApiResponse } from 'next';
import { IncomingMessage } from 'http';
import { Env } from 'next/dist/lib/load-env-config';
import { UserAuthData } from '@model/user';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
/* | 'CONNECT' | 'OPTIONS' | 'TRACE' */

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export enum HttpStatus {
  // 2xx Success
  OK = 200,
  // 4xx Client Error
  NOT_FOUND = 404,
  // 5xx Server Error
}

export interface ScalarKeyValue {
  [key: string]: number | string;
}

export type RestApiHandlerMethods<
  GETR = void,
  GETQ extends {} = {},
  GETB extends {} = {},
  POSTR = void,
  POSTQ extends {} = {},
  POSTB extends {} = {},
  PUTR = void,
  PUTQ extends {} = {},
  PUTB extends {} = {},
  DELETER = void,
  DELETEQ extends {} = {},
  DELETEB extends {} = {}
> = {
  GET?: ApiHandler<GETR, GETQ, GETB>;
  POST?: ApiHandler<POSTR, POSTQ, POSTB>;
  PUT?: ApiHandler<PUTR, PUTQ, PUTB>;
  DELETE?: ApiHandler<DELETER, DELETEQ, DELETEB>;
};

export type ApiResponse<R> =
  | {
      data: R;
    }
  | {
      error: true;
      msg?: string;
    };

/* Redeclaration of NextApiRequest to provide typings on `query` and `body` */
export interface ApiRequest<Q, B> extends IncomingMessage {
  query: Q;
  body: B;
  cookies: {
    [key: string]: string;
  };
  user: UserAuthData | false;
  env: Env;
}

/* Redeclaration of NextApiHandler to provide typings on `query` and `body` */
export type ApiHandler<R = void, Q extends {} = {}, B extends {} = {}> = (
  req: ApiRequest<Q, B>,
  res: NextApiResponse<ApiResponse<R>>
) => void | Promise<void>;

export function restApiHandler<
  GETR = void,
  GETQ extends {} = {},
  GETB extends {} = {},
  POSTR = void,
  POSTQ extends {} = {},
  POSTB extends {} = {},
  PUTR = void,
  PUTQ extends {} = {},
  PUTB extends {} = {},
  DELETER = void,
  DELETEQ extends {} = {},
  DELETEB extends {} = {}
>(
  handlers: RestApiHandlerMethods<
    GETR,
    GETQ,
    GETB,
    POSTR,
    POSTQ,
    POSTB,
    PUTR,
    PUTQ,
    PUTB,
    DELETER,
    DELETEQ,
    DELETEB
  >
): NextApiHandler {
  return async (req, res) => {
    const handler = handlers[req.method as HttpMethod] as NextApiHandler;
    if (!handler) {
      res.status(HttpStatus.NOT_FOUND).end();
      return;
    }

    try {
      await handler(req, res);
    } catch (error) {
      apiError(res, error);
    }
  };
}

export function apiError<E extends Error = Error>(
  res: NextApiResponse,
  error: E
): void {
  res.status(HttpStatus.OK).json({
    error: true,
    msg: String(error),
  });
}
