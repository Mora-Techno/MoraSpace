'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi/useApi';
import { useDebounce } from '@/hooks/useDebounce';
import { PageHeader } from '@/components/molecules/PageHeader';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/atoms';
import type { AdminCompanyItem } from '@repo/types/company.types';

// v0.0.1 Layer 1 — khusus Super Admin (diakses via URL langsung, tanpa nav).
// Semua aksi di-guard API; non-admin dapat 403.
export default function AdminCompaniesContainer() {
  const api = useApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: '',
    ownerEmail: '',
    ownerFullName: '',
    ownerPassword: '',
    tier: 'free',
  });

  const debouncedSearch = useDebounce(searchTerm, 500);
  const {
    data: companies = [],
    isLoading,
    isError,
  } = api.company.query.adminListCompanies(
    debouncedSearch ? { search: debouncedSearch } : undefined,
  );

  const createCompany = api.company.mutate.adminCreateCompany();
  const suspendCompany = api.company.mutate.adminSuspendCompany();
  const activateCompany = api.company.mutate.adminActivateCompany();
  const setCompanyPlan = api.company.mutate.adminSetCompanyPlan();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCompany.mutate(
      {
        name: form.name,
        ownerEmail: form.ownerEmail,
        ownerFullName: form.ownerFullName,
        ...(form.ownerPassword ? { ownerPassword: form.ownerPassword } : {}),
        tier: form.tier as 'free' | 'pro' | 'enterprise',
      },
      {
        onSuccess: () => {
          setForm({
            name: '',
            ownerEmail: '',
            ownerFullName: '',
            ownerPassword: '',
            tier: 'free',
          });
          setShowCreate(false);
        },
      },
    );
  };

  const handleSuspend = (c: AdminCompanyItem) => {
    if (confirm(`Suspend ${c.name}? Semua member tak bisa login.`)) {
      suspendCompany.mutate({ id: c.id });
    }
  };

  const handleActivate = (c: AdminCompanyItem) => {
    if (confirm(`Aktifkan kembali ${c.name}?`)) {
      activateCompany.mutate({ id: c.id });
    }
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Admin — Companies"
        description="Onboarding manual beta, kill switch suspend, dan set plan. Khusus Super Admin."
      />

      {isError && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-red-500">
            Akses ditolak (403). Halaman ini khusus Super Admin platform.
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Input
          placeholder="Cari nama / slug / email owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setShowCreate((v) => !v)}>
          {showCreate ? 'Tutup Form' : 'Buat Company'}
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Buat Company Manual</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nama Company</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email Owner</Label>
                <Input
                  type="email"
                  value={form.ownerEmail}
                  onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Nama Owner</Label>
                <Input
                  value={form.ownerFullName}
                  onChange={(e) => setForm({ ...form, ownerFullName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Password (kosong = auto)</Label>
                <Input
                  type="password"
                  value={form.ownerPassword}
                  onChange={(e) => setForm({ ...form, ownerPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Plan</Label>
                <select
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value })}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="free">free</option>
                  <option value="pro">pro</option>
                  <option value="enterprise">enterprise</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={createCompany.isPending}>
                  {createCompany.isPending ? 'Membuat...' : 'Buat Company'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-neutral-500">
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Login Terakhir</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-400">
                    Memuat...
                  </td>
                </tr>
              ) : (companies as AdminCompanyItem[]).length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-400">
                    Belum ada company.
                  </td>
                </tr>
              ) : (
                (companies as AdminCompanyItem[]).map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-semibold">{c.name}</td>
                    <td className="px-4 py-3">{c.owner.email}</td>
                    <td className="px-4 py-3">{c.memberCount}</td>
                    <td className="px-4 py-3">
                      {c.lastLoginAt ? new Date(c.lastLoginAt).toLocaleString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={c.tier}
                        onChange={(e) =>
                          setCompanyPlan.mutate({
                            id: c.id,
                            payload: {
                              tier: e.target.value as 'free' | 'pro' | 'enterprise',
                              billingCycle: c.billingCycle,
                            },
                          })
                        }
                        className="rounded-md border px-2 py-1 text-xs"
                      >
                        <option value="free">free</option>
                        <option value="pro">pro</option>
                        <option value="enterprise">enterprise</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={c.status === 'suspended' ? 'destructive' : 'default'}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {c.status === 'suspended' ? (
                        <Button size="sm" onClick={() => handleActivate(c)}>
                          Aktifkan
                        </Button>
                      ) : (
                        <Button size="sm" variant="destructive" onClick={() => handleSuspend(c)}>
                          Suspend
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
