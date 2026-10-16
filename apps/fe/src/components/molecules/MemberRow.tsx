import type { AdminUser, WorkingStatus } from '@repo/types';
import { Trash2, UserCheck, UserX } from 'lucide-react';

import { Button, WorkingStatusBadge } from '@/components/atoms';
import type { AlertContexType } from '@/types/ui';
import { getInitials } from '@/utils/string.format';

interface MemberRowProps {
  user?: AdminUser & { status?: string };
  alert?: AlertContexType;
  onDelete?: (id: string) => void;
  onUpdateStatus?: (status: string) => void;
  isPending?: boolean;
  workingStatus?: { status: WorkingStatus; statusLabel: string } | null;
}

export function MemberRow({
  user,
  alert,
  onDelete,
  onUpdateStatus,
  isPending,
  workingStatus,
}: MemberRowProps) {
  const status = workingStatus ?? null;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md p-4 transition-all hover:border-border/80">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
        {user ? getInitials(user.fullName) : ''}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {user?.fullName ?? 'Nama user'}
          </p>
          {status && (
            <WorkingStatusBadge status={status.status} statusLabel={status.statusLabel} compact />
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {user?.email ?? 'user@company.com'}
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
                title: user?.status === 'active' ? 'Nonaktifkan ?' : 'Aktifkan ?',
                deskripsi: `Apakah Anda yakin ingin ${
                  user?.status === 'active' ? 'menonaktifkan' : 'mengaktifkan'
                } anggota ini?`,
                icon: 'warning',
                onConfirm: () => {
                  onUpdateStatus(user?.status === 'active' ? 'inactive' : 'active');
                },
              })
            }
          >
            {user?.status === 'active' ? (
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
              deskripsi: 'Apakah Anda Yakin Menghapus user ini',
              icon: 'warning',
              onConfirm: () => {
                if (onDelete && user?.id) {
                  onDelete(user.id);
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
