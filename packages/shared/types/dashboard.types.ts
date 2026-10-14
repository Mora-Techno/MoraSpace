export interface DashboardTaskStatusSlice {
  name: string;
  color: string | null;
  count: number;
}

export interface DashboardActivityItem {
  id: string;
  action: string;
  actorName: string;
  taskTitle: string;
  createdAt: string;
}

export interface OwnerDashboardOverview {
  members: {
    total: number;
    active: number;
    maxMembers: number | null;
  };
  tasks: {
    total: number;
    active: number;
    overdue: number;
    completed: number;
    doneRate: number;
    byStatus: DashboardTaskStatusSlice[];
  };
  deepWorkMinutes: number;
  plan: {
    tier: string;
    status: string;
    renewsAt: string | null;
  } | null;
  recentActivity: DashboardActivityItem[];
}
