import { restApiHandler } from '@api';
import { deleteWidgetKeyApiHandler } from '@api/widget-key/delete';
import { updateWidgetKeyApiHandler } from '@api/widget-key/update';

export default restApiHandler({
  PUT: updateWidgetKeyApiHandler,
  DELETE: deleteWidgetKeyApiHandler,
});
