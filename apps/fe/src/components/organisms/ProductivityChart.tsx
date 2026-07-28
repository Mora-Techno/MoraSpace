"use client";

import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms";
import { GlassCard } from "@/components/molecules/GlassCard";

interface DepartmentProductivity {
  name: string;
  completed: number;
  pending: number;
}

const departmentData: DepartmentProductivity[] = [
  { name: "Engineering", completed: 84, pending: 12 },
  { name: "Product", completed: 52, pending: 18 },
  { name: "Marketing", completed: 38, pending: 24 },
  { name: "HR", completed: 26, pending: 8 },
  { name: "Finance", completed: 31, pending: 6 },
];

export function ProductivityChart() {
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
