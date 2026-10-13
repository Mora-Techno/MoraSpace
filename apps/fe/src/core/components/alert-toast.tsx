import { toast } from '@/components/atoms/Toast';
import type { ToastProps } from '@/types/ui';

const TOAST_DURATION = 4000;

export function showAlertToast({ title, message, icon, onVoid, action, duration }: ToastProps) {
  const content = title || message;
  const description = message && message !== title ? message : undefined;

  toast.add({
    title: content,
    description,
    type: icon ?? 'info',
    timeout: duration ?? TOAST_DURATION,
    onClose: onVoid,
    actionProps: action
      ? {
          children: action.label,
          onClick: action.onClick,
        }
      : undefined,
  });
}
