import { Plus, Users } from "lucide-react";
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
import { AdminUser, PickCreateAdmin } from "@repo";
import { AdminRow } from "@/components/molecules/AdminRow";
import { DecoratedInput } from "@/components/wrapper";
import { AlertContexType } from "@/types/ui";

interface CompanyAdminSectionProps {
  state: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    formCreateAdmin: PickCreateAdmin;
    setFormCreateAdmin: React.Dispatch<React.SetStateAction<PickCreateAdmin>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    alert?: AlertContexType;
  };
  service: {
    handleSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
    isLoading: boolean;
    admins: AdminUser[];
    handleDelete: (id: string) => void;
    handleUpdateStatus: (id: string, status: string) => void;
  };
}
const CompanyAdminSection: React.FC<CompanyAdminSectionProps> = ({
  state,
  service,
}) => {
  const {
    open,
    setOpen,
    formCreateAdmin,
    setFormCreateAdmin,
    searchTerm,
    setSearchTerm,
    alert,
  } = state;
  const {
    handleSubmit,
    isPending,
    admins,
    isLoading,
    handleDelete,
    handleUpdateStatus,
  } = service;
  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Kelola Admin"
        description="Daftar admin perusahaan dan undang admin baru."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" />
                Tambah Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Admin Baru</DialogTitle>
                <DialogDescription>
                  Admin akan memiliki akses ke pengaturan perusahaan.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="fullName"
                    required
                    value={formCreateAdmin.fullName}
                    onChange={(e) =>
                      setFormCreateAdmin((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    placeholder="Maria Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formCreateAdmin.email}
                    onChange={(e) =>
                      setFormCreateAdmin((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="maria@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={formCreateAdmin.password}
                    onChange={(e) =>
                      setFormCreateAdmin((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Minimal 8 karakter"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Menyimpan…" : "Simpan Admin"}
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
            <Users className="size-8 text-primary" />
          </CardAction>
          <CardTitle className="text-lg">Daftar Admin</CardTitle>
          <CardDescription>
            Total {admins.length} admin terdaftar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <DecoratedInput
            placeholder="Cari Username"
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
              <AdminRow />
            </phantom-ui>
          ) : admins.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Belum ada admin. Tambahkan admin pertama Anda.
            </div>
          ) : (
            <div className="space-y-3">
              {admins.map((admin) => (
                <AdminRow
                  key={admin.id}
                  admin={admin as any}
                  alert={alert}
                  onDelete={handleDelete}
                  onUpdateStatus={(status) =>
                    handleUpdateStatus(admin.id, status)
                  }
                  isPending={isPending}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyAdminSection;
