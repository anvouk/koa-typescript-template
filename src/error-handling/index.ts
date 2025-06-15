import type { Context } from 'koa';
import { createSubLogger } from '../logger.ts';
import {
  generateProblemDetails,
  generateValidationProblemDetail,
  generateZodValidationProblemDetail,
} from './problem-details.ts';
import z from 'zod/v4';

const logger = createSubLogger('error-handling');

async function errorHandling(err: any, ctx: Context) {
  // generated on invalid payload format received
  if (err instanceof SyntaxError) {
    const problemDetail = generateValidationProblemDetail(err, undefined, undefined, ctx.req.url);
    ctx.status = problemDetail.status || 422;
    ctx.body = problemDetail;
    return;
  }
  // generated zod validation error
  if ((err as z.ZodError).issues !== undefined) {
    const problemDetail = generateZodValidationProblemDetail(err, undefined, undefined, ctx.req.url);
    ctx.status = problemDetail.status || 422;
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
}

export default errorHandling;
