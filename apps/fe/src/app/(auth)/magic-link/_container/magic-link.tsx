"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import MagicLinkSection from "@/components/page/auth/magic-link/MagicLinkSection";
import { useApi } from "@/hooks/useApi/useApi";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

const MagicLinkContainer = () => {
  const api = useApi();
  const useMagicLink = api.auth.mutate.verifyMagicLink();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const link = searchParams.get("link");
  const ns = useAppNameSpace();

  useEffect(() => {
    if (!token) {
      return ns.router.push("/login");
    }
    useMagicLink.mutateAsync(
      {
        token,
      },
      {
        onSuccess: () => {
          if (link === "forgot") {
            ns.router.push("/forgot-password");
          } else {
            ns.router.push("/login");
          }
        },
      },
    ).catch(() => {});
  }, [token, link, ns.router, useMagicLink]);

  return (
    <main className="w-full min-h-screen">
      <MagicLinkSection
        initial={{
          title: "Email Berhasil Diverifikasi",
          desc: "Magic Link berhasil diverifikasi. Anda akan diarahkan ke dashboard dalam beberapa detik.",
        }}
      />
    </main>
  );
};

export default MagicLinkContainer;
