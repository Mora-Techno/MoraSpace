import ApiServicePackage from '@repo/services';

const Api = {
  Auth: ApiServicePackage.Auth,
  Session: ApiServicePackage.Session,
  Todo: ApiServicePackage.Todo,
  Note: ApiServicePackage.Note,
  Calendar: ApiServicePackage.Calender,
  Calender: ApiServicePackage.Calender,
  Music: ApiServicePackage.Music,
  Notification: ApiServicePackage.Notification,
  Setting: ApiServicePackage.Setting,
  Settings: ApiServicePackage.Setting,
  Company: ApiServicePackage.Company,
  Workstation: ApiServicePackage.Workstation,
  Subscription: ApiServicePackage.Subscription,
  Department: ApiServicePackage.Department,
  Team: ApiServicePackage.Team,
  Position: ApiServicePackage.Position,
  Member: ApiServicePackage.Member,
  Invitation: ApiServicePackage.Invitation,
  Role: ApiServicePackage.Role,
  Task: ApiServicePackage.Task,
  Pomodoro: ApiServicePackage.Pomodoro,
} as const;

export { Api };
export default Api;
