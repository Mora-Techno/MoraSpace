"use client";

import "@aejkatappaja/phantom-ui";
import { useState } from "react";
import { useApi } from "@/hooks/useApi/useApi";
import type { PickCreateAdmin } from "@repo/types/company.types";
import CompanyAdminSection from "@/components/page/private/owner/dashboard/company/admin/CompanyAdminSection";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

export default function CompanyAdminContainer() {
  const api = useApi();
  const ns = useAppNameSpace();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const debounceSearch = useDebounce(searchTerm, 500);

  const { data: admins = [], isLoading } = api.company.query.listAdmins({
    search: debounceSearch,
  });
  const useCreateAdmin = api.company.mutate.createAdmin();
  const userDeleteAdmin = api.company.mutate.deleteAdmin();

  const [open, setOpen] = useState<boolean>(false);
  const [formCreateAdmin, setFormCreateAdmin] = useState<PickCreateAdmin>({
    email: "",
    fullName: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    useCreateAdmin.mutate(formCreateAdmin, {
      onSuccess: () => {
        setOpen(false);
        setFormCreateAdmin((prev) => ({
          ...prev,
          email: "",
          fullName: "",
          password: "",
        }));
      },
    });
  };

  const handleDeleteAdmin = (id: string) => {
    if (!id) return;
    userDeleteAdmin.mutate({ id });
  };

  return (
    <CompanyAdminSection
      service={{
        handleSubmit,
        isPending: useCreateAdmin.isPending || userDeleteAdmin.isPending,
        handleDelete: handleDeleteAdmin,
        admins,
        isLoading,
      }}
      state={{
        alert: ns.alert,
        formCreateAdmin,
        open,
        setFormCreateAdmin,
        setOpen,
        searchTerm,
        setSearchTerm,
      }}
    />
  );
}
