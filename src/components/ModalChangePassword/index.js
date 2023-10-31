import ReactDOM from 'react-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { updatePasswordFn } from '@/api/user';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal';
import Button from '../Button';
import modalChangePasswordStyles from './ModalChangePassword.module.scss';

const ModalChangePassword = ({ isShow, hide, element }) => {
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useLocalStorage('token-manage', null);
  const initialPassword = {
    password: '',
    confirmPassword: '',
    token: token,
  };
  const [password, setPassword] = useState(initialPassword);
  const [message, setMessage] = useState('');
  const [isTypeP, setIsTypeP] = useState(false);
  const [isTypeC, setIsTypeC] = useState(false);

  const navigate = useNavigate();

  const queryChangePassword = useQuery({
    queryKey: ['change-password'],
    queryFn: () => updatePasswordFn(password),
    enabled: false,
    onSuccess: (data) => {
      if (data.data.result === '<Response 77 bytes [401 UNAUTHORIZED]>') {
        alert('Lỗi hệ thống! Vui lòng đăng nhập lại');
        setToken(null);
        navigate('/login');
      } else if (data.data.result.stage === false) {
        setMessage(data.data.result.message);
      } else {
        alert(data.data.result.message.content);
        hide();
        setIsTypeP(false);
        setIsTypeC(false);
        setPassword(initialPassword);
      }
    },
  });

  const handleChange = (name) => (event) => {
    setPassword((prev) => ({ ...prev, [name]: event.target.value }));
  };
  const handleSubmit = () => {
    if (!password.password || !password.confirmPassword) {
      setMessage('Mật khẩu không được để trống');
    } else if (password.password !== password.confirmPassword) {
      setMessage('Mật khẩu không trùng khớp');
    } else {
      queryChangePassword.refetch();
    }
  };
  return isShow && element === 'ModalChangePassword'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Đổi mật khẩu" hide={hide}>
            <div>
              {message && <p className={modalChangePasswordStyles['error__msg']}>{message}</p>}
              <div className={modalChangePasswordStyles['control']}>
                <label className={modalChangePasswordStyles['label']}>Mật khẩu mới</label>
                <input
                  type={!isTypeP ? 'password' : 'text'}
                  className={
                    message
                      ? `${modalChangePasswordStyles['error']} ${modalChangePasswordStyles['input']}`
                      : modalChangePasswordStyles['input']
                  }
                  value={password.password}
                  onChange={handleChange('password')}
                  onKeyDown={(e) => (e.key === 'Enter' ? handleSubmit() : '')}
                />
                <span
                  className={modalChangePasswordStyles['change']}
                  style={{
                    backgroundImage: !isTypeP
                      ? `url(${process.env.PUBLIC_URL}/images/eye-regular.svg)`
                      : `url(${process.env.PUBLIC_URL}/images/eye-slash-regular.svg)`,
                  }}
                  onClick={() => setIsTypeP(!isTypeP)}
                ></span>
              </div>
              <div className={modalChangePasswordStyles['control']}>
                <label className={modalChangePasswordStyles['label']}>Xác nhận mật khẩu</label>
                <input
                  type={!isTypeC ? 'password' : 'text'}
                  className={
                    message
                      ? `${modalChangePasswordStyles['error']} ${modalChangePasswordStyles['input']}`
                      : modalChangePasswordStyles['input']
                  }
                  value={password.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  onKeyDown={(e) => (e.key === 'Enter' ? handleSubmit() : '')}
                />
                <span
                  className={modalChangePasswordStyles['change']}
                  style={{
                    backgroundImage: !isTypeC
                      ? `url(${process.env.PUBLIC_URL}/images/eye-regular.svg)`
                      : `url(${process.env.PUBLIC_URL}/images/eye-slash-regular.svg)`,
                  }}
                  onClick={() => setIsTypeC(!isTypeC)}
                ></span>
              </div>
            </div>
            <div className={modalChangePasswordStyles['submit']}>
              <Button classItem="primary" event={handleSubmit}>
                Đổi mật khẩu
              </Button>
            </div>
          </Modal>
        </>,
        document.body,
      )
    : null;
};

export default ModalChangePassword;
