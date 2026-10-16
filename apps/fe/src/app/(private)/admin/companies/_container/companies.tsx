'use client';

import type { AdminCompanyItem } from '@repo/types/company.types';
import { useMemo, useState } from 'react';

import { AdminCompaniesSection } from '@/components/page/private/admin/admin-companies.section';
import { useApi } from '@/hooks/useApi/useApi';
import { useDebounce } from '@/hooks/useDebounce';

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

  const rows = useMemo(
    () =>
      (companies as AdminCompanyItem[]).map((c) => ({
        ...c,
        lastLoginText: c.lastLoginAt ? new Date(c.lastLoginAt).toLocaleString() : '-',
      })),
    [companies],
  );

  return (
    <AdminCompaniesSection
      service={{
        companies: rows,
        isLoading,
        isError,
        createPending: createCompany.isPending,
        onSubmitCreate: (e) => {
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
        },
        onToggleCreate: () => setShowCreate((v) => !v),
        onSuspend: (c) => {
          if (confirm(`Suspend ${c.name}? Semua member tak bisa login.`)) {
            suspendCompany.mutate({ id: c.id });
          }
        },
        onActivate: (c) => {
          if (confirm(`Aktifkan kembali ${c.name}?`)) {
            activateCompany.mutate({ id: c.id });
          }
        },
        onSetPlan: (c, tier) =>
          setCompanyPlan.mutate({
            id: c.id,
            payload: { tier, billingCycle: c.billingCycle },
          }),
      }}
      state={{ searchTerm, setSearchTerm, showCreate, form, setForm }}
    />
  );
}
