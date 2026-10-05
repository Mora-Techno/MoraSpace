"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import ResetPasswordSection from "@/components/page/auth/ResetPassword/ResetPasswordSection";
import { useApi } from "@/hooks/useApi/useApi";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import type { PickResetPassword } from "@repo/types";
import { scorePassword } from "@repo";

const ResetPasswordContainer = () => {
  const api = useApi();
  const ns = useAppNameSpace();
  const router = useRouter();
  const searchParams = useSearchParams();
  const useResetPassword = api.auth.mutate.resetPassword();

  const [formResetPassword, setFormResetPassword] = useState<PickResetPassword>(
    {
      password: "",
      token: searchParams.get("token") ?? "",
    },
  );
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = scorePassword(formResetPassword.password ?? "");

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formResetPassword.token) {
      ns.alert.toast({
        title: "Tautan tidak valid",
        message: "Token reset tidak ditemukan di URL.",
        icon: "error",
      });
      return;
    }
    if (formResetPassword.password !== confirmPassword) {
      ns.alert.toast({
        title: "Konfirmasi tidak cocok",
        message: "Ketik ulang kata sandi baru dengan sama.",
        icon: "error",
      });
      return;
    }
    useResetPassword.mutate(formResetPassword, {
      onSuccess: () => router.replace("/login"),
    });
  };

  return (
    <main className="w-full min-h-screen">
      <ResetPasswordSection
        service={{
          isPending: useResetPassword.isPending,
          onResetPassword: handleResetPassword,
        }}
        state={{
          formResetPassword,
          setFormResetPassword,
          confirmPassword,
          setConfirmPassword,
          passwordStrength,
          showPassword,
          setShowPassword,
          showConfirmPassword,
          setShowConfirmPassword,
        }}
      />
    </main>
  );
};

export default ResetPasswordContainer;
