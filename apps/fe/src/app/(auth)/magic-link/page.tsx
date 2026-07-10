import { Suspense } from "react";
import MagicLinkContainer from "./_container/magic-link";

type MagicLinkPageProps = {
  params: Promise<{ token: string }>;
};
export default async function MagicLink({ params }: MagicLinkPageProps) {
  const { token } = await params;
  return (
    <Suspense>
      <MagicLinkContainer token={token} />
    </Suspense>
  );
}
