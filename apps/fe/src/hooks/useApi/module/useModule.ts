import { useCreateModule, useDeleteModule, useUpdateModule } from './state/mutate';
import { useModule as useModuleQuery, useModules } from './state/query';

export const useModule = () => {
  return {
    mutate: {
      create: useCreateModule,
      update: useUpdateModule,
      delete: useDeleteModule,
    },
    query: {
      get: useModules,
      getByID: useModuleQuery,
    },
  };
};
