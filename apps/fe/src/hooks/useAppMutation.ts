'use client';

import { createAppMutationHook } from '@repo';
import { type AppNameSpace, useAppNameSpace } from '@/hooks/useAppNameSpace';

export const useAppMutation = createAppMutationHook<AppNameSpace>(useAppNameSpace);
export type { AppMutationConfig } from '@repo';
