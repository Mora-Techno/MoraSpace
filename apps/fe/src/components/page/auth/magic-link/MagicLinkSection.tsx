import { Loader2, MailCheck } from "lucide-react";

interface MagicLinkSectionProps {
  initial: {
    title: string;
    desc: string;
  };
  loading?: boolean;
}

const MagicLinkSection: React.FC<MagicLinkSectionProps> = ({
  initial,
  loading = true,
}) => {
  return (
    <main className="ghibli-bg flex min-h-screen items-center justify-center px-6 py-10">
      <div className="ghibli-glass  w-full max-w-lg overflow-hidden">
        <div className="flex flex-col items-center gap-5 border-b border-border/60 px-8 py-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            {loading ? (
              <Loader2 className="h-10 w-10 animate-spin" />
            ) : (
              <MailCheck className="h-10 w-10" />
            )}
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-foreground">
              {initial.title}
            </h1>

            <p className="mx-auto max-w-sm text-sm leading-6 text-muted-foreground">
              {initial.desc}
            </p>
          </div>
        </div>

        <div className="space-y-5 px-8 py-8">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-center text-sm leading-6 text-muted-foreground">
              {loading
                ? "Sedang memverifikasi Magic Link Anda. Mohon tunggu beberapa saat dan jangan menutup halaman ini."
                : "Verifikasi selesai. Anda akan segera diarahkan ke dashboard."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MagicLinkSection;
