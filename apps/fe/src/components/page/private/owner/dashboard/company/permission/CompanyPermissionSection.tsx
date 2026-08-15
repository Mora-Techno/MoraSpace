import { Plus, Shield, Trash2 } from "lucide-react";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@/components/atoms";
import { PageHeader } from "@/components/molecules/PageHeader";
import { DecoratedInput } from "@/components/wrapper";
import { AlertContexType } from "@/types/ui";
// Adjust import as per your backend schema representation of Role structure.
// Defaulting to any since schema might vary in exact field name for UI usage
import { type IRole } from "@repo/types";

interface FormCreate {
  name: string;
  description: string;
}

interface CompanyPermissionSectionProps {
  state: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    formCreate: FormCreate;
    setFormCreate: React.Dispatch<React.SetStateAction<FormCreate>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    alert?: AlertContexType;
  };
  service: {
    handleSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
    isLoading: boolean;
    roles: IRole[];
    handleDelete: (id: string) => void;
  };
}

const CompanyPermissionSection: React.FC<CompanyPermissionSectionProps> = ({
  state,
  service,
}) => {
  const {
    open,
    setOpen,
    formCreate,
    setFormCreate,
    searchTerm,
    setSearchTerm,
    alert,
  } = state;
  const { handleSubmit, isPending, roles, isLoading, handleDelete } = service;

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Kelola Role & Permission"
        description="Atur Role dan kendalikan hak akses dari masing-masing role."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" />
                Tambah Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Role Baru</DialogTitle>
                <DialogDescription>
                  Role baru yang dapat diberikan hak akses tertentu.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Role</Label>
                  <Input
                    id="name"
                    required
                    value={formCreate.name}
                    onChange={(e) =>
                      setFormCreate((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Contoh: Manager, Staff"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Input
                    id="description"
                    value={formCreate.description}
                    onChange={(e) =>
                      setFormCreate((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Penjelasan opsi..."
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Menyimpan…" : "Simpan Role"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardHeader>
          <CardAction>
            <Shield className="size-8 text-primary" />
          </CardAction>
          <CardTitle className="text-lg">Daftar Role / Permission</CardTitle>
          <CardDescription>
            Total {roles?.length || 0} role tersedia.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <DecoratedInput
            placeholder="Cari Role"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isLoading ? (
            <phantom-ui
              loading
              animation="pulse"
              count={3}
              count-gap={12}
              reveal={0.3}
            >
              <div className="h-16 w-full rounded-xl border bg-card" />
            </phantom-ui>
          ) : roles?.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Belum ada role.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {roles?.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {role.name} {role.isSystem ? "(Sistem)" : ""}
                    </p>
                    {role.description && (
                      <p className="truncate text-xs text-muted-foreground">
                        {role.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!role.isSystem && (
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                        onClick={() =>
                          alert?.modal({
                            title: "Hapus Role?",
                            deskripsi: "Apakah Anda yakin menghapus role ini?",
                            icon: "warning",
                            onConfirm: () => {
                              handleDelete(role.id);
                            },
                          })
                        }
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyPermissionSection;
