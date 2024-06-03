import {
  StoreOrVal,
  CreateQueryOptions as TanStackCreateQueryOptions,
  CreateQueryResult as TanStackCreateQueryResult,
} from '@tanstack/svelte-query';
import {
  AppRoute,
  ClientInferResponses,
  ErrorHttpStatusCode,
  SuccessfulHttpStatusCode,
} from '@ts-rest/core';

// Data response if it's a 2XX
export type DataResponse<TAppRoute extends AppRoute> = ClientInferResponses<
  TAppRoute,
  SuccessfulHttpStatusCode,
  'force'
>;

// Error response if it's not a 2XX
export type ErrorResponse<TAppRoute extends AppRoute> = ClientInferResponses<
  TAppRoute,
  ErrorHttpStatusCode,
  'ignore'
>;

// TODO get initial data type correct
export type CreateQueryOptions<TAppRoute extends AppRoute> = StoreOrVal<
  TanStackCreateQueryOptions<
    TAppRoute['responses'],
    ErrorResponse<TAppRoute>,
    DataResponse<TAppRoute>
  > & { initialData?: any }
>;

export type CreateQueryResult<TAppRoute extends AppRoute> =
  TanStackCreateQueryResult<DataResponse<TAppRoute>, ErrorResponse<TAppRoute>>;
