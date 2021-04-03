import { HttpStatus } from '@api';
import { userRequiredApiHandler } from '@utils/auth';
import { DbWidgetKey } from '@model/widget-key/sql';
import { deleteWidgetKey } from '@model/widget-key';
import {
  DeleteWidgetKeyResponse,
  DeleteWidgetKeyQuery,
  DeleteWidgetKeyBody,
} from './interface';

export const deleteWidgetKeyApiHandler = userRequiredApiHandler<
  DeleteWidgetKeyResponse,
  DeleteWidgetKeyQuery,
  DeleteWidgetKeyBody,
  { widgetKeyId: DbWidgetKey['widgetKeyId'] }
>(async (req, res) => {
  const { widgetKeyId } = req.query;

  await deleteWidgetKey(req.user, widgetKeyId);

  res.status(HttpStatus.OK).json({ data: {} });
});
