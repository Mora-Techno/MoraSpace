import { WrapApi } from "../utils/wrapApi";
import authService from "./auth.service";
import calendarService from "./calendar.service";
import companyService from "./company.service";
import musicService from "./music.service";
import noteService from "./note.service";
import notificationService from "./notification.service";
import sessionService from "./session.service";
import settingsService from "./settings.service";
import subscriptionService from "./subscription.service";
import todoService from "./todo.service";
import workstationService from "./workstation.service";

class ApiServicePackage {
  static Auth = WrapApi(authService);
  static Session = WrapApi(sessionService);
  static Note = WrapApi(noteService);
  static Calender = WrapApi(calendarService);
  static Company = WrapApi(companyService);
  static Music = WrapApi(musicService);
  static Notification = WrapApi(notificationService);
  static Setting = WrapApi(settingsService);
  static Subscription = WrapApi(subscriptionService);
  static Todo = WrapApi(todoService);
  static Workstation = WrapApi(workstationService);
}

export default ApiServicePackage;
