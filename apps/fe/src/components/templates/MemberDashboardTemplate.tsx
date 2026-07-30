import * as React from "react";
import type { ReactNode } from "react";
import { useGsapStagger } from "@/hooks/useGsapStagger";

interface MemberDashboardTemplateProps {
  dailyGreeting: ReactNode;
  pomodoro: ReactNode;
  todoList: ReactNode;
  agenda: ReactNode;
  music: ReactNode;
  quickNotes: ReactNode;
}

export function MemberDashboardTemplate({
  dailyGreeting,
  pomodoro,
  todoList,
  agenda,
  music,
  quickNotes,
}: MemberDashboardTemplateProps) {
  const gridRef = useGsapStagger<HTMLDivElement>([]);

  return (
    <section className="w-full min-h-screen pb-12">
      <div
        ref={gridRef}
        className="mx-auto grid max-w-full grid-cols-1 gap-4 lg:grid-cols-12 md:max-w-full"
      >
        <div className="lg:col-span-12" data-stagger-item>
          {dailyGreeting}
        </div>

        <div className="lg:col-span-7 flex flex-col gap-4">
          <div data-stagger-item>{pomodoro}</div>
          <div data-stagger-item className="flex-1">
            {todoList}
          </div>
        </div>

        <div className="lg:col-span-5" data-stagger-item>
          {agenda}
        </div>

        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div data-stagger-item>{music}</div>
          <div data-stagger-item>{quickNotes}</div>
        </div>
      </div>
    </section>
  );
}
