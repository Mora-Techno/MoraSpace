import type { IAuth } from './auth.types';

export type CompanyRole = 'Owner' | 'Admin' | 'Member';
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';

export interface ICompany {
  id: string;
  name: string;
  tier: SubscriptionTier;
  billingCycle: BillingCycle;
  subscriptionStartsAt: Date;
  subscriptionEndsAt: Date | null;
  leaderId: string;
  stripeCustomerId: string | null;
  xenditCustomerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type PickRegisterCompany = Pick<IAuth, 'email' | 'fullName' | 'password'> &
  Partial<Pick<ICompany, 'tier'>> & {
    companyName: string;
  };

export type { PickCreateAdmin } from './auth.types';

export type PickUpdateCompanySubscription = Pick<ICompany, 'tier' | 'billingCycle'>;

export type CompanyParams = Pick<ICompany, 'id'>;

export type SafeUser = Pick<
  IAuth,
  'id' | 'email' | 'fullName' | 'companyRole' | 'companyId' | 'createdAt' | 'updatedAt'
>;

export interface CompanyProfile
  extends Pick<
    ICompany,
    | 'id'
    | 'name'
    | 'tier'
    | 'billingCycle'
    | 'subscriptionStartsAt'
    | 'subscriptionEndsAt'
    | 'leaderId'
    | 'createdAt'
    | 'updatedAt'
  > {
  maxWorkstationUsers: number;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  companyRole: CompanyRole;
  companyId: string | null;
  createdAt: string;
  updatedAt: string;
}
