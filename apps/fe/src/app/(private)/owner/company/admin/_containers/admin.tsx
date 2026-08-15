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
  const updateMember = api.member.mutate.update();

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

  const handleUpdateStatus = (id: string, status: string) => {
    if (!id) return;
    updateMember.mutate({ id, payload: { status } as any });
  };

  return (
    <CompanyAdminSection
      service={{
        handleSubmit,
        isPending:
          useCreateAdmin.isPending ||
          userDeleteAdmin.isPending ||
          updateMember.isPending,
        handleDelete: handleDeleteAdmin,
        handleUpdateStatus,
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
