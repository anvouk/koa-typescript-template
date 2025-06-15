import { Pool } from 'pg';
import settings from '../../settings.ts';
import { createSubLogger } from '../../logger.ts';
import Koa from 'koa';
import type { AppState, AppContext } from '../../koa-ctx.ts';

const logger = createSubLogger('postgres');

const pool = new Pool({
  connectionString: settings.POSTGRES_CONN_STR,
  application_name: 'koa-webapi',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxLifetimeSeconds: 60,
});

pool.on('error', (err) => {
  logger.error(err, 'postgres pool error');
});

function initPgPool(app: Koa<AppState, AppContext>) {
  app.context.pgPool = pool;
}

export default initPgPool;
