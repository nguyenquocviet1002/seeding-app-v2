import { Outlet } from 'react-router-dom';
import DefaultLayout from '@/layout/DefaultLayout';

const ScreenDashboard = () => {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
};

export default ScreenDashboard;
