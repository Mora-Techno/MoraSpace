import type { AdminUser } from '@repo';
import { Trash2, UserCheck, UserX } from 'lucide-react';

import { Button } from '@/components/atoms';
import type { AlertContexType } from '@/types/ui';
import { getInitials } from '@/utils/string.format';

interface AdminRowProps {
  admin?: AdminUser & { status?: string }; // Extends for status
  alert?: AlertContexType;
  onDelete?: (id: string) => void;
  onUpdateStatus?: (status: string) => void;
  isPending?: boolean;
}

export function AdminRow({ admin, alert, onDelete, onUpdateStatus, isPending }: AdminRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md p-4 transition-all hover:border-border/80">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
        {admin ? getInitials(admin.fullName) : ''}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {admin?.fullName ?? 'Nama Admin'}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {admin?.email ?? 'admin@company.com'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {onUpdateStatus && (
          <Button
            variant="ghost"
            size="icon"
            disabled={isPending}
            onClick={() =>
              alert?.modal({
                title: admin?.status === 'active' ? 'Nonaktifkan ?' : 'Aktifkan ?',
                deskripsi: `Apakah Anda yakin ingin ${
                  admin?.status === 'active' ? 'menonaktifkan' : 'mengaktifkan'
                } admin ini?`,
                icon: 'warning',
                onConfirm: () => {
                  onUpdateStatus(admin?.status === 'active' ? 'inactive' : 'active');
                },
              })
            }
          >
            {admin?.status === 'active' ? (
              <UserX className="size-4 text-destructive" />
            ) : (
              <UserCheck className="size-4 text-success" />
            )}
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          onClick={() =>
            alert?.modal({
              title: 'Hapus ?',
              deskripsi: 'Apakah Anda Yakin Menghapus Admin ini',
              icon: 'warning',
              onConfirm: () => {
                if (onDelete && admin?.id) {
                  onDelete(admin.id);
                }
              },
            })
          }
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
