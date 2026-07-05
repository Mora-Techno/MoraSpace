"use client";

import { useState } from "react";

import { Button } from "@/components/atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms";
import { Skeleton } from "@/components/atoms/skeleton";
import { GhibliCard } from "@/components/molecules/ghibli-card";
import { GhibliSwitch } from "@/components/molecules/ghibli-switch";
import { PageHeader } from "@/components/molecules/page-header";
import { useTheme } from "@/core/providers/theme.provider";
import { useSettings, useUpdateSettings } from "@/hooks/settings";
import { useSendNotification } from "@/hooks/useApi/notification";
import { useLanguage } from "@/hooks/useLanguage";

export default function SettingsContainer() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const sendNotification = useSendNotification();
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [testEmail, setTestEmail] = useState("");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in max-w-2xl duration-700">
      <PageHeader
        title="Pengaturan"
        description="Konfigurasi preferensi UI, notifikasi, dan bahasa."
      />

      <div className="space-y-4">
        <GhibliCard>
          <h2 className="font-serif text-lg font-semibold">Tampilan</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Dark / Light Mode</p>
                <p className="text-xs text-muted-foreground">
                  Tema{" "}
                  {theme === "dark" ? "malam berbintang" : "siang pedesaan"}
                </p>
              </div>
              <GhibliSwitch
                checked={theme === "dark"}
                onCheckedChange={() => {
                  toggleTheme();
                  updateSettings.mutate({
                    theme: theme === "light" ? "dark" : "light",
                  });
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Format Jam</p>
                <p className="text-xs text-muted-foreground">
                  12 jam atau 24 jam
                </p>
              </div>
              <Select
                value={settings?.timeFormat ?? "24h"}
                onValueChange={(value: "12h" | "24h") =>
                  updateSettings.mutate({ timeFormat: value })
                }
              >
                <SelectTrigger className="w-28 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 jam</SelectItem>
                  <SelectItem value="12h">12 jam</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </GhibliCard>

        <GhibliCard>
          <h2 className="font-serif text-lg font-semibold">Notifikasi</h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Notifikasi Default</p>
              <p className="text-xs text-muted-foreground">
                Aktifkan pengingat email secara default
              </p>
            </div>
            <GhibliSwitch
              checked={settings?.defaultNotifications ?? true}
              onCheckedChange={(checked) =>
                updateSettings.mutate({ defaultNotifications: checked })
              }
            />
          </div>

          <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
            <p className="text-sm font-medium">Test Email SMTP</p>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="email@contoh.com"
              className="w-full rounded-xl border border-input bg-background/80 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              className="ghibli-btn"
              disabled={!testEmail || sendNotification.isPending}
              onClick={() =>
                sendNotification.mutate({
                  recipient: testEmail,
                  subject: "Test Notifikasi MoraSpace",
                  body: "Email test dari PWA Produktivitas — tema Ghibli 🍃",
                })
              }
            >
              Kirim Test Email
            </Button>
          </div>
        </GhibliCard>

        <GhibliCard>
          <h2 className="font-serif text-lg font-semibold">Bahasa</h2>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <Button
                key={lang}
                variant={currentLanguage === lang ? "default" : "outline"}
                size="sm"
                className="ghibli-btn"
                onClick={() => changeLanguage(lang)}
              >
                {lang.toUpperCase()}
              </Button>
            ))}
          </div>
        </GhibliCard>
      </div>
    </div>
  );
}
