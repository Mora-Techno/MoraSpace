import { Plus, Users, Trash2 } from "lucide-react";
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
import { type ITeam } from "@repo/types";
import { PickCreateTeam } from "@repo/types";

interface CompanyTeamSectionProps {
  state: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    formCreate: PickCreateTeam;
    setFormCreate: React.Dispatch<React.SetStateAction<PickCreateTeam>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    alert?: AlertContexType;
  };
  service: {
    handleSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
    isLoading: boolean;
    teams: ITeam[];
    handleDelete: (id: string) => void;
  };
}

const CompanyTeamSection: React.FC<CompanyTeamSectionProps> = ({
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
  const { handleSubmit, isPending, teams, isLoading, handleDelete } = service;

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Kelola Tim"
        description="Atur dan buat tim baru di perusahaan Anda."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" />
                Tambah Tim
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Tim Baru</DialogTitle>
                <DialogDescription>
                  Grup atau tim kerja baru untuk perusahaan ini.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Tim</Label>
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
                    placeholder="Contoh: Tim Marketing, Tim IT"
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
                    placeholder="Penjelasan opsional..."
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Menyimpan…" : "Simpan Tim"}
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
          <CardTitle className="text-lg">Daftar Tim</CardTitle>
          <CardDescription>
            Total {teams?.length || 0} tim tersedia.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <DecoratedInput
            placeholder="Cari Tim"
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
          ) : teams?.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Belum ada tim. Tambahkan tim pertama Anda.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {teams?.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {team.name}
                    </p>
                    {team.description && (
                      <p className="truncate text-xs text-muted-foreground">
                        {team.description}
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
                          title: "Hapus Tim?",
                          deskripsi: "Apakah Anda yakin menghapus tim ini?",
                          icon: "warning",
                          onConfirm: () => {
                            handleDelete(team.id);
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

export default CompanyTeamSection;
