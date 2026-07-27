import Link from "next/link";
import { PageHeader } from "@/components/molecules/page-header";
import { QuickAddFab } from "@/components/molecules/quick-add.fab";
import { TodayTodosWidget } from "@/components/page/private/member/dashboard/today-todos.widget";
import { UpcomingEventsWidget } from "@/components/page/private/member/dashboard/upcoming-events.widget";
import {
  PickCreateNote,
  PickCreateTodo,
  PickRegisterCompany,
} from "@repo/types";
import React from "react";
import { modeQuick } from "@/app/(private)/member/dashboard/_containers/dashboard";

interface DashboardMemberSectionProps {
  template: {
    title: string;
    message: string;
    gridRef: any;
  };
  state: {
    formCreateTodo: PickCreateTodo;
    setFormCreateTodo: React.Dispatch<React.SetStateAction<PickCreateTodo>>;
    formCreateNote: PickCreateNote;
    setFormCreateNote: React.Dispatch<React.SetStateAction<PickCreateNote>>;
    formCreateCompany: PickRegisterCompany;
    setFormCreateCompany: React.Dispatch<
      React.SetStateAction<PickRegisterCompany>
    >;
    mode: modeQuick;
    setMode: React.Dispatch<React.SetStateAction<modeQuick>>;
    showPasswordCompany: boolean;
    setShowPasswordCompany: React.Dispatch<React.SetStateAction<boolean>>;
  };
  service: {
    handleSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
  };
}
const DashboardMemberSection: React.FC<DashboardMemberSectionProps> = ({
  template,
  state,
  service,
}) => {
  const gridRef = template.gridRef;
  const {
    formCreateNote,
    formCreateTodo,
    setFormCreateNote,
    setFormCreateTodo,
    mode,
    setMode,
    setShowPasswordCompany,
    showPasswordCompany,
    formCreateCompany,
    setFormCreateCompany,
  } = state;
  const { handleSubmit, isPending } = service;
  return (
    <section className="w-full min-h-screen ">
      <div className="animate-in fadei-n duration-700">
        <PageHeader
          title="Dashboard"
          description="Ringkasan produktivitasmu hari ini — seperti pagi di pedesaan Ghibli."
          action={
            <QuickAddFab
              formCreateNote={formCreateNote}
              formCreateTodo={formCreateTodo}
              setFormCreateNote={setFormCreateNote}
              setFormCreateTodo={setFormCreateTodo}
              mode={mode}
              setMode={setMode}
              handleSubmit={handleSubmit}
              isPending={isPending}
              formCreateCompany={formCreateCompany}
              setFormCreateCompany={setFormCreateCompany}
              setShowPasswordCompany={setShowPasswordCompany}
              showPasswordCompany={showPasswordCompany}
            />
          }
        />

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <div className="md:col-span-1 lg:col-span-1" data-stagger-item>
            <TodayTodosWidget />
          </div>
          <div className="md:col-span-1 lg:col-span-1" data-stagger-item>
            <UpcomingEventsWidget />
          </div>
          <div
            className="ghibli-glass flex flex-col justify-center gap-3 p-6 md:col-span-2 lg:col-span-1"
            data-stagger-item
          >
            <span className="text-3xl">🎵</span>
            <h3 className="font-serif text-lg font-semibold">Mode Fokus</h3>
            <p className="text-sm text-muted-foreground">
              Putar musik Joe Hisaishi dan mulai sesi kerja yang tenang.
            </p>
            <Link
              href="/music"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Buka halaman Musik →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardMemberSection;
