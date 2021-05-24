import { restApiHandler } from '@api';
import { deleteWidgetDefApiHandler } from '@api/widget-def/delete';
import { updateWidgetDefApiHandler } from '@api/widget-def/update';

export default restApiHandler({
  DELETE: deleteWidgetDefApiHandler,
  PUT: updateWidgetDefApiHandler,
});
