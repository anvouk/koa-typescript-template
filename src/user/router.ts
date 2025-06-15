import Router from '@koa/router';
import { ReqDemoRouteBodySchema } from './dtos.ts';
import type { RouteContext } from '../koa-ctx.ts';

const router = new Router({
  prefix: '/user',
});

router.get('/', async (ctx) => {
  ctx.body = 'ok';
});

router.post('/', async (ctx: RouteContext) => {
  const payload = ReqDemoRouteBodySchema.parse(ctx.request.body);

  const num = await ctx.app.context.pgPool.query<{ num: number }>('SELECT 1 AS num;');

  ctx.body = {
    payload: payload,
    res: num.rows[0]?.num,
  };
});

export default router;
