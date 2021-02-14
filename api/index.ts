import { NextApiHandler, NextApiResponse } from 'next';
import { IncomingMessage } from 'http';
import { Env } from 'next/dist/lib/load-env-config';
import { UserAuthData } from '@model/user';
import { NsLogger } from '@utils/logger';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
/* | 'CONNECT' | 'OPTIONS' | 'TRACE' */

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export enum HttpStatus {
  // 2xx Success
  OK = 200,
  // 4xx Client Error
  BAD_REQUEST = 400,
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
      id?: string;
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

/**
 * Send an "Error" response.
 * `httpCode` is by default HttpStatus.BAD_REQUEST (400)
 */
export function apiError<E extends Error = Error>(
  res: NextApiResponse,
  data: {
    error: E | string;
    httpCode?: HttpStatus;
  }
): void;

/**
 * Send an "Error" response AND logs an `error` in the provided logger.
 * The logged message will be the full error, and the response message
 * will be the provided one (to hide internal information).
 * Both, response and logged error will be linked by the same errorId so
 * they can be found in server logs to debug with better details.
 */
export function apiError<E extends Error = Error>(
  res: NextApiResponse,
  data: {
    error: E | string;
    logger: NsLogger;
    responseError: string;
    httpCode?: HttpStatus;
  }
): void;

export function apiError<E extends Error = Error>(
  res: NextApiResponse,
  data: {
    error: E | string;
    logger?: NsLogger;
    responseError?: string;
    httpCode?: HttpStatus;
  }
): void {
  const { error, logger, responseError, httpCode } = data;

  if (responseError) {
    // tslint:disable-next-line:no-magic-numbers
    const errorId = `${Date.now()}.${String(Math.random()).substr(2, 4)}`;
    logger!.error(errorId, error);

    return res.status(httpCode || HttpStatus.BAD_REQUEST).json({
      error: true,
      msg: responseError,
      id: errorId,
    });
  }

  res.status(httpCode || HttpStatus.BAD_REQUEST).json({
    error: true,
    msg: String(error),
  });
}
