import Router from '@koa/router';
import { ReqDemoRouteBodySchema } from './dtos.ts';

const router = new Router({
  prefix: '/user',
});

router.get('/', async (ctx) => {
  ctx.body = 'ok';
});

router.post('/', async (ctx) => {
  const payload = ReqDemoRouteBodySchema.parse(ctx.request.body);

  ctx.body = {
    payload: payload,
  };
});

export default router;
