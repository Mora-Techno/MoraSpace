import type {
  AdminUser,
  CompanyProfile,
  PickCreateAdmin,
  PickRegisterCompany,
  PickUpdateCompanyProfile,
  PickUpdateCompanySubscription,
} from "@repo/types/company.types";

import { useAppMutation } from "@/hooks/useAppMutation";
import { saveTokens } from "@/server/auth-cookie";
import Api from "@/services/api";
import { persistAuthSessionFromResponse } from "@/utils/storage";
import {
  type CompanyCacheContext,
  companyRooyKey,
  readCompanySnapshot,
} from "./utils";

export function useRegisterCompany() {
  return useAppMutation<
    CompanyProfile,
    PickRegisterCompany,
    CompanyCacheContext
  >({
    mutationFn: (payload) => Api.Company.RegisterCompany(payload),
    invalidateKeys: [companyRooyKey],
    optimistic: (ns) => ({ previousData: readCompanySnapshot(ns) }),
    onSuccess: async (res, _vars, _ctx, ns) => {
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
        } catch {}
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
    showSuccessToast: false,
  });
}

export function useCreateAdmin() {
  return useAppMutation<AdminUser, PickCreateAdmin, CompanyCacheContext>({
    mutationFn: (payload) => Api.Company.CreateAdmin(payload),
    invalidateKeys: [companyRooyKey],
    optimistic: (ns) => ({ previousData: readCompanySnapshot(ns) }),
  });
}

export function useDeleteAdmin() {
  return useAppMutation<AdminUser, { id: string }, CompanyCacheContext>({
    mutationFn: ({ id }) => Api.Company.DeleteAdmin(id),
    invalidateKeys: [companyRooyKey],
    optimistic: (ns) => ({ previousData: readCompanySnapshot(ns) }),
  });
}

export function useUpdateCompanySubscription() {
  return useAppMutation<
    CompanyProfile,
    PickUpdateCompanySubscription,
    CompanyCacheContext
  >({
    mutationFn: (payload) => Api.Company.UpdateCompanySubscription(payload),
    invalidateKeys: [companyRooyKey],
    optimistic: (ns) => ({ previousData: readCompanySnapshot(ns) }),
  });
}

export function useUpdateCompanyProfile() {
  return useAppMutation<
    CompanyProfile,
    PickUpdateCompanyProfile,
    CompanyCacheContext
  >({
    mutationFn: (payload) => Api.Company.UpdateCompanyProfile(payload),
  });
}
