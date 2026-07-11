import { PickLogin } from '@repo/types';
import { Eye, EyeClosed } from 'lucide-react';

import { DecoratedInput } from '@/components/wrapper';
import { ActionButton } from '@/components/wrapper';

interface LoginFormSectionProps {
  state: {
    formLogin: PickLogin;
    setFormLogin: React.Dispatch<React.SetStateAction<PickLogin>>;
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  };

  service: {
    handleSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
  };
}

const LoginFormSection: React.FC<LoginFormSectionProps> = ({ state, service }) => {
  const { formLogin, setFormLogin, setShowPassword, showPassword } = state;

  return (
    <form onSubmit={service.handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <DecoratedInput
          id="email"
          type="email"
          value={formLogin.email}
          onChange={(e) =>
            setFormLogin((prev) => ({
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
          type={showPassword ? 'text' : 'password'}
          value={formLogin.password}
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
            setFormLogin((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          required
          placeholder="••••••••"
          className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <ActionButton type="submit" className=" w-full" disabled={service.isPending}>
        {service.isPending ? 'Memproses...' : 'Masuk'}
      </ActionButton>
    </form>
  );
};

export default LoginFormSection;
