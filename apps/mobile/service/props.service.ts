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
} as const;

export { Api };
export default Api;
