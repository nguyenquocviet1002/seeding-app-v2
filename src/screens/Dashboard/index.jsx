import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { tokenName } from '../../utils/config';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import DefaultLayout from '../../layout/DefaultLayout';
import { useQuery } from '@tanstack/react-query';
import { getNameFn } from '../../api/user';

const ScreenDashboard = ({ showToast }) => {
  const [token] = useLocalStorage(tokenName, null);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    code_seeding: '',
    kpi_month: 0,
    kpi_now: 0,
    rule: '',
    username: '',
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  });

  useQuery({
    queryKey: ['get-name', token],
    queryFn: () => getNameFn(token),
    onSuccess: (data) => {
      if (data.data.type === 'access_token') {
        showToast(data.data.message, 'failure');
        navigate('/login');
        localStorage.clear();
      } else if (data.data.type === 'access_token_not_found') {
        showToast(data.data.message, 'failure');
        navigate('/login');
        localStorage.clear();
      } else {
        setUser(data.data.data);
      }
    },
  });

  return (
    <DefaultLayout showToast={showToast} user={user}>
      <Outlet context={showToast} />
    </DefaultLayout>
  );
};

export default ScreenDashboard;
