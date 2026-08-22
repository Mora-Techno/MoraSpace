"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import CompanyTeamSection from "@/components/page/private/owner/dashboard/company/team/CompanyTeamSection";
import { PickCreateTeam } from "@repo";

export default function CompanyTeamContainer() {
  const api = useApi();
  const ns = useAppNameSpace();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debounceSearch = useDebounce(searchTerm, 500);
  const { data: teams = [], isLoading } = api.team.query.list();

  // get data depertement

  const createTeam = api.team.mutate.create();
  const deleteTeam = api.team.mutate.delete();

  const [open, setOpen] = useState<boolean>(false);

  const [formCreate, setFormCreate] = useState<PickCreateTeam>({
    name: "",
    description: "",
    leaderId: "",
    departmentId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTeam.mutate(formCreate, {
      onSuccess: () => {
        setOpen(false);
        setFormCreate({ name: "", departmentId: "" });
      },
    });
  };

  const handleDelete = (id: string) => {
    if (!id) return;
    deleteTeam.mutate({ id });
  };

  return (
    <CompanyTeamSection
      service={{
        handleSubmit,
        isPending: createTeam.isPending || deleteTeam.isPending,
        handleDelete,
        teams: teams.filter((t: any) =>
          t.name.toLowerCase().includes(debounceSearch.toLowerCase()),
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
