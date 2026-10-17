import { Suspense } from 'react';

import JoinCompanyContainer from './_container/join';

export default function JoinCompanyPage() {
  return (
    <Suspense fallback={null}>
      <JoinCompanyContainer />
    </Suspense>
  );
}
