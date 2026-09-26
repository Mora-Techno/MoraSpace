import React from "react";
import { PageHeader } from "@/components/molecules/PageHeader";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/atoms";
import { Loader2, ShieldAlert, Clock, BellRing } from "lucide-react";

interface CompanySettingsSectionProps {
  service: {
    handleSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
    isLoading: boolean;
  };
  state: {
    formUpdate: {
      logo: string;
      country: string;
      workingHourStart?: string;
      workingHourEnd?: string;
      respectWorkingHours?: boolean;
      queueNotification?: boolean;
    };
    setFormUpdate: React.Dispatch<
      React.SetStateAction<{
        logo: string;
        country: string;
        workingHourStart?: string;
        workingHourEnd?: string;
        respectWorkingHours?: boolean;
        queueNotification?: boolean;
      }>
    >;
  };
}

const CompanySettingsSection: React.FC<CompanySettingsSectionProps> = ({
  service: { handleSubmit, isPending, isLoading },
  state: { formUpdate, setFormUpdate },
}) => {
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
            <CardDescription>
              Perbarui logo dan negara operasional perusahaan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={formUpdate.logo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormUpdate((prev) => ({
                    ...prev,
                    logo: e.target.value,
                  }))
                }
                placeholder="https://example.com/logo.png"
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
              <Clock className="w-5 h-5 text-blue-600" />
              <CardTitle>Working Hours & Queue Policy</CardTitle>
            </div>
            <CardDescription>
              Terapkan aturan Non-Negotiable: antrean pesan dan notifikasi non-kritis di luar jam kerja.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workingHourStart">Jam Mulai Kerja</Label>
                <Input
                  id="workingHourStart"
                  type="time"
                  value={formUpdate.workingHourStart || "09:00"}
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
                  value={formUpdate.workingHourEnd || "17:00"}
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

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
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
                  className="mt-0.5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    Respect Working Hours Policy
                  </div>
                  <div className="text-xs text-neutral-500">
                    Tunda notifikasi dan email non-darurat saat anggota berada di luar jam operasional.
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
                  className="mt-0.5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    Antrekan Notifikasi Otomatis
                  </div>
                  <div className="text-xs text-neutral-500">
                    Hanya notifikasi prioritas "Critical" yang langsung diteruskan seketika.
                  </div>
                </div>
              </label>
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
              "Simpan Pengaturan"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompanySettingsSection;
