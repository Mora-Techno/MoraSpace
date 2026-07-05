import { Icon } from "@iconify/react";
import { Leaf } from "lucide-react";
import Link from "next/link";

import { appConfig } from "@/configs/app.config";

export default function AppFooter() {
  return (
    <footer className="border-t border-white/10 bg-background/90 px-4 py-12 md:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <Link href="/home" className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-orange-500/20 to-amber-500/10">
              <Leaf className="size-5 text-orange-400" />
            </div>
            <span className="font-serif text-lg font-semibold text-white">
              {appConfig.name === "App" ? "MoraSpace" : appConfig.name}
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-zinc-500">
            PWA Produktivitas dengan dark theme modern — kelola tugas, catatan,
            dan fokus dalam satu tempat.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">Ikuti Kami</h2>
          <div className="mt-4 flex items-center gap-3">
            {Object.entries(appConfig.social_media).map(([key, value]) => (
              <Link
                href={value.url}
                key={key}
                className="flex size-10 items-center justify-center rounded-xl border border-white/10 text-zinc-400 transition-colors hover:border-orange-500/30 hover:text-orange-400"
              >
                <Icon icon={value.icon} width={20} height={20} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-5xl border-t border-white/5 pt-6 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} MoraSpace. All rights reserved.
      </div>
    </footer>
  );
}
