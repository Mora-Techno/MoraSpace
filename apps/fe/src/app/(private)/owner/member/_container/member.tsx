"use client";

import OwnerCompanyMemberSection from "@/components/page/private/owner/dashboard/company/member/CompanyMemberSection";
import { useApi } from "@/hooks/useApi/useApi";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

const OwnerCompanyMemberContainer = () => {
  const api = useApi();
  const ns = useAppNameSpace();
  const title = "Kelola Anggota";
  const desc = "Kelola anggota dari perusahaan Anda";

  const [open, setOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const debounceSearch = useDebounce(searchTerm, 500);

  const { data: members = [], isLoading } = api.member.query.list();
  const updateMember = api.member.mutate.update();
  const deleteMember = api.member.mutate.delete();

  const handleUpdateStatus = (id: string, status: string) => {
    updateMember.mutate({ id, payload: { status } as any });
  };

  const handleDeleteMember = (id: string) => {
    deleteMember.mutate({ id });
  };

  return (
    <OwnerCompanyMemberSection
      template={{
        description: desc,
        title: title,
      }}
      service={
        {
          member: members,
          isLoading,
          isPending: updateMember.isPending || deleteMember.isPending,
          handleUpdateStatus,
          handleDeleteMember,
        } as any
      }
      state={{
        alert: ns.alert,
        open,
        setOpen,
        searchTerm,
        setSearchTerm,
      }}
    />
  );
};

export default OwnerCompanyMemberContainer;
