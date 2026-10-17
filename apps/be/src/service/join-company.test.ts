import { describe, expect, it } from 'bun:test';
import { generateInviteCode } from '@/utils/inviteCodeHelper';
import { getWorkstationUserLimit } from '@/utils/tierLimits';

describe('Company Join Code & Verification Tests', () => {
  it('generateInviteCode: should generate 8-character uppercase alphanumeric string without ambiguous characters', () => {
    const code = generateInviteCode(8);
    expect(code).toBeDefined();
    expect(code.length).toBe(8);
    expect(/^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{8}$/.test(code)).toBe(true);
    // Must not contain 0, O, 1, I, L
    expect(code).not.toContain('0');
    expect(code).not.toContain('O');
    expect(code).not.toContain('1');
    expect(code).not.toContain('I');
    expect(code).not.toContain('L');
  });

  it('generateInviteCode: consecutive codes should be unique and distinct', () => {
    const code1 = generateInviteCode();
    const code2 = generateInviteCode();
    expect(code1).not.toBe(code2);
  });

  it('Tier seat limit: should correctly enforce max members for free/pro/enterprise tiers', () => {
    expect(getWorkstationUserLimit('free')).toBe(4);
    expect(getWorkstationUserLimit('pro')).toBe(8);
    expect(getWorkstationUserLimit('enterprise')).toBe(16);
  });
});
