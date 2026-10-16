import { useAuth } from './Auth/useAuth';
import { useBlog } from './Blog/useBlog';
import { useCalender } from './Calendar/useCalender';
import { useChat } from './Chat/useChat';
import { useCompany } from './Company/useCompany';
import { useDashboard } from './Dashboard/useDashboard';
import { useDepartment } from './Department/useDepartment';
import { useInvitation } from './Invitation/useInvitation';
import { useMember } from './Member/useMember';
import { useMusic } from './Music/useMusic';
import { useNotess } from './Note/useNotes';
import { useNotification } from './Notification/useNotification';
import { usePomodoro } from './Pomodoro/usePomodoro';
import { usePosition } from './Position/usePosition';
import { useRole } from './Role/useRole';
import { useSession } from './Session/useSession';
import { useSettings } from './Settings/useSettings';
import { useSubscriptions } from './Subscription/useSubscription';
import { useTask } from './Task/useTask';
import { useTeam } from './Team/useTeam';
import { useTodo } from './Todo/useTodo';
import { useWorkingHours } from './WorkingHours/useWorkingHours';

export function useApi() {
  return {
    auth: useAuth(),
    blog: useBlog(),
    music: useMusic(),
    calender: useCalender(),
    calendar: useCalender(),
    note: useNotess(),
    notification: useNotification(),
    todo: useTodo(),
    subscription: useSubscriptions(),
    company: useCompany(),
    dashboard: useDashboard(),
    chat: useChat(),
    department: useDepartment(),
    team: useTeam(),
    position: usePosition(),
    member: useMember(),
    invitation: useInvitation(),
    role: useRole(),
    task: useTask(),
    pomodoro: usePomodoro(),
    session: useSession(),
    settings: useSettings(),
    workingHours: useWorkingHours(),
  };
}
