import type pg from 'pg';
import Koa, { type ParameterizedContext } from 'koa';

export interface AppState {}

export interface AppContext {
  pgPool: pg.Pool;
}

// @ts-ignore
export interface RouteContext extends ParameterizedContext<AppState, AppContext> {
  state: AppState;
  app: Koa<AppState, AppContext>;
}
