'use client';

import type { AdminCompanyItem } from '@repo/types/company.types';

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
import { PageHeader } from '@/components/molecules/PageHeader';

export interface AdminCompanyRowVM extends AdminCompanyItem {
  lastLoginText: string;
}

interface AdminCompaniesSectionProps {
  service: {
    companies: AdminCompanyRowVM[];
    isLoading: boolean;
    isError: boolean;
    createPending: boolean;
    onSubmitCreate: (e: React.FormEvent) => void;
    onToggleCreate: () => void;
    onSuspend: (c: AdminCompanyItem) => void;
    onActivate: (c: AdminCompanyItem) => void;
    onSetPlan: (c: AdminCompanyItem, tier: 'free' | 'pro' | 'enterprise') => void;
  };
  state: {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    showCreate: boolean;
    form: {
      name: string;
      ownerEmail: string;
      ownerFullName: string;
      ownerPassword: string;
      tier: string;
    };
    setForm: React.Dispatch<
      React.SetStateAction<{
        name: string;
        ownerEmail: string;
        ownerFullName: string;
        ownerPassword: string;
        tier: string;
      }>
    >;
  };
}

export function AdminCompaniesSection({ service, state }: AdminCompaniesSectionProps) {
  const {
    companies,
    isLoading,
    isError,
    createPending,
    onSubmitCreate,
    onToggleCreate,
    onSuspend,
    onActivate,
    onSetPlan,
  } = service;
  const { searchTerm, setSearchTerm, showCreate, form, setForm } = state;

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Admin — Companies"
        description="Onboarding manual beta, kill switch suspend, dan set plan. Khusus Super Admin."
      />

      {isError && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-destructive">
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
        <Button onClick={onToggleCreate}>{showCreate ? 'Tutup Form' : 'Buat Company'}</Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Buat Company Manual</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmitCreate} className="grid gap-4 sm:grid-cols-2">
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
                <Button type="submit" disabled={createPending}>
                  {createPending ? 'Membuat...' : 'Buat Company'}
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
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-400">
                    Belum ada company.
                  </td>
                </tr>
              ) : (
                companies.map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-semibold">{c.name}</td>
                    <td className="px-4 py-3">{c.owner.email}</td>
                    <td className="px-4 py-3">{c.memberCount}</td>
                    <td className="px-4 py-3">{c.lastLoginText}</td>
                    <td className="px-4 py-3">
                      <select
                        value={c.tier}
                        onChange={(e) =>
                          onSetPlan(c, e.target.value as 'free' | 'pro' | 'enterprise')
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
                        <Button size="sm" onClick={() => onActivate(c)}>
                          Aktifkan
                        </Button>
                      ) : (
                        <Button size="sm" variant="destructive" onClick={() => onSuspend(c)}>
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

export default AdminCompaniesSection;
