"use client";

import { useState } from "react";

import { useTheme } from "@/core/providers/theme.provider";
import { useSendNotification } from "@/hooks/useApi/notification";
import { useLanguage } from "@/hooks/useLanguage";
import { useApi } from "@/hooks/useApi/useApi";
import { Skeleton } from "@/components/atoms/Skeleton";
import SettingsSection from "@/components/page/private/member/settings/settingsMemberSection";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
export default function SettingsContainer() {
  const api = useApi();
  const ns = useAppNameSpace();
  const useGetSettings = api.settings.query.detail();
  const useUpdateSettings = api.settings.mutate.update();
  const { data: settings, isLoading } = useGetSettings;
  const updateSettings = useUpdateSettings;
  const sendNotification = useSendNotification();
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const useLogout = api.auth.mutate.logout();

  // no endpoint for this
  const [formTestEmail, setFormTestEmail] = useState("");

  const handleChangeTheme = () => {
    updateSettings.mutate({
      theme: theme === "light" ? "dark" : "light",
    });
  };

  const handleChangeTimeFormat = (value: string) => {
    updateSettings.mutate({
      timeFormat: value,
    });
  };

  const handleChangeNotification = (value: string) => {
    updateSettings.mutate({
      timeFormat: value,
    });
  };

  const handleSendNotification = () => {
    sendNotification.mutate({
      body: "Email test dari Website Produktivitas",
      recipient: formTestEmail,
      subject: "Test Notifikasi MoraSpace",
    });
  };

  const handleLogout = () => {
    useLogout.mutate();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <SettingsSection
      service={{
        isLoading: isLoading,
        settings: settings ?? null,
        handleChangeTheme: handleChangeTheme,
        handleChangeTimeFormat: handleChangeTimeFormat,
        handleChangeNotification: handleChangeNotification,
        isPending: sendNotification.isPending || useLogout.isPending,
        handleLogout: handleLogout,
        handleSendNotification: handleSendNotification,
      }}
      state={{
        languages: languages ?? [],
        theme: theme,
        toggleTheme: toggleTheme,
        alert: ns.alert,
        changeLanguage: changeLanguage,
        currentLanguage: currentLanguage,
        formTestEmail: formTestEmail,
        setFormTestEmail: setFormTestEmail,
      }}
    />
  );
}
