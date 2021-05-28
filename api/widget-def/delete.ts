import { HttpStatus } from '@api';
import { userRequiredApiHandler } from '@utils/auth';
import { DbWidgetDef } from '@model/widget-def/sql';
import { deleteWidgetDef } from '@model/widget-def';
import {
  DeleteWidgetDefResponse,
  DeleteWidgetDefQuery,
  DeleteWidgetDefBody,
} from './interface';

export const deleteWidgetDefApiHandler = userRequiredApiHandler<
  DeleteWidgetDefResponse,
  DeleteWidgetDefQuery,
  DeleteWidgetDefBody,
  { widgetDefId: DbWidgetDef['widgetDefId'] }
>(async (req, res) => {
  const { widgetDefId } = req.query;

  await deleteWidgetDef(req.user, widgetDefId);

  res.status(HttpStatus.OK).json({ data: {} });
});
