"use client";
import { View } from "react-native";

import LoginSection from "@/components/section/auth/login/page-section";
import { useApi } from "@/hooks/service/useApi";
import { useState } from "react";
import { PickLogin } from "@repo/types";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
const LoginContainer = () => {
  const api = useApi();
  const ns = useAppNameSpace();
  const [formLogin, setFormLogin] = useState<PickLogin>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // api call
  const useLogin = api.auth.mutate.login();

  const handleLogin = () => {
    if (!formLogin.email || !formLogin.password) {
      return null;
    }
    const payload = formLogin;
    useLogin.mutate(payload);
  };

  return (
    <View className="w-full min-h-screen flex flex-col">
      <LoginSection
        state={{
          formLogin,
          setFormLogin,
          setShowPassword,
          showPassword,
          alert: ns.alert,
        }}
        service={{
          isPending: useLogin.isPending,
          onLogin: handleLogin,
        }}
      />
    </View>
  );
};

export default LoginContainer;
