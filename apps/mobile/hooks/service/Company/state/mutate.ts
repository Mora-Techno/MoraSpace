import type {
  AdminUser,
  CompanyProfile,
  PickCreateAdmin,
  PickRegisterCompany,
  PickUpdateCompanyProfile,
  PickUpdateCompanySubscription,
} from "@repo/types/company.types";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/service/props.service";
import {
  type CompanyCacheContext,
  companyRootKey,
  readCompanySnapshot,
} from "./utils";

export function useRegisterCompany() {
  return useAppMutation<
    CompanyProfile,
    PickRegisterCompany,
    CompanyCacheContext
  >({
    mutationFn: (payload) => Api.Company.RegisterCompany(payload),
    invalidateKeys: [companyRootKey],
    optimistic: (ns) => ({ previousData: readCompanySnapshot(ns) }),
  });
}

export function useCreateAdmin() {
  return useAppMutation<AdminUser, PickCreateAdmin, CompanyCacheContext>({
    mutationFn: (payload) => Api.Company.CreateAdmin(payload),
    invalidateKeys: [companyRootKey],
    optimistic: (ns) => ({ previousData: readCompanySnapshot(ns) }),
  });
}

export function useDeleteAdmin() {
  return useAppMutation<AdminUser, { id: string }, CompanyCacheContext>({
    mutationFn: ({ id }) => Api.Company.DeleteAdmin(id),
    invalidateKeys: [companyRootKey],
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
    invalidateKeys: [companyRootKey],
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
