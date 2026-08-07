import { setAuthErrorHandler, setTokenProvider } from "@repo/services";
import ApiServicePackage from "@repo/services";
import { clearAuthSession, loadAuthSession } from "@/utils/storage";

if (typeof window !== "undefined") {
  setTokenProvider(() => loadAuthSession()?.accessToken);
  setAuthErrorHandler(() => {
    clearAuthSession();
    const currentPath = window.location.pathname;
    if (!currentPath.startsWith("/login")) {
      window.location.href = "/login";
    }
  });
}

const Api = {
  Auth: ApiServicePackage.Auth,
  Session: ApiServicePackage.Session,
  Todo: ApiServicePackage.Todo,
  Note: ApiServicePackage.Note,
  Calendar: ApiServicePackage.Calendar,
  Calender: ApiServicePackage.Calender,
  Music: ApiServicePackage.Music,
  Notification: ApiServicePackage.Notification,
  Settings: ApiServicePackage.Setting,
  Company: ApiServicePackage.Company,
  Subscription: ApiServicePackage.Subscription,
  Department: ApiServicePackage.Department,
  Team: ApiServicePackage.Team,
  Position: ApiServicePackage.Position,
  Member: ApiServicePackage.Member,
  Invitation: ApiServicePackage.Invitation,
  Role: ApiServicePackage.Role,
  Task: ApiServicePackage.Task,
  Pomodoro: ApiServicePackage.Pomodoro,
  System: ApiServicePackage.System,
  TrackCatalog: ApiServicePackage.TrackCatalog,
} as const;

export default Api;
