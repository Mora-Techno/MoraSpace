import { buildEndpoint } from '../config/api.config';

const mount = '/pomodoro';

export const POMODORO_ENDPOINTS = {
  START: buildEndpoint(mount, '/start'),
  PAUSE: buildEndpoint(mount, '/pause'),
  RESUME: buildEndpoint(mount, '/resume'),
  STOP: buildEndpoint(mount, '/stop'),
  TODAY: buildEndpoint(mount, '/today'),
  STATISTICS: buildEndpoint(mount, '/statistics'),
} as const;

export function listPomodoroEndpoints() {
  return Object.keys(POMODORO_ENDPOINTS).map((key) => ({
    name: key,
    path: POMODORO_ENDPOINTS[key as keyof typeof POMODORO_ENDPOINTS],
  }));
}
