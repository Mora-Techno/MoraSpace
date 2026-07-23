import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { RegisterProps } from '@/types/ui';

const RegisterCard: React.FC<RegisterProps> = ({ href, icon: Icon, title }) => {
  return (
    <section
      className={`w-full border p-2 rounded-sm  bg-background/70 hover:bg-primary/10 duration-200`}
    >
      <Link href={href} className="flex justify-between items-center">
        <div className="flex items-center justify-start gap-2 ">
          {Icon && <Icon className="w-5 h-5 " />}
          <h1 className="text-sm font-semibold  ">{title}</h1>
        </div>
        <ArrowRight className="size-6" />
      </Link>
    </section>
  );
};

export default RegisterCard;
