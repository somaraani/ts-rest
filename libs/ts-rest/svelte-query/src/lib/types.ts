import {
  StoreOrVal,
  CreateMutationOptions as TanStackCreateMutationOptions,
  CreateMutationResult as TanStackCreateMutationResult,
  CreateQueryOptions as TanStackCreateQueryOptions,
  CreateQueryResult as TanStackCreateQueryResult,
} from '@tanstack/svelte-query';
import {
  AppRoute,
  ClientArgs,
  ClientInferResponses,
  ErrorHttpStatusCode,
  PartialClientInferRequest,
  SuccessfulHttpStatusCode,
} from '@ts-rest/core';
import { InitClientReturn } from './svelte-query';

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

export type CreateQueryOptions<TAppRoute extends AppRoute> = StoreOrVal<
  Omit<
    TanStackCreateQueryOptions<
      DataResponse<TAppRoute>,
      ErrorResponse<TAppRoute>
    >,
    'queryKey' // we don't want to require queryKey in options, but tanstack has it as required
  > & { initialData?: ClientInferResponses<TAppRoute> }
>;

export type CreateQueryResult<TAppRoute extends AppRoute> =
  TanStackCreateQueryResult<DataResponse<TAppRoute>, ErrorResponse<TAppRoute>>;

type InferClientArgs<TClient extends InitClientReturn<any, any>> =
  TClient extends InitClientReturn<any, infer TClientArgs>
    ? TClientArgs
    : never;

export type CreateMutationOptions<
  TAppRoute extends AppRoute,
  TClientArgsOrClient extends ClientArgs | InitClientReturn<any, any>,
> = TanStackCreateMutationOptions<
  DataResponse<TAppRoute>,
  ErrorResponse<TAppRoute>,
  TClientArgsOrClient extends ClientArgs
    ? PartialClientInferRequest<TAppRoute, TClientArgsOrClient>
    : TClientArgsOrClient extends InitClientReturn<any, any>
    ? PartialClientInferRequest<TAppRoute, InferClientArgs<TClientArgsOrClient>>
    : never
>;

export type CreateMutationResult<
  TAppRoute extends AppRoute,
  TClientArgsOrClient extends ClientArgs | InitClientReturn<any, any>,
> = TanStackCreateMutationResult<
  DataResponse<TAppRoute>,
  ErrorResponse<TAppRoute>,
  TClientArgsOrClient extends ClientArgs
    ? PartialClientInferRequest<TAppRoute, TClientArgsOrClient>
    : TClientArgsOrClient extends InitClientReturn<any, any>
    ? PartialClientInferRequest<TAppRoute, InferClientArgs<TClientArgsOrClient>>
    : never
>;
