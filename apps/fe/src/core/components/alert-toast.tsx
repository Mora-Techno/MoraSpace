import { gooeyToast } from '@/components/atoms/GoeyToaster';
import type { ToastProps } from '@/types/ui';

const TOAST_DURATION = 4000;

export function showAlertToast({ title, message, icon, onVoid, action, duration }: ToastProps) {
  const content = title || message;
  const description = message && message !== title ? message : undefined;

  const options = {
    description,
    duration: duration ?? TOAST_DURATION,
    onDismiss: onVoid ? () => onVoid() : undefined,
    ...(action
      ? {
          action: {
            label: action.label,
            onClick: action.onClick,
            successLabel: action.successLabel,
          },
        }
      : {}),
  };

  switch (icon) {
    case 'success':
      gooeyToast.success(content, options);
      break;
    case 'error':
      gooeyToast.error(content, options);
      break;
    case 'warning':
      gooeyToast.warning(content, options);
      break;
    case 'question':
      gooeyToast(content, options);
      break;
    case 'info':
    default:
      gooeyToast.info(content, options);
      break;
  }
}
