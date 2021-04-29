import express from 'express';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import next from 'next';
import { useAuth } from './auth';
import { initDb } from '../utils/db';
import { dbUpdates } from '../model/init';
import { getLogger } from '../utils/logger';
import { runWebSocketServer } from './ws';

export function run() {
  const logger = getLogger('server');
  const port = Number(process.env.PORT || '3000');
  const app = next({ dev: !IS_PRODUCTION });
  const handle = app.getRequestHandler();

  const server = express();
  server.disable('x-powered-by');
  server.use(compress());
  server.use(cookieParser());
  server.use(express.urlencoded({ extended: false }));
  server.use(express.static(`${PROJECT_ROOT}/.next/static`));

  if (AUTH_ENABLED) {
    useAuth(server);
  }

  initDb({ updates: dbUpdates });

  app.prepare().then(() => {
    // server.get('/customRoute', (req, res) => {
    //   return app.render(req, res, '/customRoute', req.query);
    // });

    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, () => {
      // tslint:disable-next-line:no-console
      logger.info(
        `${
          IS_PRODUCTION ? 'Production' : 'Development'
        } server listening on http://localhost:${port}`
      );
      runWebSocketServer(server);
    });
  });
}
