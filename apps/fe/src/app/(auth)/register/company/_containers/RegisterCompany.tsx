'use client';

import { useGoogleLogin } from '@react-oauth/google';
import type { PickRegisterCompany } from '@repo/types';
import Link from 'next/link';
import { useState } from 'react';

import GoogleSignInButton from '@/components/molecules/GoogleSignButton';
import { CompanyRegisterFormSection } from '@/components/page/auth';
import { useApi } from '@/hooks/useApi/useApi';

export default function RegisterCompanyContainer() {
  const api = useApi();

  const [formRegister, setFormRegister] = useState<PickRegisterCompany>({
    email: '',
    fullName: '',
    password: '',
    companyName: '',
    tier: 'free',
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const registerCompany = api.company.mutate.registerCompany();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = formRegister;
    registerCompany.mutateAsync(payload).catch(() => {});
  };

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (_codeResponse) => {
      console.log('login google');
    },
    onError: (err) => {
      console.log('Google Login Failed', err);
    },
  });

  return (
    <div className="w-full space-y-6">
      {/* Form Header matching auth-style.png */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Mulai ruang kerja barumu
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Buat akun dan daftarkan perusahaanmu di Spaces.
        </p>
      </div>

      {/* Main Registration Form */}
      <CompanyRegisterFormSection
        service={{
          isPending: registerCompany.isPending,
          onSubmit: handleSubmit,
        }}
        state={{
          formRegister: formRegister,
          setFormRegister: setFormRegister,
          showPassword: showPassword,
          setShowPassword: setShowPassword,
        }}
      />

      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="w-full border-t border-border/60" />
        <span className="absolute bg-background px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          atau
        </span>
      </div>

      {/* Social Registration */}
      <div className="w-full">
        <GoogleSignInButton
          onSuccess={googleLogin}
          disabled={false}
          className="rounded-xl border-border/70 bg-card/60 hover:bg-muted font-medium text-sm py-2.5"
        />
      </div>

      {/* Account Switching Links */}
      <div className="space-y-2 pt-2 text-center text-sm">
        <p className="text-muted-foreground">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Masuk
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">
          Daftar sebagai anggota tim?{' '}
          <Link href="/register/employ" className="font-medium text-foreground hover:underline">
            Daftar sebagai karyawan
          </Link>
        </p>
      </div>
    </div>
  );
}
