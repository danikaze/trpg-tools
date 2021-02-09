import { Request, Response, NextFunction } from 'express';
import { GetServerSidePropsContext, NextApiResponse } from 'next';
import { useSelector } from 'react-redux';
import { UserAuthData } from '@model/user';
import { userSelector } from '@store/model/user/selectors';
import { UserState } from '@store/model/user';
import { ApiRequest, ApiResponse } from '@api';
import { getLogger } from './logger';

const HTTP_FORBIDDEN = 401;
const logger = getLogger('auth');

interface RequestData {
  req: Request;
  res: Response;
  user: UserAuthData;
}

// tslint:disable-next-line: no-any
type GenericRequest = ApiRequest<any, any>;
// tslint:disable-next-line: no-any
type GenericResponse = NextApiResponse<ApiResponse<any>>;

/**
 * Hook that returns the available user data in the redux store
 * or `null` if undefined
 */
export function useUserData(): UserState {
  return useSelector(userSelector);
}

/**
 * If called from `getServerSideProps` it will redirect first to
 * `AUTH_LOCAL_DO_LOGOUT_URL` to clear user credentials
 * ```
 * export const getServerSideProps: GetServerSideProps = async (ctx) => {
 *   logoutRequired(ctx);
 *   return {
 *     props: { ... };
 *   };
 * };
 * ```
 */
export function logoutRequired(
  ctx: GetServerSidePropsContext
): true | undefined;
export function logoutRequired(
  req: Request,
  res: Response,
  next: NextFunction
): void;
export function logoutRequired(
  req: Request | GetServerSidePropsContext,
  res?: Response,
  next?: NextFunction
): true | undefined {
  return logoutIfRequired(req, res, next);
}

/**
 * If called from `getServerSideProps` it will forbid non-logged in users
 * redirecting them to the `LOGIN_PAGE` (they will be redirected to the page
 * after login successfully)
 * ```
 * export const getServerSideProps: GetServerSideProps = async (ctx) => {
 *   userRequired(ctx);
 *   return {
 *     props: { ... };
 *   };
 * };
 * ```
 */
export function userRequired(ctx: GetServerSidePropsContext): true | undefined;
export function userRequired(
  req: Request,
  res: Response,
  next: NextFunction
): void;
export function userRequired(
  req: Request | GetServerSidePropsContext,
  res?: Response,
  next?: NextFunction
): true | undefined {
  return roleRequired(['user', 'admin'], req, res, next);
}

/**
 * If called from `getServerSideProps` it will forbid non-logged in users or
 * logged users without the `admin` role, redirecting them to the `LOGIN_PAGE`
 * (they will be redirected to the page after login successfully)
 * ```
 * export const getServerSideProps: GetServerSideProps = async (ctx) => {
 *   adminRequired(ctx);
 *   return {
 *     props: { ... };
 *   };
 * };
 * ```
 */
export function adminRequired(ctx: GetServerSidePropsContext): true | undefined;
export function adminRequired(
  req: Request,
  res: Response,
  next: NextFunction
): void;
export function adminRequired(
  req: Request | GetServerSidePropsContext,
  res?: Response,
  next?: NextFunction
): true | undefined {
  return roleRequired(['admin'], req, res, next);
}

/**
 * To be called from an API, it will return an error in the standard format
 * if the user is not logged.
 * API should be stopped if returns `true` like:
 * ```
 * if(apiUserRequired(req, res)) return;
 * ```
 */
export function apiUserRequired(
  req: GenericRequest,
  res: GenericResponse
): true | undefined {
  return apiRoleRequired(['user', 'admin'], req, res);
}

/**
 * To be called from an API, it will return an error in the standard format
 * if the user is not logged.
 * API should be stopped if returns `true` like:
 * ```
 * if(apiAdminRequired(req, res)) return;
 * ```
 */
export function apiAdminRequired(
  req: GenericRequest,
  res: GenericResponse
): true | undefined {
  return apiRoleRequired(['admin'], req, res);
}

/**
 * This function can be used inside `getServerSideProps` (just calling it
 * with the context is enough) or as a express middleware, and it will
 * redirect to the `LOGIN_PAGE` if the user is not logged-in. If logged in
 * but it hasn't the correct role, a 401 Forbidden status will be triggered.
 * In this case a redirection to `AUTH_FORBIDDEN_PAGE` will happen if defined.
 */
function roleRequired(
  role: string[],
  a: Request | GetServerSidePropsContext,
  b?: Response,
  next?: NextFunction
): true | undefined {
  const { req, res, user } = getRequestData(a, b);
  const { originalUrl } = req;

  if (!user) {
    logger.info(`Blocked: Non logged user when tried to access ${originalUrl}`);
    res.redirect(
      `${AUTH_LOGIN_PAGE}?${AUTH_LOGIN_REDIRECT_PARAM}=${originalUrl}`
    );
    res.end();
    return true;
  }

  if (!role.includes(user.role)) {
    logger.info(`Blocked: Wrong role user when tried to access ${originalUrl}`);
    try {
      if (AUTH_FORBIDDEN_PAGE) {
        res.redirect(AUTH_FORBIDDEN_PAGE);
      } else {
        res.sendStatus(HTTP_FORBIDDEN);
      }
    } catch (err) {
      res.sendStatus(HTTP_FORBIDDEN);
    }
    res.end();
    return true;
  }

  typeof next === 'function' && next();
}

function apiRoleRequired(
  role: string[],
  req: GenericRequest,
  res: GenericResponse
) {
  const {
    req: { originalUrl },
    user,
  } = getRequestData(req, res);

  if (!user) {
    logger.info(
      `Blocked: Non logged user when tried to access API ${originalUrl}`
    );
    res.status(HTTP_FORBIDDEN);
    res.json({
      error: true,
      msg: 'Not logged',
    });
    res.end();
    return true;
  }

  if (role.includes(user.role)) return;

  logger.info(
    `Blocked: Wrong role user when tried to access API ${originalUrl}`
  );
  res.status(HTTP_FORBIDDEN);
  res.json({
    error: true,
    msg: 'Forbidden',
  });
  res.end();
  return true;
}

/**
 * This function can be used inside `getServerSideProps` (just calling
 * it with the context is enough) or as a express middleware, and it will
 * redirect to the `AUTH_LOCAL_DO_LOGOUT_URL` to effectively clear user
 * credentials if the user is logged-in
 */
function logoutIfRequired(
  a: Request | GetServerSidePropsContext,
  b?: Response,
  next?: NextFunction
): true | undefined {
  const { res, user } = getRequestData(a, b);

  if (user) {
    logger.info(`Redirecting user to the logout page`);
    res.redirect(`${AUTH_DO_LOGOUT_URL}`);
    res.end();
    return true;
  }

  typeof next === 'function' && next();
}

/**
 * Get the Request, the Response and the User data from parameters accepting
 * the ones from `getServerSideProps` or the ones as a express middleware
 */
function getRequestData(
  a: Request | GenericRequest | GetServerSidePropsContext,
  b?: Response | GenericResponse
): RequestData {
  const req = ((a as GetServerSidePropsContext).req!
    ? (a as GetServerSidePropsContext).req
    : a) as Request;
  const user = req.user as UserAuthData;
  const res = ((a as GetServerSidePropsContext).res
    ? (a as GetServerSidePropsContext).res
    : b) as Response;

  return { req, res, user };
}
