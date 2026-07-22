import ApiServicePackage from '@repo/services';

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
  Setting: ApiServicePackage.Setting,
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
} as const;

export default Api;
