import { GhibliCard } from "@/components/molecules";
import { ActionButton, DecoratedInput } from "@/components/wrapper";
import { PickResetPassword } from "@repo/types";
import Link from "next/link";
import Image from "next/image";

interface ResetPasswordSectionProps {
  service: {
    onResetPassword: (e: React.FormEvent) => void;
    isPending: boolean;
  };
  state: {
    formResetPassword: PickResetPassword;
    setFormResetPassword: React.Dispatch<React.SetStateAction<PickResetPassword>>;
    confirmPassword: string;
    setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
    passwordStrength: { score: number; label: string; color: string };
  };
}

const ResetPasswordSection: React.FC<ResetPasswordSectionProps> = ({
  service,
  state,
}) => {
  const { formResetPassword, setFormResetPassword, confirmPassword, setConfirmPassword, passwordStrength } = state;
  const { onResetPassword, isPending } = service;

  return (
    <section className="w-full min-h-screen flex justify-center items-center">
      <form
        onSubmit={onResetPassword}
        className="w-full flex justify-center items-center"
      >
        <GhibliCard hover={false} className="w-full max-w-md">
          <div className="w-full flex justify-center items-center">
            <Image
              src={"/images/logo.png"}
              alt="logo"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          <div className="w-full flex justify-center items-center">
            <h1 className="text-2xl font-semibold">Reset Kata Sandi</h1>
          </div>
          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password Baru:
              </label>
              <DecoratedInput
                id="password"
                type="password"
                value={formResetPassword.password}
                onChange={(e) =>
                  setFormResetPassword((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
                placeholder="Masukkan kata sandi baru"
              />
              
              {formResetPassword.password.length > 0 && (
                <div className="flex flex-col space-y-1 mt-1">
                  <div className="flex space-x-1 h-1.5 w-full">
                    <div className={`h-full flex-1 rounded-l-full transition-colors ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-gray-200 dark:bg-gray-700'}`} />
                    <div className={`h-full flex-1 transition-colors ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-gray-200 dark:bg-gray-700'}`} />
                    <div className={`h-full flex-1 transition-colors ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-gray-200 dark:bg-gray-700'}`} />
                    <div className={`h-full flex-1 rounded-r-full transition-colors ${passwordStrength.score >= 4 ? passwordStrength.color : 'bg-gray-200 dark:bg-gray-700'}`} />
                  </div>
                  <span className={`text-xs font-medium ${passwordStrength.score < 2 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Konfirmasi Password:
              </label>
              <DecoratedInput
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Ketik ulang kata sandi baru"
              />
            </div>
          </div>
          <ActionButton type="submit" className="w-full mt-4" disabled={isPending}>
            {isPending ? "Memproses..." : "Simpan Kata Sandi"}
          </ActionButton>
          <div className="w-full flex justify-center mt-2">
            <Link
              href={"/login"}
              className="font-medium text-sm text-muted-foreground hover:text-foreground"
            >
              Kembali
            </Link>
          </div>
        </GhibliCard>
      </form>
    </section>
  );
};

export default ResetPasswordSection;