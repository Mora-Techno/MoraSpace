import { PickRegister } from "@repo/types";
import { Eye, EyeClosed } from "lucide-react";

import { ActionButton, DecoratedInput } from "@/components/wrapper";

interface RegisterFormSectionProps {
  service: {
    onSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
  };

  state: {
    formRegister: PickRegister;
    setFormRegister: React.Dispatch<React.SetStateAction<PickRegister>>;
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  };
}
const RegisterFormSection: React.FC<RegisterFormSectionProps> = ({
  service,
  state,
}) => {
  const { isPending, onSubmit } = service;
  const { formRegister, setFormRegister, showPassword, setShowPassword } =
    state;
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium">
          Nama Lengkap
        </label>
        <DecoratedInput
          id="fullName"
          type="text"
          value={formRegister.fullName}
          onChange={(e) =>
            setFormRegister((prev) => ({
              ...prev,
              fullName: e.target.value,
            }))
          }
          required
          placeholder="Nama kamu"
          className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <DecoratedInput
          id="email"
          type="email"
          value={formRegister.email}
          onChange={(e) =>
            setFormRegister((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
          required
          placeholder="nama@email.com"
          className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <DecoratedInput
          id="password"
          type={showPassword ? "text" : "password"}
          value={formRegister.password}
          iconRight={
            showPassword ? (
              <EyeClosed
                onClick={() => setShowPassword(false)}
                className="text-foreground  cursor-pointer relative"
              />
            ) : (
              <Eye
                onClick={() => setShowPassword(true)}
                className="text-foreground cursor-pointer relative"
              />
            )
          }
          onChange={(e) =>
            setFormRegister((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          required
          minLength={6}
          placeholder="Minimal 6 karakter"
          className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <ActionButton
        type="submit"
        className="ghibli-btn w-full"
        disabled={isPending}
      >
        {isPending ? "Memproses..." : "Daftar"}
      </ActionButton>
    </form>
  );
};

export default RegisterFormSection;
