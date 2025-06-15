import pino from 'pino';
import z from 'zod/v4';

process.env.NODE_ENV ??= 'production';

const PinoLevel = z.custom<pino.Level>((val) => {
  if (typeof val !== 'string') {
    return false;
  }
  return ['fatal', 'error', 'warn', 'info', 'debug', 'trace'].indexOf(val) !== -1;
});

const Settings = z
  .object({
    LOG_LEVEL: PinoLevel.optional().default('info'),
    SERVER_PORT: z.number().optional().default(9000),
    POSTGRES_CONN_STR: z.string().optional().default('postgresql://postgres:mypassword@localhost:5432/postgres'),
  })
  .readonly();

const settings = Settings.safeParse({
  LOG_LEVEL: process.env.LOG_LEVEL,
  SERVER_PORT: process.env.SERVER_PORT,
  POSTGRES_CONN_STR: process.env.POSTGRES_CONN_STR,
});

if (!settings.success) {
  console.error('invalid app settings', settings.error);
  process.exit(1);
}

export default settings.data;
