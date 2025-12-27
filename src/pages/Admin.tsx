import { useAppStore } from '@/stores/appStore';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

const Admin = () => {
  const { isAdminAuthenticated } = useAppStore();

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
};

export default Admin;
