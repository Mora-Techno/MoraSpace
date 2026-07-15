import { useAuth } from './auth/useAuth';
import { useCalender } from './calendar/useCalender';
import { useCompany } from './company/useCompany';
import { useDepartment } from './department/useDepartment';
import { useInvitation } from './invitation/useInvitation';
import { useMember } from './member/useMember';
import { useMusic } from './music/useMusic';
import { useNotess } from './note/useNotes';
import { useNotification } from './notification/useNotification';
import { usePomodoro } from './pomodoro/usePomodoro';
import { usePosition } from './position/usePosition';
import { useRole } from './role/useRole';
import { useSession } from './session/useSession';
import { useSettings } from './settings/useSettings';
import { useSubscription } from './subscription/useSubscription';
import { useTask } from './task/useTask';
import { useTeam } from './team/useTeam';
import { useTodo } from './todo/useTodos';

export function useApi() {
  return {
    auth: useAuth(),
    music: useMusic(),
    calender: useCalender(),
    note: useNotess(),
    notification: useNotification(),
    todo: useTodo(),
    subcription: useSubscription(),
    company: useCompany(),
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
  };
}
