import { Button } from "@/components/atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms";

import { GhibliCard } from "@/components/molecules/GhibliCard";
import { GhibliSwitch } from "@/components/molecules/GhibliSwitch";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Language } from "@/configs";
import { Theme } from "@/core/providers/theme.provider";
import { AlertContexType } from "@/types/ui";
import { Settings } from "@repo/types";

interface SettingsSectionProps {
  state: {
    theme: Theme;
    toggleTheme: () => void;
    languages: readonly Language[];
    currentLanguage: Language;
    changeLanguage: (lang: Language) => void;
    formTestEmail: string;
    setFormTestEmail: React.Dispatch<React.SetStateAction<string>>;
    alert: AlertContexType;
  };
  service: {
    settings: Settings | null;
    isLoading: boolean;
    handleChangeTheme: () => void;
    handleLogout: () => void;
    handleChangeTimeFormat: (value: string) => void;
    handleChangeNotification: (value: any) => void;
    isPending: boolean;
    handleSendNotification: () => void;
  };
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  state,
  service,
}) => {
  const {
    theme,
    toggleTheme,
    languages,
    changeLanguage,
    currentLanguage,
    formTestEmail,
    alert,
    setFormTestEmail,
  } = state;
  const {
    isLoading,
    isPending,
    handleLogout,
    handleSendNotification,
    settings,
    handleChangeTheme,
    handleChangeTimeFormat,
    handleChangeNotification,
  } = service;
  return (
    <div className="animate-in fade-in max-w-full duration-700">
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
                  handleChangeTheme();
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
                  handleChangeTimeFormat(value)
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
              onCheckedChange={(checked) => handleChangeNotification(checked)}
            />
          </div>

          <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
            <p className="text-sm font-medium">Test Email SMTP</p>
            <input
              type="email"
              value={formTestEmail}
              onChange={(e) => setFormTestEmail(e.target.value)}
              placeholder="email@contoh.com"
              className="w-full rounded-xl border border-input bg-background/80 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              className="ghibli-btn"
              disabled={!formTestEmail || isPending}
              onClick={() => handleSendNotification()}
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
        <GhibliCard>
          <h2 className="font-bold">Keluar Dari Applikasi:</h2>
          <Button
            variant={"destructive"}
            disabled={isPending}
            onClick={() =>
              alert.modal({
                title: "Keluar",
                deskripsi: "Apakah Anda Yakin Ingin Keluar ?",
                icon: "info",
                onConfirm: () => {
                  handleLogout();
                },
              })
            }
          >
            {isPending ? "Loading..." : "Keluar"}
          </Button>
        </GhibliCard>
      </div>
    </div>
  );
};

export default SettingsSection;
