import { HttpStatus } from '@api';
import { AuthApiHandler, userRequiredApiHandler } from '@utils/auth';
import { createWidgetKey } from '@model/widget-key';
import {
  CreateWidgetKeyResponse,
  CreateWidgetKeyQuery,
  CreateWidgetKeyBody,
} from './interface';

export const createWidgetKeyApiHandler = userRequiredApiHandler<
  CreateWidgetKeyResponse,
  CreateWidgetKeyQuery,
  CreateWidgetKeyBody
>(async (req, res) => {
  const { user, widgetDefId, name, noteId } = getData(req);

  const data = await createWidgetKey(user, widgetDefId, name, {
    noteId,
  });

  res.status(HttpStatus.OK).json({ data });
});

type Request = Parameters<
  AuthApiHandler<
    CreateWidgetKeyResponse,
    CreateWidgetKeyQuery,
    CreateWidgetKeyBody
  >
>[0];

function getData(req: Request) {
  const { user } = req;
  const { widgetDefId, name, noteId } = req.body;

  return {
    user,
    widgetDefId,
    name,
    noteId,
  };
}
