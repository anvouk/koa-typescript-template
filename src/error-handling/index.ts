import type { Context } from 'koa';
import { createSubLogger } from '../logger.ts';
import { generateProblemDetails, generateValidationProblemDetail } from './problem-details.ts';
import z from 'zod/v4';

const logger = createSubLogger('error-handling');

export default async (err: any, ctx: Context) => {
  if ((err as z.ZodError).issues !== undefined) {
    const problemDetail = generateValidationProblemDetail(err, undefined, undefined, ctx.req.url);
    ctx.status = problemDetail.status || 400;
    ctx.body = problemDetail;
    return;
  }

  // generic Error handling
  const statusCode = 500;
  let errorMsg = err.message || 'Internal Server Error';
  logger.error(err, 'route error');

  const problemDetail = generateProblemDetails(statusCode, undefined, errorMsg, ctx.req.url);
  ctx.status = statusCode;
  ctx.body = problemDetail;
};
