'use client';

import { useGoogleLogin } from '@react-oauth/google';
import type { PickRegister } from '@repo/types';
import Link from 'next/link';
import { useState } from 'react';

import GoogleSignInButton from '@/components/molecules/GoogleSignButton';
import { RegisterFormSection } from '@/components/page/auth';
import { useApi } from '@/hooks/useApi/useApi';

export default function RegisterEmployContainer() {
  const api = useApi();

  const [formRegister, setFormRegister] = useState<PickRegister>({
    email: '',
    fullName: '',
    password: '',
    phone: '',
    companyRole: 'Member',
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const register = api.auth.mutate.register();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = formRegister;
    register.mutateAsync(payload).catch(() => {});
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
      {/* Form Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Bergabung ke ruang kerja tim
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Buat akun karyawan dan mulai berkolaborasi di Spaces.
        </p>
      </div>

      {/* Main Registration Form */}
      <RegisterFormSection
        service={{
          isPending: register.isPending,
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
          Ingin mendaftarkan perusahaan baru?{' '}
          <Link href="/register/company" className="font-medium text-foreground hover:underline">
            Daftar sebagai perusahaan
          </Link>
        </p>
      </div>
    </div>
  );
}
