'use client';

import { Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/atoms';
import { GhibliCard } from '@/components/molecules/ghibli-card';
import { GhibliTabs } from '@/components/molecules/ghibli-tabs';
import { TodoCheckbox } from '@/components/molecules/todo-checkbox';
import { GhibliEmptyState } from '@/components/template/ghibli-empty-state';
import { useDeleteTodo, useTodos, useUpdateTodo } from '@/hooks/useApi/todo';
import { useGsapStagger } from '@/hooks/useGsapStagger';

type TabValue = 'all' | 'pending' | 'completed';

export function TodoListSection() {
  const [tab, setTab] = useState<TabValue>('all');
  const query = tab === 'all' ? undefined : { status: tab as 'pending' | 'completed' };
  const { data: todos = [], isLoading } = useTodos(query);
  const updateTodo = useUpdateTodo(query);
  const deleteTodo = useDeleteTodo(query);
  const listRef = useGsapStagger<HTMLUListElement>([todos.length, tab]);

  const tabs = useMemo(
    () => [
      { value: 'all' as const, label: 'Semua' },
      { value: 'pending' as const, label: 'Belum Selesai' },
      { value: 'completed' as const, label: 'Selesai' },
    ],
    [],
  );

  return (
    <GhibliCard>
      <GhibliTabs tabs={tabs} value={tab} onChange={setTab} />

      {isLoading ? (
        <div className="mt-4 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : todos.length === 0 ? (
        <GhibliEmptyState
          emoji="✨"
          title={tab === 'completed' ? 'Belum ada tugas selesai' : 'Daftar tugas masih kosong'}
          description="Susuwatari sedang tidur — tambahkan tugas pertamamu!"
        />
      ) : (
        <ul ref={listRef} className="mt-4 space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              data-stagger-item
              className="flex items-center gap-3 rounded-xl bg-background/50 px-3 py-3"
            >
              <TodoCheckbox
                checked={todo.status === 'completed'}
                disabled={updateTodo.isPending}
                onChange={(checked) =>
                  updateTodo.mutate({
                    id: todo.id,
                    payload: { status: checked ? 'completed' : 'pending' },
                    filters: query,
                  })
                }
              />
              <span
                className={
                  todo.status === 'completed'
                    ? 'flex-1 text-sm text-muted-foreground line-through'
                    : 'flex-1 text-sm'
                }
              >
                {todo.text}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive"
                onClick={() => deleteTodo.mutate({ id: todo.id, filters: query })}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </GhibliCard>
  );
}
