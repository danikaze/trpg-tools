import { createServer } from 'http';
import { Express } from 'express';
import { Server } from 'ws';
import { getLogger } from '../utils/logger';
import { selectWidgetKey } from '../model/widget-key';
import {
  CloseEventCode,
  createWebSocketHandler,
  isValidGreetingMsg,
} from '../web-socket';

export function runWebSocketServer(express: Express) {
  const logger = getLogger('wss');
  const port = Number(process.env.WSS_PORT || WEB_SOCKET_PORT);

  const server = createServer(express);
  const wss = new Server({
    server,
    path: WEB_SOCKET_PATH,
  });

  wss.on('connection', (ws) => {
    // the first message should always be a connection message
    ws.once('message', async (msg) => {
      try {
        const json = JSON.parse(msg);
        if (!isValidGreetingMsg(json)) {
          throw new Error('Invalid greeting message');
        }

        const widget = await selectWidgetKey(json.widgetId);
        // tslint:disable-next-line: no-any
        createWebSocketHandler(ws as any, json.widgetId, widget);
      } catch (e) {
        logger.warn((e as Error).message);
        ws.close(CloseEventCode.PROTOCOL_ERROR);
      }
    });
  });

  server.listen(port, () => {
    logger.info(`Server listening on ws://localhost:${port}${WEB_SOCKET_PATH}`);
  });
}
