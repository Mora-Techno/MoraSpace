import { GhibliEmptyState } from '@/components/molecules';

interface DashboardMemberSectionProps {
  template: {
    title: string;
    message: string;
  };
}
const DashboardMemberSection: React.FC<DashboardMemberSectionProps> = ({ template }) => {
  return <GhibliEmptyState title={template.title} description={template.message} />;
};

export default DashboardMemberSection;
