"use client";

import "@aejkatappaja/phantom-ui";

import { Plus, Users } from "lucide-react";
import { useState } from "react";

import {
  Badge,
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
import { useApi } from "@/hooks/useApi/useApi";
import type { AdminUser, PickCreateAdmin } from "@repo/types/company.types";

const EMPTY_FORM: PickCreateAdmin = {
  fullName: "",
  email: "",
  password: "",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function AdminRow({ admin }: { admin?: AdminUser }) {
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
      {admin ? (
        <Badge variant="outline" className="shrink-0 capitalize">
          {admin.companyRole}
        </Badge>
      ) : null}
    </div>
  );
}

export default function CompanyAdminContainer() {
  const api = useApi();
  const { data: admins = [], isLoading } = api.company.query.listAdmins();
  const createAdmin = api.company.mutate.createAdmin();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PickCreateAdmin>(EMPTY_FORM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAdmin.mutate(form, {
      onSuccess: () => {
        setOpen(false);
        setForm(EMPTY_FORM);
      },
    });
  };

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
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, fullName: e.target.value }))
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
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
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
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    placeholder="Minimal 8 karakter"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createAdmin.isPending}>
                    {createAdmin.isPending ? "Menyimpan…" : "Simpan Admin"}
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
        <CardContent>
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
                <AdminRow key={admin.id} admin={admin} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
