import { QueryKey } from '@tanstack/svelte-query';
import {
  AppRoute,
  AppRouteMutation,
  AppRouteQuery,
  AreAllPropertiesOptional,
  ClientArgs,
  PartialClientInferRequest,
} from '@ts-rest/core';
import {
  CreateMutationOptions,
  CreateMutationResult,
  CreateQueryOptions,
  CreateQueryResult,
} from './types';

export type AppRouteFunctions<
  TAppRoute extends AppRoute,
  TClientArgs extends ClientArgs,
> = {
  createQuery: TAppRoute extends AppRouteQuery
    ? DataReturnQuery<TAppRoute, TClientArgs>
    : never;
  createMutation: TAppRoute extends AppRouteMutation
    ? DataReturnMutation<TAppRoute, TClientArgs>
    : never;
};

// Used on X.createQuery
export type DataReturnQuery<
  TAppRoute extends AppRoute,
  TClientArgs extends ClientArgs,
  TArgs = PartialClientInferRequest<TAppRoute, TClientArgs>,
> = AreAllPropertiesOptional<TArgs> extends true
  ? (
      queryKey: QueryKey,
      args?: TArgs,
      options?: CreateQueryOptions<TAppRoute>,
    ) => CreateQueryResult<TAppRoute>
  : (
      queryKey: QueryKey,
      args: TArgs,
      options?: CreateQueryOptions<TAppRoute>,
    ) => CreateQueryResult<TAppRoute>;

// Used on X.createMutation
export type DataReturnMutation<
  TAppRoute extends AppRoute,
  TClientArgs extends ClientArgs,
> = (
  options?: CreateMutationOptions<TAppRoute, TClientArgs>,
) => CreateMutationResult<TAppRoute, TClientArgs>;
