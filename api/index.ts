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
  METHOD_NOT_ALLOWED = 405,
  // 5xx Server Error
}

export interface ScalarKeyValue {
  [key: string]: number | string;
}

export type RestApiHandlerMethods<
  GETR = void,
  GETQ extends {} = {},
  GETB extends {} = {},
  GETK extends string = never,
  GETI extends number | string = never,
  POSTR = void,
  POSTQ extends {} = {},
  POSTB extends {} = {},
  POSTK extends string = never,
  POSTI extends number | string = never,
  PUTR = void,
  PUTQ extends {} = {},
  PUTB extends {} = {},
  PUTK extends string = never,
  PUTI extends number | string = never,
  DELETER = void,
  DELETEQ extends {} = {},
  DELETEB extends {} = {},
  DELETEK extends string = never,
  DELETEI extends number | string = never
> = {
  GET?: ApiHandler<GETR, GETQ, GETB, GETK, GETI>;
  POST?: ApiHandler<POSTR, POSTQ, POSTB, POSTK, POSTI>;
  PUT?: ApiHandler<PUTR, PUTQ, PUTB, PUTK, PUTI>;
  DELETE?: ApiHandler<DELETER, DELETEQ, DELETEB, DELETEK, DELETEI>;
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

/*
 * Redeclaration of NextApiHandler to provide typings on:
 * R: Return type
 * Q: Query parameters
 * B: Body data
 * K and I provides an extra parameter to the query, for those restful APIs
 *   which accept a resource ID in the url as /api/resourceId
 * K is usually the name of the parameter as [K].ts, and I the value of the type
 */
export type ApiHandler<
  R = void,
  Q extends {} = {},
  B extends {} = {},
  K extends string = never,
  I extends number | string = never
> = (
  req: ApiRequest<Q & { [k in K]: I }, B>,
  res: NextApiResponse<ApiResponse<R>>
) => void | Promise<void>;

export function restApiHandler<
  GETR = void,
  GETQ extends {} = {},
  GETB extends {} = {},
  GETK extends string = never,
  GETI extends number | string = never,
  POSTR = void,
  POSTQ extends {} = {},
  POSTB extends {} = {},
  POSTK extends string = never,
  POSTI extends number | string = never,
  PUTR = void,
  PUTQ extends {} = {},
  PUTB extends {} = {},
  PUTK extends string = never,
  PUTI extends number | string = never,
  DELETER = void,
  DELETEQ extends {} = {},
  DELETEB extends {} = {},
  DELETEK extends string = never,
  DELETEI extends number | string = never
>(
  handlers: RestApiHandlerMethods<
    GETR,
    GETQ,
    GETB,
    GETK,
    GETI,
    POSTR,
    POSTQ,
    POSTB,
    POSTK,
    POSTI,
    PUTR,
    PUTQ,
    PUTB,
    PUTK,
    PUTI,
    DELETER,
    DELETEQ,
    DELETEB,
    DELETEK,
    DELETEI
  >
): NextApiHandler {
  return async (req, res) => {
    const handler = handlers[req.method as HttpMethod] as NextApiHandler;
    if (!handler) {
      res.setHeader('Allow', Object.keys(handlers));
      res
        .status(HttpStatus.METHOD_NOT_ALLOWED)
        .end(`Method ${req.method} Not Allowed`);
      return;
    }

    try {
      await handler(req, res);
    } catch (error) {
      apiError(res, { error });
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
