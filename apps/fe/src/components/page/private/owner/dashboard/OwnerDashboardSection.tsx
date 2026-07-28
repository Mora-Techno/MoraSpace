"use client";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Separator,
} from "@/components/atoms";
import { cn } from "@/utils/classname";
import {
  ArrowUpRight,
  Banknote,
  BrainCircuit,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  GraduationCap,
  Loader2,
  Users,
  XCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* ────────────────────────────────────────── */
/*  Mock Data & Types                          */
/* ────────────────────────────────────────── */

interface DepartmentProductivity {
  name: string;
  completed: number;
  pending: number;
}

interface TaskDistribution {
  name: string;
  value: number;
  color: string;
}

interface PendingApproval {
  id: string;
  type: "cuti" | "wfh" | "budget" | "invitation";
  user: string;
  initials: string;
  description: string;
  timeAgo: string;
}

interface ActivityLog {
  id: string;
  user: string;
  initials: string;
  action: string;
  timeAgo: string;
}

const departmentData: DepartmentProductivity[] = [
  { name: "Engineering", completed: 84, pending: 12 },
  { name: "Product", completed: 52, pending: 18 },
  { name: "Marketing", completed: 38, pending: 24 },
  { name: "HR", completed: 26, pending: 8 },
  { name: "Finance", completed: 31, pending: 6 },
];

const taskDistributionData: TaskDistribution[] = [
  { name: "Selesai", value: 142, color: "var(--color-success, #7DAF74)" },
  { name: "Berjalan", value: 89, color: "var(--color-info, #AEC6CF)" },
  { name: "Review", value: 34, color: "var(--color-warning, #F2C94C)" },
  { name: "Terblokir", value: 12, color: "var(--color-destructive, #D97757)" },
];

const pendingApprovals: PendingApproval[] = [
  {
    id: "1",
    type: "cuti",
    user: "Ayu Lestari",
    initials: "AL",
    description: "Cuti tahunan — 5 hari (12–16 Mei)",
    timeAgo: "2 jam lalu",
  },
  {
    id: "2",
    type: "budget",
    user: "Dimas Prayoga",
    initials: "DP",
    description: "Persetujuan budget campaign Q3 — Rp 45.000.000",
    timeAgo: "4 jam lalu",
  },
  {
    id: "3",
    type: "wfh",
    user: "Rina Wijaya",
    initials: "RW",
    description: "WFH request — 3 hari (Senin–Rabu)",
    timeAgo: "6 jam lalu",
  },
  {
    id: "4",
    type: "invitation",
    user: "Budi Santoso",
    initials: "BS",
    description: "Undangan 2 engineer baru — Tim Backend",
    timeAgo: "1 hari lalu",
  },
  {
    id: "5",
    type: "cuti",
    user: "Sari Indah",
    initials: "SI",
    description: "Cuti melahirkan — mulai 1 Juni",
    timeAgo: "1 hari lalu",
  },
];

const activityLogs: ActivityLog[] = [
  {
    id: "1",
    user: "Budi Santoso",
    initials: "BS",
    action: "menyelesaikan milestone Fluxo App v2.0",
    timeAgo: "12 menit lalu",
  },
  {
    id: "2",
    user: "Siti Rahayu",
    initials: "SR",
    action: "mengundang 2 engineer baru ke Tim Backend",
    timeAgo: "28 menit lalu",
  },
  {
    id: "3",
    user: "Dimas Prayoga",
    initials: "DP",
    action: "membuat campaign marketing Q3",
    timeAgo: "45 menit lalu",
  },
  {
    id: "4",
    user: "Ayu Lestari",
    initials: "AL",
    action: "menyetujui budget pembelian server senilai Rp 12.000.000",
    timeAgo: "1 jam lalu",
  },
  {
    id: "5",
    user: "Rina Wijaya",
    initials: "RW",
    action: "menyelesaikan sesi deep work — 2.5 jam",
    timeAgo: "2 jam lalu",
  },
  {
    id: "6",
    user: "System",
    initials: "SY",
    action: "Rencana pengisian ulang otomatis — Storage 72% terpakai",
    timeAgo: "3 jam lalu",
  },
  {
    id: "7",
    user: "Fajar Hidayat",
    initials: "FH",
    action: "bergabung ke Tim Product sebagai Product Designer",
    timeAgo: "5 jam lalu",
  },
];

/* ────────────────────────────────────────── */
/*  Helper Components                          */
/* ────────────────────────────────────────── */

function GlassCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "gsap-widget rounded-2xl border border-border/40 bg-card/70 shadow-lg shadow-black/[0.02] backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-black/[0.04] dark:border-border/30 dark:bg-card/60 dark:shadow-black/[0.08]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────── */
/*  Widget 1 — Executive KPI Cards            */
/* ────────────────────────────────────────── */

function KpiCards() {
  const kpis = [
    {
      icon: Users,
      label: "Utilisasi Kursi",
      value: "32 / 40",
      detail: <Progress value={32} max={40} className="mt-2 h-1.5" />,
      badge: "80% terpakai",
      badgeVariant: "default" as const,
    },
    {
      icon: GraduationCap,
      label: "Tingkat Produktivitas",
      value: "88.4%",
      badge: "+5.2% minggu lalu",
      badgeVariant: "default" as const,
    },
    {
      icon: CalendarCheck,
      label: "Kesehatan Tugas",
      value: "142 Aktif",
      detail: (
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="font-medium text-destructive">12 Overdue</span>
        </p>
      ),
      badge: "92% on-track",
      badgeVariant: "secondary" as const,
    },
    {
      icon: Clock,
      label: "Total Deep Work",
      value: "420 Jam",
      badge: "Minggu ini",
      badgeVariant: "outline" as const,
    },
  ];

  return (
    <>
      {kpis.map((kpi) => (
        <GlassCard key={kpi.label}>
          <CardHeader className="flex-row items-center gap-3 space-y-0 px-5 pt-5 pb-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <kpi.icon className="size-5" />
            </div>
            <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
              {kpi.label}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex items-baseline justify-between">
              <CardTitle className="text-2xl font-bold tracking-tight">
                {kpi.value}
              </CardTitle>
              <Badge
                variant={kpi.badgeVariant}
                className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
              >
                {kpi.badge}
              </Badge>
            </div>
            {kpi.detail}
          </CardContent>
        </GlassCard>
      ))}
    </>
  );
}

/* ────────────────────────────────────────── */
/*  Widget 2 — AI Executive Insights Banner   */
/* ────────────────────────────────────────── */

function AiInsightsBanner() {
  return (
    <GlassCard className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/[0.04] via-background to-primary/[0.02] dark:from-primary/[0.06] dark:via-background dark:to-primary/[0.02]">
      {/* Glow accent */}
      <div className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 size-32 rounded-full bg-primary/5 blur-2xl" />

      <CardHeader className="relative px-6 pt-6 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
            <BrainCircuit className="size-5" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              AI Briefing
              <Badge
                variant="default"
                className="rounded-full px-2 py-0.5 text-[10px] font-normal"
              >
                Live
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Wawasan otomatis untuk pemilik perusahaan
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative px-6 pb-6">
        <p className="text-sm leading-relaxed text-foreground/85">
          <span className="font-medium text-primary">Tim Engineering</span>{" "}
          mencapai efisiensi 92%, namun{" "}
          <span className="font-medium text-destructive">Tim Marketing</span>{" "}
          mengalami bottleneck pada 3 campaign utama. Disarankan meninjau ulang
          beban meeting mingguan dan mengalokasikan 2 engineer untuk
          mempercepat.
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 h-auto gap-1.5 p-0 text-xs font-medium text-primary hover:bg-transparent hover:text-primary/80"
        >
          Lihat detail analisis
          <ChevronRight className="size-3.5" />
        </Button>
      </CardContent>
    </GlassCard>
  );
}

/* ────────────────────────────────────────── */
/*  Widget 3a — Bar Chart (Produktivitas)     */
/* ────────────────────────────────────────── */

function ProductivityChart() {
  return (
    <GlassCard>
      <CardHeader className="px-5 pt-5 pb-2">
        <CardTitle className="text-sm font-semibold">
          Produktivitas per Divisi
        </CardTitle>
        <CardDescription className="text-xs">
          Tasks completed vs. pending
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-5">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={departmentData}
            margin={{ top: 8, right: 16, left: -8, bottom: 4 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--color-popover)",
                color: "var(--color-popover-foreground)",
                fontSize: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              }}
              cursor={{ fill: "var(--color-muted)", radius: 6 }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "11px",
                color: "var(--color-muted-foreground)",
              }}
            />
            <Bar
              dataKey="completed"
              name="Selesai"
              radius={[4, 4, 0, 0]}
              fill="var(--color-primary)"
              maxBarSize={32}
            />
            <Bar
              dataKey="pending"
              name="Tertunda"
              radius={[4, 4, 0, 0]}
              fill="var(--color-muted-foreground)"
              maxBarSize={32}
              opacity={0.45}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </GlassCard>
  );
}

/* ────────────────────────────────────────── */
/*  Widget 3b — Donut Chart (Status Tugas)    */
/* ────────────────────────────────────────── */

function TaskDistributionChart() {
  const total = taskDistributionData.reduce((acc, d) => acc + d.value, 0);

  return (
    <GlassCard>
      <CardHeader className="px-5 pt-5 pb-2">
        <CardTitle className="text-sm font-semibold">
          Distribusi Status Tugas
        </CardTitle>
        <CardDescription className="text-xs">
          {total} total tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-5">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={taskDistributionData}
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {taskDistributionData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--color-popover)",
                color: "var(--color-popover-foreground)",
                fontSize: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              }}
              formatter={(value) => [`${value} tugas`, "Jumlah"]}
            />
            <Legend
              wrapperStyle={{
                fontSize: "11px",
                color: "var(--color-muted-foreground)",
              }}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Mini stat summary */}
        <div className="mt-2 grid grid-cols-2 gap-2 px-3">
          {taskDistributionData.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2 text-[11px] text-muted-foreground"
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate">{item.name}</span>
              <span className="ml-auto font-medium text-foreground/80">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </GlassCard>
  );
}

/* ────────────────────────────────────────── */
/*  Widget 4 — Billing / Subscription         */
/* ────────────────────────────────────────── */

function BillingWidget() {
  return (
    <GlassCard>
      <CardHeader className="px-5 pt-5 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            Langganan & Tagihan
          </CardTitle>
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCard className="size-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-5 pb-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Paket</span>
            <span className="text-sm font-semibold">Pro Tier — Yearly</span>
          </div>
          <Separator className="opacity-50" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Tanggal Perpanjangan
            </span>
            <span className="text-sm font-medium">15 Des 2025</span>
          </div>
          <Separator className="opacity-50" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Pengeluaran Bulanan
            </span>
            <span className="text-sm font-semibold text-primary">
              Rp 2.450.000
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-primary/[0.04] p-3 ring-1 ring-primary/10">
          <Banknote className="size-4 shrink-0 text-primary" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Upgrade ke Enterprise untuk unlimited seats, priority support, dan
            audit log.
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full gap-1.5 rounded-xl text-xs font-medium"
        >
          Upgrade Plan
          <ArrowUpRight className="size-3.5" />
        </Button>
      </CardContent>
    </GlassCard>
  );
}

/* ────────────────────────────────────────── */
/*  Widget 5 — Pending Approvals              */
/* ────────────────────────────────────────── */

function PendingApprovalsWidget() {
  const typeIcon = (type: PendingApproval["type"]) => {
    switch (type) {
      case "cuti":
        return <CalendarCheck className="size-3.5 text-primary" />;
      case "wfh":
        return <Loader2 className="size-3.5 text-warning" />;
      case "budget":
        return <Banknote className="size-3.5 text-destructive" />;
      case "invitation":
        return <Users className="size-3.5 text-info" />;
    }
  };

  const typeLabel = (type: PendingApproval["type"]) => {
    switch (type) {
      case "cuti":
        return "Cuti";
      case "wfh":
        return "WFH";
      case "budget":
        return "Budget";
      case "invitation":
        return "Undangan";
    }
  };

  return (
    <GlassCard>
      <CardHeader className="px-5 pt-5 pb-3">
        <CardTitle className="text-sm font-semibold">
          Persetujuan Tertunda
        </CardTitle>
        <CardDescription className="text-xs">
          {pendingApprovals.length} permintaan menunggu keputusan Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 px-5 pb-5">
        {pendingApprovals.map((item) => (
          <div
            key={item.id}
            className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/50"
          >
            <Avatar className="size-8 shrink-0 rounded-lg">
              <AvatarFallback className="rounded-lg bg-primary/10 text-[11px] font-medium text-primary">
                {item.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-foreground/90">
                  {item.user}
                </span>
                <Badge
                  variant="outline"
                  className="rounded-full px-1.5 py-0 text-[9px] font-normal"
                >
                  {typeIcon(item.type)}
                  <span className="ml-0.5">{typeLabel(item.type)}</span>
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {item.description}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                {item.timeAgo}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="size-7 rounded-lg p-0 text-success hover:bg-success/10 hover:text-success"
              >
                <CheckCircle2 className="size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="size-7 rounded-lg p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <XCircle className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </GlassCard>
  );
}

/* ────────────────────────────────────────── */
/*  Widget 6 — Live Activity Feed             */
/* ────────────────────────────────────────── */

function ActivityFeedWidget() {
  return (
    <GlassCard>
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">
              Aktivitas Perusahaan
            </CardTitle>
            <CardDescription className="text-xs">
              Feed real-time aktivitas tim
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1">
            <span className="size-1.5 animate-pulse rounded-full bg-success" />
            <span className="text-[10px] font-medium text-success">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="max-h-[340px] space-y-1 overflow-y-auto px-5 pb-5">
        {activityLogs.map((log, idx) => (
          <div key={log.id} className="relative">
            <div className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/30">
              {/* Timeline dot */}
              {idx < activityLogs.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border/50" />
              )}
              <Avatar className="size-8 shrink-0 rounded-lg ring-1 ring-border/30">
                <AvatarFallback className="rounded-lg bg-muted text-[10px] font-medium text-muted-foreground">
                  {log.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-foreground/85">
                  <span className="font-medium text-foreground">
                    {log.user}
                  </span>{" "}
                  {log.action}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                  {log.timeAgo}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </GlassCard>
  );
}

/* ────────────────────────────────────────── */
/*  Main Export — OwnerDashboardSection       */
/* ────────────────────────────────────────── */

interface OwnerDashboardSectionProps {
  gridRef: React.RefObject<HTMLDivElement | null>;
}

export default function OwnerDashboardSection({
  gridRef,
}: OwnerDashboardSectionProps) {
  return (
    <section className="w-full min-h-screen pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ringkasan eksekutif perusahaan Anda — real-time, berbasis data.
        </p>
      </div>

      {/* Bento Grid */}
      <div
        ref={gridRef}
        className="mx-auto grid max-w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Row 1 — KPI Cards (4 cols) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-4">
          <KpiCards />
        </div>

        {/* Row 2 — AI Insights Banner (full width) */}
        <div className="lg:col-span-4" data-stagger-item>
          <AiInsightsBanner />
        </div>

        {/* Row 3 — Charts (3:1 split) */}
        <div className="lg:col-span-3 lg:row-span-1" data-stagger-item>
          <ProductivityChart />
        </div>
        <div className="lg:col-span-1" data-stagger-item>
          <TaskDistributionChart />
        </div>

        {/* Row 4 — Billing + Approvals (1.5:2.5 split visually) */}
        <div className="lg:col-span-1" data-stagger-item>
          <BillingWidget />
        </div>
        <div className="lg:col-span-3" data-stagger-item>
          <PendingApprovalsWidget />
        </div>

        {/* Row 5 — Activity Feed (full width) */}
        <div className="lg:col-span-4" data-stagger-item>
          <ActivityFeedWidget />
        </div>
      </div>
    </section>
  );
}
