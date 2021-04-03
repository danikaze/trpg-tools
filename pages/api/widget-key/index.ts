import { restApiHandler } from '@api';
import { createWidgetKeyApiHandler } from '@api/widget-key/create';

export default restApiHandler({
  POST: createWidgetKeyApiHandler,
});
