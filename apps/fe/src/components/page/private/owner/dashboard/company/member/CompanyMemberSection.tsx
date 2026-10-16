import { AdminUser, PickCreateAdmin } from '@repo';
import type { WorkingStatus } from '@repo/types';
import { Plus, Users } from 'lucide-react';
import { useState } from 'react';

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '@/components/atoms';
import { AdminRow } from '@/components/molecules/AdminRow';
import { MemberRow } from '@/components/molecules/MemberRow';
import { PageHeader } from '@/components/molecules/PageHeader';
import { DecoratedInput } from '@/components/wrapper';
import { AlertContexType } from '@/types/ui';

interface OwnerCompanyMemberSectionProps {
  template: {
    title: string;
    description: string;
  };
  service: {
    isPending: boolean;
    isLoading: boolean;
    member: AdminUser[];
    handleUpdateStatus?: (id: string, status: string) => void;
    handleDeleteMember?: (id: string) => void;
    handleInvite?: (email: string) => void;
    isInvitePending?: boolean;
    statusByKey?: Record<string, { status: WorkingStatus; statusLabel: string }>;
  };
  state: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    alert: AlertContexType;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  };
}
const OwnerCompanyMemberSection: React.FC<OwnerCompanyMemberSectionProps> = ({
  template,
  service,
  state,
}) => {
  const { description, title } = template;
  const {
    isLoading,
    isPending,
    member,
    handleDeleteMember,
    handleUpdateStatus,
    handleInvite,
    isInvitePending,
    statusByKey,
  } = service;
  const { open, setOpen, alert, searchTerm, setSearchTerm } = state;
  const [inviteEmail, setInviteEmail] = useState('');

  const submitInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || isInvitePending) return;
    handleInvite?.(inviteEmail.trim());
  };
  return (
    <div className="w-full space-y-6">
      <PageHeader
        title={title}
        description={description}
        action={
          <Dialog
            open={open}
            onOpenChange={(v) => {
              if (!v) setInviteEmail('');
              setOpen(v);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" />
                Tambah Anggota
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Anggota Baru</DialogTitle>
                <DialogDescription>Undang anggota baru ke perusahaan Anda.</DialogDescription>
              </DialogHeader>
              <form onSubmit={submitInvite} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteEmail">Email</Label>
                  <Input
                    id="inviteEmail"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={inviteEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setInviteEmail(e.target.value)
                    }
                    disabled={isInvitePending}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isInvitePending}>
                    {isInvitePending ? 'Mengirim...' : 'Kirim Undangan'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardHeader>
          <CardAction>
            <Users className="size-8 text-primary" />
          </CardAction>
          <CardTitle className="text-lg">Daftar Anggota</CardTitle>
          <CardDescription>Total {member.length} anggota terdaftar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <DecoratedInput
            placeholder="Cari Username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isLoading ? (
            <phantom-ui loading animation="pulse" count={3} count-gap={12} reveal={0.3}>
              <AdminRow />
            </phantom-ui>
          ) : member.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Belum ada admin. Tambahkan admin pertama Anda.
            </div>
          ) : (
            <div className="space-y-3">
              {member.map((user) => (
                <MemberRow
                  key={user.id}
                  user={user as any}
                  alert={alert}
                  onUpdateStatus={(status: string) => handleUpdateStatus?.(user.id, status)}
                  onDelete={() => handleDeleteMember?.(user.id)}
                  isPending={isPending}
                  workingStatus={statusByKey?.[(user as any).id]}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerCompanyMemberSection;
