import { buildEndpoint } from '../config/api.config';

const mount = '/chat';

export const CHAT_ENDPOINTS = {
  CONVERSATIONS: buildEndpoint(mount, '/conversations'),
  DIRECT: buildEndpoint(mount, '/direct'),
  GROUPS: buildEndpoint(mount, '/groups'),
  MESSAGES: (id: string) => buildEndpoint(mount, `/conversations/${id}/messages`),
  MEMBERS: (id: string) => buildEndpoint(mount, `/conversations/${id}/members`),
  MEMBER_BY_ID: (id: string, userId: string) =>
    buildEndpoint(mount, `/conversations/${id}/members/${userId}`),
  GROUP_BY_ID: (id: string) => buildEndpoint(mount, `/groups/${id}`),
  LEAVE: (id: string) => buildEndpoint(mount, `/conversations/${id}/leave`),
  TRANSFER: (id: string) => buildEndpoint(mount, `/conversations/${id}/transfer`),
  USERS_SEARCH: buildEndpoint(mount, '/users/search'),
} as const;

export function listChatEndpoints() {
  return Object.keys(CHAT_ENDPOINTS).map((key) => ({
    name: key,
    path: CHAT_ENDPOINTS[key as keyof typeof CHAT_ENDPOINTS],
  }));
}
