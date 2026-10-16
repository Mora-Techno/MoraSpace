import type { OwnerMetricsSummary } from '@repo/types';
import { BellRing, Clock, Loader2, ShieldAlert } from 'lucide-react';
import React from 'react';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/atoms';
import { ImageUpload, PageHeader } from '@/components/molecules';

interface CompanySettingsSectionProps {
  service: {
    handleSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
    isLoading: boolean;
    metrics?: OwnerMetricsSummary | null;
  };
  state: {
    formUpdate: {
      logo: string;
      country: string;
      workingHourStart?: string;
      workingHourEnd?: string;
      workDays: string;
      respectWorkingHours?: boolean;
      queueNotification?: boolean;
      urgentMessageLimitPerDay?: number;
    };
    setFormUpdate: React.Dispatch<
      React.SetStateAction<{
        logo: string;
        country: string;
        workingHourStart?: string;
        workingHourEnd?: string;
        workDays: string;
        respectWorkingHours?: boolean;
        queueNotification?: boolean;
        urgentMessageLimitPerDay?: number;
      }>
    >;
  };
}

const WORK_DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const WORK_DAY_LABELS: Record<string, string> = {
  mon: 'Sen',
  tue: 'Sel',
  wed: 'Rab',
  thu: 'Kam',
  fri: 'Jum',
  sat: 'Sab',
  sun: 'Min',
};

const CompanySettingsSection: React.FC<CompanySettingsSectionProps> = ({
  service: { handleSubmit, isPending, isLoading, metrics },
  state: { formUpdate, setFormUpdate },
}) => {
  const activeDays = (formUpdate.workDays || '')
    .split(',')
    .map((d) => d.trim())
    .filter(Boolean);

  const toggleDay = (day: string) => {
    const next = new Set(activeDays);
    if (next.has(day)) {
      next.delete(day);
    } else {
      next.add(day);
    }
    const workDays = WORK_DAY_ORDER.filter((d) => next.has(d)).join(',');
    setFormUpdate((prev) => ({ ...prev, workDays }));
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Company Settings & Policies"
        description="Kelola profil perusahaan, jam kerja operasional, dan kebijakan notifikasi."
      />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Organization Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Profile</CardTitle>
            <CardDescription>Perbarui logo dan negara operasional perusahaan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <ImageUpload
                label="Logo Perusahaan"
                description="Format: PNG, JPG, WebP, atau SVG. Ukuran maksimal 2MB."
                value={formUpdate.logo}
                onChange={(url) =>
                  setFormUpdate((prev) => ({
                    ...prev,
                    logo: url,
                  }))
                }
                folder="company-logos"
                shape="rounded"
                previewSize="lg"
                disabled={isPending || isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formUpdate.country}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormUpdate((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
                placeholder="Indonesia"
                disabled={isPending || isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Working Hours & Notification Policy */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <CardTitle>Working Hours & Queue Policy</CardTitle>
            </div>
            <CardDescription>
              Terapkan aturan Non-Negotiable: antrean pesan dan notifikasi non-kritis di luar jam
              kerja.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workingHourStart">Jam Mulai Kerja</Label>
                <Input
                  id="workingHourStart"
                  type="time"
                  value={formUpdate.workingHourStart || '09:00'}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormUpdate((prev) => ({
                      ...prev,
                      workingHourStart: e.target.value,
                    }))
                  }
                  disabled={isPending || isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingHourEnd">Jam Berakhir Kerja</Label>
                <Input
                  id="workingHourEnd"
                  type="time"
                  value={formUpdate.workingHourEnd || '17:00'}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormUpdate((prev) => ({
                      ...prev,
                      workingHourEnd: e.target.value,
                    }))
                  }
                  disabled={isPending || isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hari Kerja</Label>
              <div className="flex flex-wrap gap-2">
                {WORK_DAY_ORDER.map((day) => (
                  <Button
                    key={day}
                    type="button"
                    size="sm"
                    variant={activeDays.includes(day) ? 'default' : 'outline'}
                    onClick={() => toggleDay(day)}
                    disabled={isPending || isLoading}
                  >
                    {WORK_DAY_LABELS[day]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border/50 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formUpdate.respectWorkingHours ?? true}
                  onChange={(e) =>
                    setFormUpdate((prev) => ({
                      ...prev,
                      respectWorkingHours: e.target.checked,
                    }))
                  }
                  className="mt-0.5 rounded border-input text-primary focus:ring-ring"
                />
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Respect Working Hours Policy
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Tunda notifikasi dan email non-darurat saat anggota berada di luar jam
                    operasional.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formUpdate.queueNotification ?? true}
                  onChange={(e) =>
                    setFormUpdate((prev) => ({
                      ...prev,
                      queueNotification: e.target.checked,
                    }))
                  }
                  className="mt-0.5 rounded border-input text-primary focus:ring-ring"
                />
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Antrekan Notifikasi Otomatis
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Hanya notifikasi prioritas &quot;Critical&quot; yang langsung diteruskan
                    seketika.
                  </div>
                </div>
              </label>

              <div className="pt-3 border-t border-border/50 space-y-2">
                <Label htmlFor="urgentLimit">Batas Pesan Mendesak per Hari</Label>
                <div className="max-w-xs">
                  <Input
                    id="urgentLimit"
                    type="number"
                    min={1}
                    max={20}
                    value={formUpdate.urgentMessageLimitPerDay ?? 3}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormUpdate((prev) => ({
                        ...prev,
                        urgentMessageLimitPerDay: parseInt(e.target.value, 10) || 3,
                      }))
                    }
                    disabled={isPending || isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Kuota pesan mendesak per orang per hari saat rekan di luar jam kerja (default 3).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ringkasan Owner: Penggunaan Pesan Mendesak & Luar Jam Kerja */}
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <CardTitle>Ringkasan Pemakaian Pesan Mendesak (7 Hari)</CardTitle>
            </div>
            <CardDescription>
              Pantau kepatuhan jam kerja dan seberapa sering jalur darurat digunakan oleh tim tanpa
              melanggar privasi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/40">
                <p className="text-xs text-muted-foreground">Mendesak Hari Ini</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {metrics?.urgentCountToday ?? 0}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/40">
                <p className="text-xs text-muted-foreground">Mendesak 7 Hari</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {metrics?.urgentCountThisWeek ?? 0}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/40">
                <p className="text-xs text-muted-foreground">Pesan Luar Jam</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {metrics?.outOfHoursMessagesCount ?? 0}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/40">
                <p className="text-xs text-muted-foreground">App Dibuka (Luar Jam)</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {metrics?.appOpenedOutOfHoursCount ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <Button type="submit" disabled={isPending || isLoading}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan Pengaturan'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompanySettingsSection;
