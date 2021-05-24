import { HttpStatus } from '@api';
import { AuthApiHandler, userRequiredApiHandler } from '@utils/auth';
import { DbWidgetDef } from '@model/widget-def/sql';
import { updateWidgetDef } from '@model/widget-def';
import {
  UpdateWidgetDefResponse,
  UpdateWidgetDefQuery,
  UpdateWidgetDefBody,
} from './interface';

export const updateWidgetDefApiHandler = userRequiredApiHandler<
  UpdateWidgetDefResponse,
  UpdateWidgetDefQuery,
  UpdateWidgetDefBody,
  { widgetDefId: DbWidgetDef['widgetDefId'] }
>(async (req, res) => {
  const { user, lastUpdate, widgetDef } = getData(req);

  const data = await updateWidgetDef(user, lastUpdate, widgetDef);

  res.status(HttpStatus.OK).json({ data });
});

type Request = Parameters<
  AuthApiHandler<
    UpdateWidgetDefResponse,
    UpdateWidgetDefQuery,
    UpdateWidgetDefBody,
    { widgetDefId: DbWidgetDef['widgetDefId'] }
  >
>[0];

function getData(req: Request) {
  const { user } = req;
  const { widgetDefId } = req.query;
  const { lastUpdate, name, type, html, js, css, images } = req.body;

  return {
    user,
    lastUpdate,
    widgetDef: {
      widgetDefId,
      type,
      name,
      html,
      js,
      css,
      images,
    },
  };
}
