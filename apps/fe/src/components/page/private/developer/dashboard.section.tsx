import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Code2,
  ExternalLink,
  Layers,
  Radio,
  Server,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import React from 'react';

import { Badge, Button, Card } from '@/components/atoms';
import { PageHeader } from '@/components/molecules/PageHeader';

export interface DeveloperDashboardSectionProps {
  service: {
    pendingTracksCount: number;
    platformRole: string;
    isLoading: boolean;
    onNavigateCatalog: () => void;
    onNavigateWorkspace: () => void;
  };
}

export const DeveloperDashboardSection: React.FC<DeveloperDashboardSectionProps> = ({
  service: { pendingTracksCount, platformRole, isLoading, onNavigateCatalog, onNavigateWorkspace },
}) => {
  return (
    <div className="w-full space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 rounded-full border border-purple-200 dark:border-purple-800">
              <Sparkles className="size-3" />
              Layer 1 • Platform Console
            </span>
            <Badge variant="outline" className="text-xs font-mono">
              {platformRole || 'DEVELOPER'}
            </Badge>
          </div>
          <PageHeader
            title="Developer Dashboard"
            description="Pusat kendali fitur level sistem, kurasi Track Catalog musik global, dan status layanan MoraSpace."
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" onClick={onNavigateWorkspace} className="gap-2 text-xs h-9">
            Kembali ke Workspace
          </Button>
          <Button
            onClick={onNavigateCatalog}
            className="gap-2 text-xs h-9 bg-primary text-primary-foreground"
          >
            <Radio className="size-3.5" />
            Tinjau Track Catalog
          </Button>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Track Catalog Review Queue */}
        <Card className="p-6 flex flex-col justify-between border-border/60 bg-card/60 backdrop-blur-md relative overflow-hidden group hover:border-primary/50 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Radio className="size-5" />
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  pendingTracksCount > 0
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {pendingTracksCount > 0 ? 'Menunggu Kurasi' : 'Semua Bersih'}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Antrean Track Catalog
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-foreground">
                  {isLoading ? '...' : pendingTracksCount}
                </span>
                <span className="text-xs text-muted-foreground">pengajuan YouTube</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {pendingTracksCount > 0
                  ? 'Ada musik latar yang diajukan oleh pengguna dan memerlukan persetujuan kurator platform.'
                  : 'Seluruh musik latar yang diajukan telah selesai ditinjau dan disetujui.'}
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border/40">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateCatalog}
              className="w-full justify-between p-0 text-xs font-medium text-primary hover:text-primary/80 group-hover:translate-x-0.5 transition"
            >
              <span>Buka Halaman Kurasi</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </Card>

        {/* Card 2: Status Layanan Platform */}
        <Card className="p-6 flex flex-col justify-between border-border/60 bg-card/60 backdrop-blur-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Server className="size-5" />
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Operasional
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Layanan Sistem (Health)
              </p>
              <h4 className="text-lg font-serif font-semibold mt-1">Platform Backend</h4>
            </div>

            <div className="space-y-2 pt-1 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Elysia REST API</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Aktif
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Track Catalog Guard</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Layer 1
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Chat WebSocket Gateway</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Siap
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Turborepo Bun Stack</span>
            <span className="font-mono">v0.0.1</span>
          </div>
        </Card>

        {/* Card 3: Platform Scope & Panduan */}
        <Card className="p-6 flex flex-col justify-between border-border/60 bg-card/60 backdrop-blur-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Code2 className="size-5" />
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                Level: Platform
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Hak Akses Developer
              </p>
              <h4 className="text-lg font-serif font-semibold mt-1">Global Scope</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Role Developer beroperasi di luar isolasi tenant perusahaan, bertanggung jawab atas
                kurasi pustaka bersama dan integritas platform.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border/40">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Isolasi Tenant</span>
              <span className="font-medium text-foreground">Bypass (Platform)</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Info Card: Developer Guidelines */}
      <Card className="p-5 border-border/50 bg-primary/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
            <Activity className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Akses Cepat Kurasi Track Musik
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Track yang disetujui akan langsung dapat diputar oleh seluruh pengguna di semua
              workspace melalui fitur Focus Music Player.
            </p>
          </div>
        </div>

        <Button onClick={onNavigateCatalog} size="sm" className="shrink-0 gap-1.5 text-xs">
          <span>Buka Kurasi Sekarang</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </Card>
    </div>
  );
};
