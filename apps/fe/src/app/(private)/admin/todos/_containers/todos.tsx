'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/atoms';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/atoms/sheet';
import { PageHeader } from '@/components/molecules/page-header';
import { useIsMobile } from '@/hooks/use-mobile';

import { TodoFormSection } from '../_sections/todo-form.section';
import { TodoListSection } from '../_sections/todo-list.section';

export default function TodosContainer() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title="Todos"
        description="Kelola tugas harianmu dengan tenang, satu per satu."
        action={
          isMobile ? (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button size="icon" className="ghibli-btn rounded-full">
                  <Plus className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl">
                <SheetHeader>
                  <SheetTitle className="font-serif">Tugas Baru</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-6">
                  <TodoFormSection />
                </div>
              </SheetContent>
            </Sheet>
          ) : null
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodoListSection />
        </div>
        {!isMobile && (
          <div className="hidden lg:block">
            <TodoFormSection />
          </div>
        )}
      </div>
    </div>
  );
}
