"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { PickRegister } from "@repo/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { GoogleSvg } from "@/components/atoms/svg";
import { GhibliCard } from "@/components/molecules/ghibli-card";
import { RegisterFormSection } from "@/components/page/auth";
import { useApi } from "@/hooks/useApi/useApi";
import GoogleSignInButton from "@/components/molecules/GoogleSignButton";

export default function RegisterCompanyContainer() {
  const Api = useApi();

  const [formRegister, setFormRegister] = useState<PickRegister>({
    companyRole: "Owner",
    email: "",
    fullName: "",
    password: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const registerApi = Api.auth.mutate.register();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = formRegister;
    registerApi.mutateAsync(payload);
  };

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeRespone) => {
      console.log("login google");
    },
    onError: (err) => {
      console.log("Google Login Failed", err);
    },
  });
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
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
            Buat Akun Perusahaan mu
          </h1>
          <p className="text-sm text-muted-foreground">
            Mulai perjalanan produktivitasmu
          </p>
        </div>

        <RegisterFormSection
          service={{
            isPending: registerApi.isPending,
            onSubmit: handleSubmit,
          }}
          state={{
            formRegister: formRegister,
            setFormRegister: setFormRegister,
            showPassword: showPassword,
            setShowPassword: setShowPassword,
          }}
        />
        <div className="w-full flex justify-center items-center flex-col space-y-3">
          <h1 className="text-sm font-semibold text-muted-foreground">
            Atau Daftar Menggunakan
          </h1>
          {/* Nanti Dipakein Service yang Benar */}
          <GoogleSignInButton onSuccess={googleLogin} disabled />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Daftar Sebagai Pekerja ? {""}
          <Link
            href="/register/employ"
            className="font-medium text-primary hover:underline"
          >
            Klick Disini
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link
            href="/login"
            className="text-muted-foreground hover:text-primary"
          >
            ← Kembali ke masuk
          </Link>
        </p>
      </GhibliCard>
    </main>
  );
}
