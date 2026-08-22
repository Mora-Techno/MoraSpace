"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import CompanyPermissionSection from "@/components/page/private/owner/dashboard/company/permission/CompanyPermissionSection";

export default function CompanyPermissionContainer() {
  const api = useApi();
  const ns = useAppNameSpace();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const debounceSearch = useDebounce(searchTerm, 500);

  // We map role API as "Permission" management since Roles contain permissions
  const { data: roles = [], isLoading: loadingRoles } = api.role.query.list();

  const createRole = api.role.mutate.create();
  const deleteRole = api.role.mutate.delete();

  const [open, setOpen] = useState<boolean>(false);
  const [formCreate, setFormCreate] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRole.mutate(formCreate, {
      onSuccess: () => {
        setOpen(false);
        setFormCreate({ name: "", description: "" });
      },
    });
  };

  const handleDelete = (id: string) => {
    if (!id) return;
    deleteRole.mutate({ id });
  };

  return (
    <CompanyPermissionSection
      service={{
        handleSubmit,
        isPending: createRole.isPending || deleteRole.isPending,
        handleDelete,
        roles: roles.filter((r: any) =>
          r.name.toLowerCase().includes(debounceSearch.toLowerCase()),
        ),
        isLoading: loadingRoles,
      }}
      state={{
        alert: ns.alert,
        formCreate,
        open,
        setFormCreate,
        setOpen,
        searchTerm,
        setSearchTerm,
      }}
    />
  );
}
