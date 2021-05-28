import { restApiHandler } from '@api';
import { createWidgetDefApiHandler } from '@api/widget-def/create';

export default restApiHandler({
  POST: createWidgetDefApiHandler,
});
