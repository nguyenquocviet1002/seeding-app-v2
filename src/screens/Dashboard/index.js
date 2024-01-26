import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { tokenName } from '@/utils/config';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import DefaultLayout from '@/layout/DefaultLayout';

const ScreenDashboard = ({ showToast }) => {
  const [token] = useLocalStorage(tokenName, null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  });
  return (
    token && (
      <DefaultLayout showToast={showToast}>
        <Outlet context={showToast} />
      </DefaultLayout>
    )
  );
};

export default ScreenDashboard;
