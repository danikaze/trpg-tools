import { HttpStatus } from '@api';
import { AuthApiHandler, userRequiredApiHandler } from '@utils/auth';
import { DbWidgetKey } from '@model/widget-key/sql';
import { renameWidgetKey } from '@model/widget-key';
import {
  UpdateWidgetKeyResponse,
  UpdateWidgetKeyQuery,
  UpdateWidgetKeyBody,
} from './interface';

export const updateWidgetKeyApiHandler = userRequiredApiHandler<
  UpdateWidgetKeyResponse,
  UpdateWidgetKeyQuery,
  UpdateWidgetKeyBody,
  { widgetKeyId: DbWidgetKey['widgetKeyId'] }
>(async (req, res) => {
  const { user, widgetKeyId, name } = getData(req);

  await renameWidgetKey(user, widgetKeyId, name);

  res.status(HttpStatus.OK).json({ data: {} });
});

type Request = Parameters<
  AuthApiHandler<
    UpdateWidgetKeyResponse,
    UpdateWidgetKeyQuery,
    UpdateWidgetKeyBody,
    { widgetKeyId: DbWidgetKey['widgetKeyId'] }
  >
>[0];

function getData(req: Request) {
  const { user } = req;
  const { widgetKeyId } = req.query;
  const { name } = req.body;

  return {
    user,
    widgetKeyId,
    name,
  };
}
