import { GhibliCard } from "@/components/molecules";
import { ActionButton, DecoratedInput } from "@/components/wrapper";
import { PickSendMagicLink } from "@repo/types";
import Link from "next/link";
import Image from "next/image";

interface ForgotPasswordSectionProps {
  service: {
    onForgotPassword: (e: React.FormEvent) => void;
    isPending: boolean;
  };
  state: {
    formSendMagicLink: PickSendMagicLink;
    setFormSendMagicLink: React.Dispatch<
      React.SetStateAction<PickSendMagicLink>
    >;
  };
}
const ForgotPasswordSection: React.FC<ForgotPasswordSectionProps> = ({
  service,
  state,
}) => {
  const { formSendMagicLink, setFormSendMagicLink } = state;
  const { onForgotPassword, isPending } = service;
  return (
    <section className="w-full min-h-screen flex justify-center items-center">
      <form
        onSubmit={onForgotPassword}
        className="w-full flex justify-center items-center"
      >
        <GhibliCard hover={false} className="w-full max-w-md">
          <div className="w-full flex justify-center items-center">
            <Image
              src={"/images/logo.png"}
              alt="logo"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          <div className="w-full flex justify-center items-center">
            <h1 className="font-2xl font-semibold">Lupa Kata Sandi</h1>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email:
            </label>
            <DecoratedInput
              id="email"
              type="email"
              value={formSendMagicLink.email}
              onChange={(e) =>
                setFormSendMagicLink((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              required
              placeholder="nama@email.com"
            />
          </div>
          <ActionButton type="submit" className=" w-full" disabled={isPending}>
            {isPending ? "Memproses..." : "Kirim"}
          </ActionButton>
          <Link
            href={"/login"}
            className="font-medium text-sm text-muted-foreground hover:text-background"
          >
            Kembali
          </Link>
        </GhibliCard>
      </form>
    </section>
  );
};

export default ForgotPasswordSection;
