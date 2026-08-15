"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import CompanyPositionSection from "@/components/page/private/owner/dashboard/company/position/CompanyPositionSection";

export default function CompanyPositionContainer() {
  const api = useApi();
  const ns = useAppNameSpace();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const debounceSearch = useDebounce(searchTerm, 500);

  const { data: positions = [], isLoading } = api.position.query.list();

  // Example usage assuming create/delete position mutate exists in position API.
  const createPosition = api.position.mutate.create();
  const deletePosition = api.position.mutate.delete();

  const [open, setOpen] = useState<boolean>(false);
  const [formCreate, setFormCreate] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPosition.mutate(formCreate, {
      onSuccess: () => {
        setOpen(false);
        setFormCreate({ name: "", description: "" });
      },
    });
  };

  const handleDelete = (id: string) => {
    if (!id) return;
    deletePosition.mutate({ id });
  };

  return (
    <CompanyPositionSection
      service={{
        handleSubmit,
        isPending: createPosition.isPending || deletePosition.isPending,
        handleDelete,
        positions: positions.filter((p: any) =>
          p.name.toLowerCase().includes(debounceSearch.toLowerCase()),
        ),
        isLoading,
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
