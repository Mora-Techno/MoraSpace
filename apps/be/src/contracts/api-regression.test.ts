import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { createHmac } from 'node:crypto';
import jwt from 'jsonwebtoken';

const secret = 'local-contract-test-only';
process.env.JWT_SECRET = secret;
process.env.INTERNAL_API_SECRET = 'local-internal-key';
process.env.STRIPE_SECRET_KEY = 'sk_test_contract_only';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_contract_only';
process.env.XENDIT_WEBHOOK_TOKEN = 'xendit-contract-only';

const sessions = new Map<string, string>();
const db = {
  userSession: {
    findFirst: mock(async ({ where }: any) => sessions.get(where.accessToken) === where.userId ? { id: 'session' } : null),
    deleteMany: mock(async ({ where }: any) => {
      for (const [token, userId] of sessions) if (userId === where.userId) sessions.delete(token);
      return { count: 1 };
    }),
  },
  refreshToken: { updateMany: mock(async () => ({ count: 1 })) },
  userSetting: { upsert: mock(async ({ create }: any) => ({ id: 'settings', ...create })) },
  team: { findFirst: mock(async () => null) },
  pomodoroSession: {
    findFirst: mock(async (_query: any) => null),
    create: mock(async ({ data }: any) => ({ id: 'pomodoro', ...data })),
  },
  taskStatus: { findMany: mock(async (_query: any) => []) },
  taskPriority: { findMany: mock(async (_query: any) => []) },
  employmentType: { findMany: mock(async (_query: any) => []) },
  $transaction: async (operations: Promise<unknown>[]) => Promise.all(operations),
};
mock.module('prisma/client', () => ({ default: db }));
mock.module('@/config/env.config', () => ({ env: { JWT_SECRET: secret } }));
mock.module('@/utils/logger.utils', () => ({ logger: { info() {}, debug() {}, error() {} } }));

const { default: app } = await import('@/routes/apiRoutes');
const { default: SubscriptionService } = await import('@/service/SubscriptionService');
const { default: SettingsService } = await import('@/service/SettingsService');
const { default: TeamService } = await import('@/service/TeamService');
const { default: PomodoroService } = await import('@/service/PomodoroService');
const { default: SessionService } = await import('@/service/SessionService');
const { signAccessToken } = await import('@/utils/authTokens');
const { HttpResponse } = await import('@/http');
const { toServiceResponse } = await import('../../../../packages/shared/services/service-response');
const { MUSIC_ENDPOINTS } = await import('../../../../packages/shared/endpoints/music.endpoints');

const companyId = '11111111-1111-4111-8111-111111111111';
const memberId = '22222222-2222-4222-8222-222222222222';
const teamId = '33333333-3333-4333-8333-333333333333';
const user = { id: 'contract-user', email: 'contract@example.com', fullName: 'Contract User',
  companyId, companyMemberId: memberId, companyRole: 'Owner', platformRole: 'USER' };
let token: string;

beforeEach(() => {
  sessions.clear();
  token = jwt.sign(user, secret, { expiresIn: '15m' });
  sessions.set(token, user.id);
  for (const model of Object.values(db)) {
    if (typeof model === 'object') for (const fn of Object.values(model)) fn.mockClear();
  }
});
afterEach(() => mock.restore());

function request(path: string, method = 'GET', body?: unknown, options: { token?: string | null; key?: boolean; headers?: Record<string, string> } = {}) {
  const auth = options.token === undefined ? token : options.token;
  return app.handle(new Request(`http://localhost/api/v1${path}`, {
    method,
    headers: {
      ...(options.key === false ? {} : { 'x-internal-api-key': 'local-internal-key' }),
      ...(auth ? { authorization: `Bearer ${auth}` } : {}),
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      ...options.headers,
    },
    ...(body === undefined ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) }),
  }));
}

describe('Authentication and subscription contracts', () => {
  it('requires a token for subscription profile', async () => {
    expect((await request('/subscriptions/me', 'GET', undefined, { token: null })).status).toBe(401);
  });

  it('populates the company context before loading a subscription and reports request timing', async () => {
    const service = spyOn(SubscriptionService, 'getDetail').mockImplementation(async () => {
      await Bun.sleep(8);
      return { company: { id: companyId } } as any;
    });
    const response = await request('/subscriptions/me');
    expect(response.status).toBe(200);
    expect(service).toHaveBeenCalledWith(companyId);
    const body = await response.json() as any;
    expect(parseInt(body.meta.process_time, 10)).toBeGreaterThan(0);
  });

  it('accepts billingCycle and invokes checkout with the authenticated company', async () => {
    const service = spyOn(SubscriptionService, 'createCheckout').mockResolvedValue({ checkoutUrl: null } as any);
    const body = { tier: 'free', billingCycle: 'monthly', provider: 'stripe' };
    expect((await request('/subscriptions/checkout', 'POST', body)).status).toBe(200);
    expect(service).toHaveBeenCalledWith(companyId, { email: user.email, fullName: user.fullName }, body);
  });

  it('rejects the old interval payload', async () => {
    const response = await request('/subscriptions/checkout', 'POST', { tier: 'pro', interval: 'monthly', provider: 'stripe' });
    expect(response.status).toBe(422);
    expect((await response.json() as any).status).toBe(422);
  });

  it('rejects non-owners before canceling a subscription', async () => {
    const memberToken = jwt.sign({ ...user, companyRole: 'Member' }, secret);
    sessions.set(memberToken, user.id);
    const service = spyOn(SubscriptionService, 'cancelSubscription');
    expect((await request('/subscriptions/cancel', 'POST', undefined, { token: memberToken })).status).toBe(403);
    expect(service).not.toHaveBeenCalled();
  });

  it('rejects a signed JWT after its session is revoked', async () => {
    sessions.delete(token);
    expect((await request('/subscriptions/me')).status).toBe(401);
  });

  it('logout invalidates access to protected endpoints immediately', async () => {
    const prisma = db as any;
    prisma.user = { findUnique: mock(async () => ({ id: user.id })) };
    expect((await request('/auth/logout', 'POST')).status).toBe(200);
    expect(sessions.size).toBe(0);
    expect((await request('/settings')).status).toBe(401);
    delete prisma.user;
  });

  it('issues distinct JWTs even for the same user within one second', () => {
    expect(signAccessToken(user as any)).not.toBe(signAccessToken(user as any));
  });

  it('keeps the internal key mandatory outside provider webhook routes', async () => {
    expect((await request('/subscriptions/plans', 'GET', undefined, { key: false })).status).toBe(401);
  });
});

describe('Provider webhooks', () => {
  it('verifies the exact Stripe JSON bytes without an internal API key', async () => {
    const payload = '{ "type": "invoice.created", "data": { "object": {} } }';
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHmac('sha256', 'whsec_contract_only').update(`${timestamp}.${payload}`).digest('hex');
    const response = await request('/subscriptions/webhooks/stripe', 'POST', payload, {
      token: null, key: false, headers: { 'stripe-signature': `t=${timestamp},v1=${signature}` },
    });
    expect(response.status).toBe(200);
    expect((await response.json() as any).data.received).toBe(true);
  });

  it('rejects an unsigned Stripe webhook', async () => {
    spyOn(console, 'error').mockImplementation(() => {});
    expect((await request('/subscriptions/webhooks/stripe', 'POST', { type: 'invoice.created' }, { key: false, token: null })).status).toBe(400);
  });

  it('accepts Xendit with its callback token alone', async () => {
    const response = await request('/subscriptions/webhooks/xendit', 'POST', { status: 'PENDING' }, {
      key: false, token: null, headers: { 'x-callback-token': 'xendit-contract-only' },
    });
    expect(response.status).toBe(200);
  });

  it('rejects Xendit without a valid callback token', async () => {
    spyOn(console, 'error').mockImplementation(() => {});
    expect((await request('/subscriptions/webhooks/xendit', 'POST', {}, { key: false, token: null })).status).toBe(400);
  });
});

describe('Settings, team and reference data', () => {
  it('authenticates mailer requests before reaching the email service', async () => {
    const service = spyOn(SettingsService, 'TestEmail').mockResolvedValue({ id: 'mail' } as any);
    expect((await request('/settings/send-mailer', 'POST', { email: user.email })).status).toBe(200);
    expect(service).toHaveBeenCalledWith({ email: user.email });
    expect((await request('/settings/send-mailer', 'POST', { email: user.email }, { token: null })).status).toBe(401);
  });

  it('updates settings for a personal account using userId', async () => {
    const personal = jwt.sign({ ...user, companyId: null, companyMemberId: null }, secret);
    sessions.set(personal, user.id);
    const response = await request('/settings', 'PATCH', { theme: 'dark' }, { token: personal });
    expect(response.status).toBe(200);
    expect(db.userSetting.upsert.mock.calls[0][0].where).toEqual({ userId: user.id });
    expect((await response.json() as any).data.theme).toBe('dark');
  });

  it('keeps company settings keyed by company member', async () => {
    expect((await request('/settings', 'PATCH', { theme: 'light' })).status).toBe(200);
    expect(db.userSetting.upsert.mock.calls[0][0].where).toEqual({ companyMemberId: memberId });
  });

  it('takes the team ID from the documented request body', async () => {
    const service = spyOn(TeamService, 'inviteMember').mockResolvedValue({ id: 'membership' } as any);
    const body = { teamId, email: user.email, fullName: user.fullName, role: 'Member' };
    expect((await request('/teams/inviteMember', 'POST', body)).status).toBe(200);
    expect(service).toHaveBeenCalledWith(teamId, companyId, body);
  });

  it('rejects a missing teamId before service execution', async () => {
    expect((await request('/teams/inviteMember', 'POST', { email: user.email, fullName: user.fullName })).status).toBe(422);
  });

  it('checks the team company before adding an invited member', async () => {
    await expect(TeamService.inviteMember(teamId, companyId, { email: user.email, fullName: user.fullName })).rejects.toThrow('Team tidak ditemukan');
    expect((db.team.findFirst.mock.calls[0] as any)[0].where).toEqual({ id: teamId, department: { companyId } });
  });

  it('scopes reference data to the current company', async () => {
    expect((await request('/tasks/statuses')).status).toBe(200);
    expect((await request('/tasks/priorities')).status).toBe(200);
    expect((await request('/members/employment-types')).status).toBe(200);
    for (const model of [db.taskStatus, db.taskPriority, db.employmentType]) {
      expect(model.findMany.mock.calls[0][0].where).toEqual({ companyId });
    }
  });

  it('rejects integer resource identifiers', async () => {
    expect((await request('/todos/1')).status).toBe(422);
  });
});

describe('Response and ownership regressions', () => {
  it('keeps response messages out of metadata', async () => {
    const context = { request: new Request('http://localhost', { method: 'PATCH' }), json: (body: unknown, status: number) => Response.json(body, { status }) };
    const response = HttpResponse(context as any).ok({ id: teamId }, undefined, 'Tim berhasil diperbarui')!;
    expect(await response.json()).toEqual({ status: 200, data: { id: teamId }, message: 'Tim berhasil diperbarui' });
  });

  it('preserves pagination and transport status in the shared SDK', () => {
    const response = { status: 200, message: 'OK', data: [], meta: { currentPage: 1, totalPage: 3, totalData: 21 } };
    expect(toServiceResponse(response, { statusCode: 201 })).toEqual({ ...response, statusCode: 200 });
    expect(MUSIC_ENDPOINTS.PLAYLIST_ID(teamId)).toBe(`/api/v1/music/playlists/${teamId}`);
  });

  it('persists pomodoro metadata and checks ownership when stopping by ID', async () => {
    await PomodoroService.start(null, user.id, { source: 'bruno' });
    expect(db.pomodoroSession.create.mock.calls[0][0].data.metadata).toEqual({ source: 'bruno' });
    await expect(PomodoroService.stop(memberId, user.id, teamId)).rejects.toThrow('Sesi pomodoro tidak ditemukan');
    expect(db.pomodoroSession.findFirst.mock.calls[0][0].where).toEqual({ id: teamId, companyMemberId: memberId, endedAt: null });
  });

  it('scopes session lookups and deletion to the current user', async () => {
    await SessionService.getSessionByIdService(teamId, user.id);
    expect(db.userSession.findFirst.mock.calls[0][0].where).toEqual({ id: teamId, userId: user.id });
    await SessionService.deleteSessionById(teamId, user.id);
    expect(db.userSession.deleteMany.mock.calls[0][0].where).toEqual({ id: teamId, userId: user.id });
  });
});
