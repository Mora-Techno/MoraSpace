import { useAuth } from './Auth/useAuth';
import { useCalender } from './Calendar/useCalender';
import { useMusic } from './Music/useMusic';
import { useNotess } from './Note/useNotes';
import { useNotification } from './Notification/useNotification';
import { useSubscriptions } from './Subscription/useSubscription';
import { useTodo } from './Todo/useTodo';

export function useApi() {
  return {
    auth: useAuth(),
    music: useMusic(),
    calender: useCalender(),
    note: useNotess(),
    notification: useNotification(),
    todo: useTodo(),
    subscription: useSubscriptions(),
  };
}
