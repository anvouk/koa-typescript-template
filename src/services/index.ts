import Koa from 'koa';
import type { AppState, AppContext } from '../koa-ctx.ts';
import initPgPool from './database';

function initServices(app: Koa<AppState, AppContext>) {
  initPgPool(app);
}

export default initServices;
