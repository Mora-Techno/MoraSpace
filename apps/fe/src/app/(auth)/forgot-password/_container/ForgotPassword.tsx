"use client";

import ForgotPasswordSection from "@/components/page/auth/ForgotPassword/ForgotPasswordSection";
import { useApi } from "@/hooks/useApi/useApi";
import { PickForgotPassword } from "@repo/types";
import React, { useState } from "react";

const ForgotPasswordContainer = () => {
  const api = useApi();
  const useForgotPassword = api.auth.mutate.forgotPassword();

  const [formSendMagicLink, setFormSendMagicLink] = useState<PickForgotPassword>(
    {
      email: "",
    },
  );

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = formSendMagicLink;
    useForgotPassword.mutate(payload);
  };
  return (
    <main className="w-full min-h-screen ">
      <ForgotPasswordSection
        service={{
          isPending: useForgotPassword.isPending,
          onForgotPassword: handleForgotPassword,
        }}
        state={{
          formSendMagicLink: formSendMagicLink,
          setFormSendMagicLink: setFormSendMagicLink,
        }}
      />
    </main>
  );
};

export default ForgotPasswordContainer;
