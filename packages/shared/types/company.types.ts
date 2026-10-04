import type { IAuth } from './auth.types';

export type CompanyRole = 'Owner' | 'Admin' | 'Member' | 'Chief';
export type CompanyStatus = 'active' | 'suspended';
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';

export interface ICompany {
  id: string;
  name: string;
  country: string;
  currency: string;
  logo: string;
  slug: string;
  tier: SubscriptionTier;
  billingCycle: BillingCycle;
  subscriptionStartsAt: Date;
  subscriptionEndsAt: Date | null;
  leaderId: string;
  stripeCustomerId: string | null;
  xenditCustomerId: string | null;
  status: CompanyStatus;
  suspendedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type PickRegisterCompany = Pick<IAuth, 'email' | 'fullName' | 'password'> &
  Partial<Pick<ICompany, 'tier'>> & {
    companyName: string;
  };

export type { PickCreateAdmin } from './auth.types';

export type PickUpdateCompanySubscription = Pick<ICompany, 'tier' | 'billingCycle'>;

export type PickUpdateCompanyProfile = Pick<ICompany, 'logo' | 'country'>;

// v0.0.1 Working Hours (CompanySetting + CompanyPolicy, jam "HH:mm").
export interface ICompanySetting {
  workingHourStart: string;
  workingHourEnd: string;
  workDays: string;
  respectWorkingHours: boolean;
  queueNotification: boolean;
  queueEmail: boolean;
}

export interface PickUpdateCompanySettings {
  workingHourStart?: string;
  workingHourEnd?: string;
  workDays?: string;
  respectWorkingHours?: boolean;
  queueNotification?: boolean;
}

// v0.0.1 Layer 1: Super Admin ops.
export interface PickCreateCompanyAdmin {
  name: string;
  ownerEmail: string;
  ownerFullName: string;
  ownerPassword?: string;
  tier?: SubscriptionTier;
}

export interface AdminCompanyItem {
  id: string;
  name: string;
  slug: string;
  status: CompanyStatus;
  suspendedAt: string | null;
  owner: { id: string; email: string; fullName: string };
  memberCount: number;
  lastLoginAt: string | null;
  tier: SubscriptionTier;
  billingCycle: BillingCycle;
  createdAt: string;
}

export type CompanyParams = Pick<ICompany, 'id'>;

export type SafeUser = Pick<
  IAuth,
  'id' | 'email' | 'fullName' | 'companyRole' | 'companyId' | 'createdAt' | 'updatedAt'
>;

export type CompanyQuery = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
};

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

export type CompanyRespone = Omit<ICompany, ''>;
