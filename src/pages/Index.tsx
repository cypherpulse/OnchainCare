import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientDashboard } from '@/components/patient/PatientDashboard';
import { DoctorDashboard } from '@/components/doctor/DoctorDashboard';
import { useRole } from '@/contexts/RoleContext';

// Minor update: Added comment for clarity
const Index = () => {
  const { role } = useRole();

  return (
    <DashboardLayout>
      {role === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />}
    </DashboardLayout>
  );
};

export default Index;
