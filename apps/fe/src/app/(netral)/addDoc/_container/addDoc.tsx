"use client";

import { PickUpdateCompanyProfile } from "@repo/types";
import Image from "next/image";
import { useState } from "react";
import { GhibliCard } from "@/components/molecules/GhibliCard";
import { ActionButton, DecoratedInput } from "@/components/wrapper";
import { useApi } from "@/hooks/useApi/useApi";
import Link from "next/link";

const AddDocContainer = () => {
  const api = useApi();

  const [form, setForm] = useState<PickUpdateCompanyProfile>({
    logo: "",
    country: "",
  });

  const updateProfile = api.company.mutate.updateProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {} as PickUpdateCompanyProfile;
    if (form.logo) payload.logo = form.logo;
    if (form.country) payload.country = form.country;
    updateProfile.mutateAsync(payload);
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 w-full">
      <GhibliCard className="w-full max-w-md" hover={false}>
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Image
            alt="icon"
            src={"/images/logo.png"}
            width={46}
            height={46}
            className="rounded-full"
          />
          <span className="text-lg font-semibold">Mora</span>
          <h1 className="font-serif text-2xl font-semibold">
            Lengkapi Profil Perusahaan
          </h1>
          <p className="text-sm text-muted-foreground">
            Tambahkan logo dan negara perusahaanmu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="logo" className="text-sm font-medium">
              {/* Seharusnya File */}
              Logo Perusahaan (URL)
            </label>
            <DecoratedInput
              id="logo"
              type="text"
              value={form.logo ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, logo: e.target.value }))
              }
              placeholder="https://example.com/logo.png"
              className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            {/* Input Dropdown */}
            <label htmlFor="country" className="text-sm font-medium">
              Negara
            </label>
            <DecoratedInput
              id="country"
              type="text"
              value={form.country ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, country: e.target.value }))
              }
              placeholder="Indonesia"
              className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <ActionButton
            type="submit"
            className="ghibli-btn w-full"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? "Menyimpan..." : "Simpan"}
          </ActionButton>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Kamu bisa mengubahnya nanti di pengaturan perusahaan
        </p>
        <Link href={"/login"}>
          <ActionButton
            size={"sm"}
            type="button"
            variant={"outline"}
            className="ghibli-btn w-full"
          >
            Skip...
          </ActionButton>
        </Link>
      </GhibliCard>
    </main>
  );
};

export default AddDocContainer;
