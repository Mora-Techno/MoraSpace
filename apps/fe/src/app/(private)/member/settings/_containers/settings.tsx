"use client";

import { useState } from "react";

import { useTheme } from "@/core/providers/theme.provider";
import { useSendNotification } from "@/hooks/useApi/notification";
import { useLanguage } from "@/hooks/useLanguage";
import { useApi } from "@/hooks/useApi/useApi";
import { Skeleton } from "@/components/atoms/Skeleton";
import SettingsSection from "@/components/page/private/member/settings/settingsMemberSection";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import type { Language } from "@/configs";
import { TestEmail } from "@repo";

export default function SettingsContainer() {
  const api = useApi();
  const ns = useAppNameSpace();

  const useGetSettings = api.settings.query.detail();
  const useUpdateSettings = api.settings.mutate.update();
  const useTestingEmail = api.settings.mutate.Testing();

  const { data: settings, isLoading } = useGetSettings;
  const updateSettings = useUpdateSettings;
  const sendNotification = useSendNotification();
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const useLogout = api.auth.mutate.logout();

  // no endpoint for this
  const [formTestEmail, setFormTestEmail] = useState<TestEmail>({
    email: "",
  });

  const handleTestingEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = formTestEmail;
    useTestingEmail.mutate(payload);
  };

  const handleChangeTheme = () => {
    updateSettings.mutate({
      theme: theme === "light" ? "dark" : "light",
    });
  };

  const handleChangeLanguage = (lang: Language) => {
    changeLanguage(lang);
    updateSettings.mutate({
      language: lang,
    });
  };

  const handleChangeNotification = (checked: boolean) => {
    updateSettings.mutate({
      notificationEnabled: checked,
    });
  };

  const handleChangeEnableMusic = (checked: boolean) => {
    updateSettings.mutate({
      enableMusic: checked,
    });
  };

  const handleChangeFocusMode = (checked: boolean) => {
    updateSettings.mutate({
      focusMode: checked,
    });
  };

  const handleChangeTimezone = (value: string) => {
    updateSettings.mutate({
      timezone: value,
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
        handleChangeLanguage: handleChangeLanguage,
        handleChangeNotification: handleChangeNotification,
        handleChangeEnableMusic: handleChangeEnableMusic,
        handleChangeFocusMode: handleChangeFocusMode,
        handleChangeTimezone: handleChangeTimezone,
        isPending: sendNotification.isPending || useLogout.isPending,
        handleLogout: handleLogout,
        handleSendTestingEmail: handleTestingEmail,
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
