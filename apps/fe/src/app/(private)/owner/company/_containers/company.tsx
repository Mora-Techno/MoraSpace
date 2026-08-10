"use client";

import { ArrowRight, Building2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@/components/atoms";
import { PageHeader } from "@/components/molecules/PageHeader";
import {
  COMPANY_ROLE_REGISTRY,
  MANAGED_COMPANY_ROLES,
} from "@/configs/company-roles.config";
import { useApi } from "@/hooks/useApi/useApi";
import type { SubscriptionTier } from "@repo/types/company.types";

const TIER_STYLES: Record<SubscriptionTier, string> = {
  free: "bg-muted text-muted-foreground",
  pro: "bg-primary/15 text-primary",
  enterprise: "bg-amber-500/15 text-amber-600",
};

function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function CompanyContainer() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const { data: company, isLoading } = useApi().company.query.getMe();

  const handleRoleChange = (slug: string) => {
    setSelectedRole(slug);
    router.push(`/owner/company/${slug}`);
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Company"
        description="Kelola profil perusahaan dan role pengguna di dalamnya."
      />

      {/* Profil perusahaan */}
      <Card>
        <CardHeader>
          <CardAction>
            <Building2 className="size-8 text-primary" />
          </CardAction>
          <CardTitle className="text-lg">Profil Perusahaan</CardTitle>
          <CardDescription>
            Informasi langganan dan detail workspace perusahaan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-40" />
            </div>
          ) : company ? (
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Nama Perusahaan</dt>
                <dd className="mt-1 font-medium">{company.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Tier Langganan</dt>
                <dd className="mt-1">
                  <Badge
                    variant="outline"
                    className={TIER_STYLES[company.tier]}
                  >
                    {company.tier}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Siklus Billing</dt>
                <dd className="mt-1 font-medium capitalize">
                  {company.billingCycle}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Kuota Workstation</dt>
                <dd className="mt-1 font-medium">
                  {company.maxWorkstationUsers} pengguna
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Mulai Berlangganan</dt>
                <dd className="mt-1 font-medium">
                  {formatDate(company.subscriptionStartsAt)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Berakhir</dt>
                <dd className="mt-1 font-medium">
                  {formatDate(company.subscriptionEndsAt)}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              Data perusahaan tidak ditemukan.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Kelola role */}
      <Card>
        <CardHeader>
          <CardAction>
            <ShieldCheck className="size-8 text-primary" />
          </CardAction>
          <CardTitle className="text-lg">Kelola Role</CardTitle>
          <CardDescription>
            Pilih role untuk melihat dan mengelola penggunanya.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={selectedRole || undefined}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger size="default" className="w-full sm:w-72">
              <SelectValue placeholder="Pilih role…" />
            </SelectTrigger>
            <SelectContent>
              {MANAGED_COMPANY_ROLES.map((role) => (
                <SelectItem key={role.slug} value={role.slug}>
                  <span className="flex items-center gap-2">
                    <role.icon className="size-4 text-muted-foreground" />
                    {role.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid gap-3 sm:grid-cols-2">
            {COMPANY_ROLE_REGISTRY.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.slug}
                  className="flex items-start justify-between gap-3 rounded-xl border p-4"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold">{role.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </div>
                  {role.manageable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 shrink-0 gap-1"
                      onClick={() => handleRoleChange(role.slug)}
                    >
                      Kelola
                      <ArrowRight className="size-3.5" />
                    </Button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
