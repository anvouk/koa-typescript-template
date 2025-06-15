import z from 'zod/v4';

export const ReqDemoRouteBodySchema = z.object({
  name: z.string().nonempty(),
});
