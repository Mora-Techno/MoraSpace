import { Plus, Briefcase, Trash2 } from "lucide-react";
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
import { type IPosition } from "@repo/types";

interface FormCreate {
  name: string;
  description: string;
}

interface CompanyPositionSectionProps {
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
    positions: IPosition[];
    handleDelete: (id: string) => void;
  };
}

const CompanyPositionSection: React.FC<CompanyPositionSectionProps> = ({
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
  const { handleSubmit, isPending, positions, isLoading, handleDelete } =
    service;

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Kelola Posisi"
        description="Atur dan buat posisi baru di perusahaan Anda."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" />
                Tambah Posisi
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Posisi Baru</DialogTitle>
                <DialogDescription>
                  Jabatan atau peran divisi baru untuk perusahaan ini.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Posisi</Label>
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
                    placeholder="Contoh: Manager, Developer"
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
                    placeholder="Penjelasan Opsional..."
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Menyimpan…" : "Simpan Posisi"}
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
            <Briefcase className="size-8 text-primary" />
          </CardAction>
          <CardTitle className="text-lg">Daftar Posisi</CardTitle>
          <CardDescription>
            Total {positions?.length || 0} posisi tersedia.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <DecoratedInput
            placeholder="Cari Posisi"
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
          ) : positions?.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Belum ada posisi. Tambahkan posisi pertama Anda.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {positions?.map((position) => (
                <div
                  key={position.id}
                  className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {position.name}
                    </p>
                    {position.description && (
                      <p className="truncate text-xs text-muted-foreground">
                        {position.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      onClick={() =>
                        alert?.modal({
                          title: "Hapus Posisi?",
                          deskripsi: "Apakah Anda Yakin Menghapus posisi ini?",
                          icon: "warning",
                          onConfirm: () => {
                            handleDelete(position.id);
                          },
                        })
                      }
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
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

export default CompanyPositionSection;
