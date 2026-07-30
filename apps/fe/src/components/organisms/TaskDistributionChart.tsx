"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms";
import { GlassCard } from "@/components/molecules/GlassCard";

interface TaskDistribution {
  name: string;
  value: number;
  color: string;
}

const taskDistributionData: TaskDistribution[] = [
  { name: "Selesai", value: 142, color: "var(--color-success, #7DAF74)" },
  { name: "Berjalan", value: 89, color: "var(--color-info, #AEC6CF)" },
  { name: "Review", value: 34, color: "var(--color-warning, #F2C94C)" },
  { name: "Terblokir", value: 12, color: "var(--color-destructive, #D97757)" },
];

export function TaskDistributionChart() {
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
