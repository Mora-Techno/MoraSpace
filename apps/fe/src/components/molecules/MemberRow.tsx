import { AlertContexType } from "@/types/ui";
import { AdminUser } from "@repo";
import { Trash2, UserX, UserCheck } from "lucide-react";
import { Button } from "@/components/atoms";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

interface MemberRowProps {
  user?: AdminUser & { status?: string };
  alert?: AlertContexType;
  onDelete?: (id: string) => void;
  onUpdateStatus?: (status: string) => void;
  isPending?: boolean;
}

export function MemberRow({
  user,
  alert,
  onDelete,
  onUpdateStatus,
  isPending,
}: MemberRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
        {user ? getInitials(user.fullName) : ""}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {user?.fullName ?? "Nama user"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {user?.email ?? "user@company.com"}
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
                title:
                  user?.status === "active" ? "Nonaktifkan ?" : "Aktifkan ?",
                deskripsi: `Apakah Anda yakin ingin ${
                  user?.status === "active" ? "menonaktifkan" : "mengaktifkan"
                } anggota ini?`,
                icon: "warning",
                onConfirm: () => {
                  onUpdateStatus(
                    user?.status === "active" ? "inactive" : "active",
                  );
                },
              })
            }
          >
            {user?.status === "active" ? (
              <UserX className="size-4 text-red-500" />
            ) : (
              <UserCheck className="size-4 text-green-500" />
            )}
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          onClick={() =>
            alert?.modal({
              title: "Hapus ?",
              deskripsi: "Apakah Anda Yakin Menghapus user ini",
              icon: "warning",
              onConfirm: () => {
                onDelete!(user?.id!);
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
