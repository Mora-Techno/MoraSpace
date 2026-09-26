import type { TResponse } from "../types/response.types";
import {
  type QueryKey,
  type UseMutationOptions,
  type UseMutationResult,
  useMutation,
} from "@tanstack/react-query";

export type BaseAppNameSpace = {
  queryClient: {
    cancelQueries: (filters: { queryKey: QueryKey }) => Promise<void>;
    invalidateQueries: (filters: { queryKey: QueryKey }) => Promise<void>;
    getQueryData: <TData>(queryKey: QueryKey) => TData | undefined;
    setQueryData: <TData>(queryKey: QueryKey, updater: TData | undefined) => unknown;
  };
  alert?: {
    toast?: (params: {
      title: string;
      message: string;
      icon?: "success" | "error" | "info" | "warning";
      onVoid?: () => void;
    }) => void;
  };
  router?: {
    push?: (url: any) => void;
    replace?: (url: any) => void;
  };
};

export interface AppMutationConfig<
  TData,
  TVariables = void,
  TContext = unknown,
  TNamespace extends BaseAppNameSpace = BaseAppNameSpace,
> {
  mutationFn: (variables: TVariables) => Promise<TResponse<TData>>;
  invalidateKeys?:
    | QueryKey[]
    | ((
        data: TResponse<TData>,
        variables: TVariables,
        context: TContext | undefined,
      ) => QueryKey[]);
  optimistic?: (
    ns: TNamespace,
    variables: TVariables,
  ) => Promise<TContext> | TContext;
  onSuccess?: (
    data: TResponse<TData>,
    variables: TVariables,
    context: TContext | undefined,
    ns: TNamespace,
  ) => Promise<unknown> | unknown;
  onError?: (
    error: Error,
    variables: TVariables,
    context: TContext | undefined,
    ns: TNamespace,
  ) => Promise<unknown> | unknown;
  onSettled?: (
    data: TResponse<TData> | undefined,
    error: Error | null,
    variables: TVariables,
    context: TContext | undefined,
    ns: TNamespace,
  ) => Promise<unknown> | unknown;
  showSuccessToast?: boolean;
  errorTitle?: string;
  options?: Omit<
    UseMutationOptions<TResponse<TData>, Error, TVariables, TContext>,
    "mutationFn" | "onMutate" | "onSuccess" | "onError" | "onSettled"
  >;
}

/**
 * createAppMutationHook — Higher-order factory hook generator
 * Memungkinkan frontend (web) maupun mobile menyuplai hook `useAppNameSpace` lokal masing-masing
 * tanpa coupling ke framework-specific router / alert implementations.
 */
export function createAppMutationHook<TNamespace extends BaseAppNameSpace>(
  useNamespaceHook: () => TNamespace,
) {
  return function useAppMutation<TData, TVariables = void, TContext = unknown>(
    config: AppMutationConfig<TData, TVariables, TContext, TNamespace>,
  ): UseMutationResult<TResponse<TData>, Error, TVariables, TContext> {
    const ns = useNamespaceHook();
    const showSuccessToast = config.showSuccessToast ?? true;

    return useMutation<TResponse<TData>, Error, TVariables, TContext>({
      ...config.options,
      mutationFn: config.mutationFn,
      onMutate: async (variables) => {
        if (config.invalidateKeys) {
          const keys =
            typeof config.invalidateKeys === "function"
              ? []
              : config.invalidateKeys;
          for (const key of keys) {
            await ns.queryClient.cancelQueries({ queryKey: key });
          }
        }
        if (config.optimistic) {
          return await config.optimistic(ns, variables);
        }
        return undefined as unknown as TContext;
      },
      onSuccess: async (data, variables, context) => {
        if (showSuccessToast && data?.message && ns.alert?.toast) {
          ns.alert.toast({
            title: (data as { title?: string }).title ?? data.message,
            message: data.message,
            icon: "success",
          });
        }
        if (config.onSuccess) {
          await config.onSuccess(data, variables, context, ns);
        }
      },
      onError: async (error, variables, context) => {
        if (config.onError) {
          await config.onError(error, variables, context, ns);
        } else if (ns.alert?.toast) {
          ns.alert.toast({
            title: config.errorTitle ?? "Error",
            message: error.message,
            icon: "error",
          });
        }
      },
      onSettled: async (data, error, variables, context) => {
        if (config.invalidateKeys) {
          const keys =
            typeof config.invalidateKeys === "function"
              ? data
                ? config.invalidateKeys(data, variables, context)
                : []
              : config.invalidateKeys;
          for (const key of keys) {
            await ns.queryClient.invalidateQueries({ queryKey: key });
          }
        }
        if (config.onSettled) {
          await config.onSettled(data, error, variables, context, ns);
        }
      },
    });
  };
}
