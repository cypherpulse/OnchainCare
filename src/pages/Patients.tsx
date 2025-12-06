import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DoctorPatients } from '@/components/doctor/DoctorPatients';

const Patients = () => (
  <DashboardLayout>
    <DoctorPatients />
  </DashboardLayout>
);

export default Patients;
