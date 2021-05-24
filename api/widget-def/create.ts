import { HttpStatus } from '@api';
import { AuthApiHandler, userRequiredApiHandler } from '@utils/auth';
import { createWidgetDef } from '@model/widget-def';
import {
  CreateWidgetDefResponse,
  CreateWidgetDefQuery,
  CreateWidgetDefBody,
} from './interface';

export const createWidgetDefApiHandler = userRequiredApiHandler<
  CreateWidgetDefResponse,
  CreateWidgetDefQuery,
  CreateWidgetDefBody
>(async (req, res) => {
  const { user, widgetDef } = getData(req);

  const data = await createWidgetDef(user, widgetDef);

  res.status(HttpStatus.OK).json({ data });
});

type Request = Parameters<
  AuthApiHandler<
    CreateWidgetDefResponse,
    CreateWidgetDefQuery,
    CreateWidgetDefBody
  >
>[0];

function getData(req: Request) {
  const { user } = req;
  const { type, name, html, js, css } = req.body;

  return {
    user,
    widgetDef: { type, name, html, js, css },
  };
}
