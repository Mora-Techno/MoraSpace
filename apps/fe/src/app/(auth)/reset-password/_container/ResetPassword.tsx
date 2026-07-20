"use client";
import ResetPasswordSection from "@/components/page/auth/ResetPassword/ResetPasswordSection";
import { useApi } from "@/hooks/useApi/useApi";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { PickResetPassword } from "@repo/types";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";

const ResetPasswordContainer = () => {
  const api = useApi();
  const ns = useAppNameSpace();
  const useResetPassword = api.auth.mutate.resetPassword();
  const searchParam = useSearchParams();

  const token = searchParam.get("token") || "";

  const [formResetPassword, setFormResetPassword] = useState<PickResetPassword>({
    password: "",
    token: token,
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordStrength = useMemo(() => {
    const pw = formResetPassword.password;
    if (pw.length === 0) return { score: 0, label: "", color: "bg-transparent" };
    if (pw.length < 8) return { score: 1, label: "Lemah (Minimal 8 karakter)", color: "bg-red-500" };
    
    let score = 1;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score === 2) return { score: 2, label: "Sedang (Gunakan huruf besar & angka)", color: "bg-yellow-500" };
    if (score === 3) return { score: 3, label: "Kuat (Gunakan simbol untuk lebih kuat)", color: "bg-blue-500" };
    return { score: 4, label: "Sangat Kuat", color: "bg-green-500" };
  }, [formResetPassword.password]);

  useEffect(() => {
    if (token) {
      setFormResetPassword((prev) => ({ ...prev, token }));
    } else {
      ns.alert.toast({
        title: "Akses Ditolak",
        message: "Token reset password tidak ditemukan",
        icon: "error",
      });
      ns.router.push("/login");
    }
  }, [token, ns]);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordStrength.score < 2) {
      ns.alert.toast({
        title: "Password terlalu lemah",
        message: "Gunakan minimal 8 karakter",
        icon: "error",
      });
      return;
    }

    if (formResetPassword.password !== confirmPassword) {
      ns.alert.toast({
        title: "Konfirmasi gagal",
        message: "Konfirmasi password tidak cocok dengan password baru",
        icon: "error",
      });
      return;
    }

    useResetPassword.mutate(formResetPassword, {
      onSuccess: () => {
        ns.router.push("/login");
      },
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
        }}
      />
    </main>
  );
};

export default ResetPasswordContainer;