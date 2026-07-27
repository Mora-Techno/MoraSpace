"use client";
import { useGsapStagger } from "@/hooks/useGsapStagger";
import DashboardMemberSection from "@/components/page/private/member/dashboard/dashboard-section";
import { useState } from "react";
import {
  PickCreateNote,
  PickCreateTodo,
  PickRegisterCompany,
} from "@repo/types";
import { useApi } from "@/hooks/useApi/useApi";

export type modeQuick = "todo" | "note" | "company";
export default function DashboardContainer() {
  const gridRef = useGsapStagger<HTMLDivElement>([]);
  const api = useApi();

  const [mode, setMode] = useState<modeQuick>("company");
  const [formCreateTodo, setFormCreateTodo] = useState<PickCreateTodo>({
    text: "",
    dueDate: "",
  });
  const [formCreateNote, setFormCreateNote] = useState<PickCreateNote>({
    content: "",
    title: "",
  });
  const [formCreateCompany, setFormCreateCompany] =
    useState<PickRegisterCompany>({
      companyName: "",
      email: "",
      fullName: "",
      password: "",
      tier: "free",
    });

  const useCreateTodo = api.todo.mutate.create();
  const useCreateNote = api.note.mutate.create();
  const useRegisterCompany = api.company.mutate.registerCompany();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "todo" && formCreateTodo.text.trim()) {
      useCreateTodo.mutate({ text: formCreateTodo.text.trim() });
      return;
    }
    if (
      mode === "note" &&
      formCreateNote.title.trim() &&
      formCreateNote.content.trim()
    ) {
      useCreateNote.mutate({
        title: formCreateNote.title.trim(),
        content: formCreateNote.content.trim(),
      });
    }
    if (
      mode === "company" &&
      formCreateCompany.companyName.trim() &&
      formCreateCompany.email.trim() &&
      formCreateCompany.fullName.trim() &&
      formCreateCompany.password.trim()
    ) {
      useRegisterCompany.mutate(formCreateCompany);
    }
  };

  const [showPasswordCompany, setShowPasswordCompany] =
    useState<boolean>(false);

  return (
    <DashboardMemberSection
      template={{
        gridRef: gridRef,
        message: "",
        title: "",
      }}
      state={{
        formCreateNote: formCreateNote,
        formCreateTodo: formCreateTodo,
        setFormCreateNote: setFormCreateNote,
        setFormCreateTodo: setFormCreateTodo,
        mode: mode,
        setMode: setMode,
        formCreateCompany: formCreateCompany,
        setFormCreateCompany: setFormCreateCompany,
        setShowPasswordCompany: setShowPasswordCompany,
        showPasswordCompany: showPasswordCompany,
      }}
      service={{
        isPending: useCreateNote.isPending || useCreateTodo.isPending,
        handleSubmit: handleSubmit,
      }}
    />
  );
}
