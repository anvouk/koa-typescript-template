import Koa from 'koa';
import Router from '@koa/router';
import * as http from 'node:http';
import { createSubLogger } from './logger.ts';
import bodyParser from '@koa/bodyparser';
import cors from '@koa/cors';
import koaLogger from 'koa-logger';
import userRouter from './user/router.ts';
import settings from './settings.ts';
import errorHandling from './error-handling';
import type { AppState, AppContext } from './koa-ctx.ts';
import initServices from './services';

const logger = createSubLogger('app');

const app = new Koa<AppState, AppContext>();
const router = new Router();

initServices(app);

app.use(
  koaLogger({
    transporter: (str, _) => {
      logger.debug(str);
    },
  }),
);

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    await errorHandling(err, ctx);
  }
});

router.use('/api/v1', userRouter.routes(), userRouter.allowedMethods());

app.use(cors());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.on('error', errorHandling);

logger.info(`listening at http://localhost:${settings.SERVER_PORT}`);
const server = http.createServer(app.callback()).listen(settings.SERVER_PORT);

async function shutdownHook() {
  try {
    server.close();
  } catch (err) {
    logger.warn(err, 'server closed with errors');
  }
}

process.on('SIGINT', shutdownHook);
process.on('SIGTERM', shutdownHook);
