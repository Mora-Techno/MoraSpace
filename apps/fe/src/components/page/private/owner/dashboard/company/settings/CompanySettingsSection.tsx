import React from "react";
import { PageHeader } from "@/components/molecules/PageHeader";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/atoms";
import { Loader2 } from "lucide-react";

interface CompanySettingsSectionProps {
  service: {
    handleSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
    isLoading: boolean;
  };
  state: {
    formUpdate: {
      logo: string;
      country: string;
    };
    setFormUpdate: React.Dispatch<
      React.SetStateAction<{
        logo: string;
        country: string;
      }>
    >;
  };
}

const CompanySettingsSection: React.FC<CompanySettingsSectionProps> = ({
  service: { handleSubmit, isPending, isLoading },
  state: { formUpdate, setFormUpdate },
}) => {
  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Company Settings"
        description="Manage your company's general settings and profile"
      />
      <Card>
        <CardHeader>
          <CardTitle>Organization Profile</CardTitle>
          <CardDescription>
            Update your organization's logo and location information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={formUpdate.logo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormUpdate((prev) => ({
                    ...prev,
                    logo: e.target.value,
                  }))
                }
                placeholder="https://example.com/logo.png"
                disabled={isPending || isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formUpdate.country}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormUpdate((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
                placeholder="Indonesia"
                disabled={isPending || isLoading}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={isPending || isLoading}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanySettingsSection;
