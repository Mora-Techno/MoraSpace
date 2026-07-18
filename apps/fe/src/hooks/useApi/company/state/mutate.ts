import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@repo/types";
import { CompanyProfile, PickRegisterCompany } from "@repo/types/company.types";
import { useMutation } from "@tanstack/react-query";
import Api from "@/services/api";
import {
  companyRooyKey,
  CompanyCacheContext,
  readCompanySnapshot,
} from "./utils";
import { departmentRootKey } from "../../department/state/utils";

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
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: departmentRootKey,
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
