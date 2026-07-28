import {
  Banknote,
  CalendarCheck,
  CheckCircle2,
  Loader2,
  Users,
  XCircle,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms";
import { GlassCard } from "@/components/molecules/GlassCard";

interface PendingApproval {
  id: string;
  type: "cuti" | "wfh" | "budget" | "invitation";
  user: string;
  initials: string;
  description: string;
  timeAgo: string;
}

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

export function PendingApprovalsWidget() {
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
