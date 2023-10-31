import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getTokenFn } from '@/api/auth';
import loginStyles from './Login.module.scss';

const ScreenLogin = () => {
  const navigate = useNavigate();
  const initialUser = {
    user: '',
    password: '',
  };
  const [token, setToken] = useLocalStorage('token-manage', null);
  const [user, setUser] = useState(initialUser);
  const [message, setMessage] = useState('');

  const queryLogin = useQuery({
    queryKey: ['login', user.user],
    queryFn: () => getTokenFn(user),
    enabled: false,
    onSuccess: (data) => {
      if (data.data.message && data.data.type === 'missing error') {
        setMessage('Tài khoản hoặc mật khẩu không được để trống');
      } else if (data.data.message && data.data.type === 'Access denied') {
        setMessage('Tài khoản hoặc mật khẩu sai');
      } else if (data.data.type === 'Access Success' && data.data.active === false) {
        setMessage('Tài khoản đã bị vô hiệu hóa');
      } else {
        setToken(data.data.access_token);
        setUser(initialUser);
        navigate('/form');
      }
    },
  });

  const handleChange = (name) => (event) => {
    setUser((prev) => ({ ...prev, [name]: event.target.value }));
  };
  const handleSubmit = () => {
    if (!user.user || !user.password) {
      setMessage('Số điện thoại và mật khẩu không được để trống');
    } else {
      queryLogin.refetch();
    }
  };
  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div className={loginStyles['login']}>
      <div className={loginStyles['login__box']}>
        <div className={loginStyles['login__right']}>
          <img width={180} height={95} src={`${process.env.PUBLIC_URL}/images/logo.svg`} alt="" />
        </div>
        <div className={loginStyles['login__left']}>
          <div className={loginStyles['login__title']}>Quản trị</div>
          {message && <p className={loginStyles['login__message']}>{message}</p>}
          <div className={loginStyles['login__group']}>
            <label>Số điện thoại</label>
            <input
              type="text"
              className={message ? loginStyles['login__error'] : ''}
              value={user.user}
              onChange={handleChange('user')}
              onKeyDown={(e) => (e.key === 'Enter' ? handleSubmit() : '')}
            />
          </div>
          <div className={loginStyles['login__group']}>
            <label>Mật khẩu</label>
            <input
              type="password"
              className={message ? loginStyles['login__error'] : ''}
              value={user.password}
              onChange={handleChange('password')}
              onKeyDown={(e) => (e.key === 'Enter' ? handleSubmit() : '')}
            />
          </div>
          <button className={loginStyles['login__btn']} onClick={() => handleSubmit()}>
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScreenLogin;
