import { AlertContexType } from "@/types/ui";
import { AdminUser } from "@repo";
import { Trash2 } from "lucide-react";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

interface AdminRowProps {
  admin?: AdminUser;
  alert?: AlertContexType;
  onDelete?: (id: string) => void;
}

export function AdminRow({ admin, alert, onDelete }: AdminRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
        {admin ? getInitials(admin.fullName) : ""}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {admin?.fullName ?? "Nama Admin"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {admin?.email ?? "admin@company.com"}
        </p>
      </div>
      <Trash2
        onClick={() =>
          alert?.modal({
            title: "Hapus ?",
            deskripsi: "Apakah Anda Yakin Menghapus Admin ini",
            icon: "warning",
            onConfirm: () => {
              onDelete!(admin?.id!);
            },
          })
        }
      />
    </div>
  );
}
