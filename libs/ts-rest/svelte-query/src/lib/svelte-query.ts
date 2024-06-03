import {
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
  CreateMutationOptions as TanStackCreateMutationOptions,
  CreateQueryOptions as TanStackCreateQueryOptions,
  createMutation,
  createQuery,
} from '@tanstack/svelte-query';
import {
  AppRoute,
  AppRouteMutation,
  AppRouter,
  ClientArgs,
  ClientInferRequest,
  Without,
  ZodInferOrType,
  evaluateFetchApiArgs,
  fetchApi,
  isAppRoute,
} from '@ts-rest/core';
import { AppRouteFunctions } from './inner-types';

const queryFn = <TAppRoute extends AppRoute, TClientArgs extends ClientArgs>(
  route: TAppRoute,
  clientArgs: TClientArgs,
  args?: ClientInferRequest<AppRouteMutation, ClientArgs>,
): QueryFunction<TAppRoute['responses']> => {
  return async (queryFnContext?: QueryFunctionContext) => {
    const fetchApiArgs = evaluateFetchApiArgs(route, clientArgs, args);
    const result = await fetchApi({
      ...fetchApiArgs,
      fetchOptions: {
        ...(queryFnContext?.signal && { signal: queryFnContext.signal }),
        ...fetchApiArgs.fetchOptions,
      },
    });

    // If the response is not a 2XX, throw an error to be handled by svelte-query
    if (!String(result.status).startsWith('2')) {
      throw result;
    }

    return result;
  };
};

export type InitClientReturn<
  T extends AppRouter,
  TClientArgs extends ClientArgs,
> = {
  [TKey in keyof T]: T[TKey] extends AppRoute
    ? Without<AppRouteFunctions<T[TKey], TClientArgs>, never>
    : T[TKey] extends AppRouter
    ? InitClientReturn<T[TKey], TClientArgs>
    : never;
};

const ClientParameters = Symbol('ClientParameters');

export const initQueryClient = <
  T extends AppRouter,
  TClientArgs extends ClientArgs,
>(
  router: T,
  clientArgs: TClientArgs,
): InitClientReturn<T, TClientArgs> => {
  const recursiveInit = <TInner extends AppRouter>(
    innerRouter: TInner,
  ): InitClientReturn<TInner, TClientArgs> => {
    return Object.fromEntries(
      Object.entries(innerRouter).map(([key, subRouter]) => {
        if (isAppRoute(subRouter)) {
          return [
            key,
            {
              createQuery: getRouteCreateQuery(subRouter, clientArgs),
              createMutation: getRouteCreateMutation(subRouter, clientArgs),
            },
          ];
        } else {
          return [key, recursiveInit(subRouter)];
        }
      }),
    );
  };

  return {
    ...recursiveInit(router),
    [ClientParameters]: {
      router,
      clientArgs,
    },
  };
};

const getRouteCreateQuery = <
  TAppRoute extends AppRoute,
  TClientArgs extends ClientArgs,
>(
  route: TAppRoute,
  clientArgs: TClientArgs,
) => {
  return (
    queryKey: QueryKey,
    args?: ClientInferRequest<AppRouteMutation, ClientArgs>,
    options?: TanStackCreateQueryOptions<TAppRoute['responses']> & {
      initialData: any;
    },
  ) => {
    const dataFn = queryFn(route, clientArgs, args);
    return createQuery({ queryKey, queryFn: dataFn, ...options });
  };
};

const getRouteCreateMutation = <
  TAppRoute extends AppRoute,
  TClientArgs extends ClientArgs,
>(
  route: TAppRoute,
  clientArgs: TClientArgs,
) => {
  return (options?: TanStackCreateMutationOptions<TAppRoute['responses']>) => {
    const mutationFunction = async (
      args?: ClientInferRequest<AppRouteMutation, ClientArgs>,
    ) => {
      const dataFn = queryFn(route, clientArgs, args);
      return dataFn(undefined as any);
    };

    return createMutation({
      mutationFn: mutationFunction as () => Promise<
        ZodInferOrType<TAppRoute['responses']>
      >,
      ...options,
    });
  };
};
