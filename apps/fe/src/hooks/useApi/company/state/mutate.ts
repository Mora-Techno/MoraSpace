import { TResponse } from "@repo/types";
import {
  AdminUser,
  CompanyProfile,
  PickCreateAdmin,
  PickRegisterCompany,
  PickUpdateCompanyProfile,
  PickUpdateCompanySubscription,
} from "@repo/types/company.types";
import { useMutation } from "@tanstack/react-query";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { saveTokens } from "@/server/auth-cookie";
import Api from "@/services/api";
import { persistAuthSessionFromResponse } from "@/utils/storage";
import {
  CompanyCacheContext,
  companyRooyKey,
  readCompanySnapshot,
} from "./utils";

export function useRegisterCompany() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<CompanyProfile>,
    Error,
    PickRegisterCompany,
    CompanyCacheContext
  >({
    mutationFn: (payload) => Api.Company.RegisterCompany(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: companyRooyKey });
      return { previousData: readCompanySnapshot(ns) };
    },
    onSuccess: async (res) => {
      const data = res.data as unknown as Record<string, unknown>;
      const accessToken =
        typeof data.accessToken === "string" ? data.accessToken : undefined;
      const refreshToken =
        typeof data.refreshToken === "string" ? data.refreshToken : undefined;

      if (accessToken && refreshToken) {
        persistAuthSessionFromResponse(data);
        try {
          await saveTokens({
            accessToken,
            refreshToken,
            role: "Owner",
          });
        } catch {
          // best-effort
        }
      }

      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
        onVoid: () => {
          ns.router.push("/addDoc");
        },
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: companyRooyKey,
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useCreateAdmin() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<AdminUser>,
    Error,
    PickCreateAdmin,
    CompanyCacheContext
  >({
    mutationFn: (payload) => Api.Company.CreateAdmin(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: companyRooyKey });
      return { previousData: readCompanySnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: companyRooyKey });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useUpdateCompanySubscription() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<CompanyProfile>,
    Error,
    PickUpdateCompanySubscription,
    CompanyCacheContext
  >({
    mutationFn: (payload) => Api.Company.UpdateCompanySubscription(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: companyRooyKey });
      return { previousData: readCompanySnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: companyRooyKey });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useUpdateCompanyProfile() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<CompanyProfile>,
    Error,
    PickUpdateCompanyProfile,
    CompanyCacheContext
  >({
    mutationFn: (payload) => Api.Company.UpdateCompanyProfile(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

// all
