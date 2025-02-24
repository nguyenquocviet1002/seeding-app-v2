import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { updatePasswordMemberFn } from '../../api/user';
import { tokenName } from '../../utils/config';
import Modal from '../Modal';
import Button from '../Button';
import modalChangePasswordUserStyles from '../ModalChangePassword/ModalChangePassword.module.scss';
import { images } from '../../assets/images.jsx';

const ModalChangePasswordUser = ({ isShow, hide, element, toast, user }) => {
  const [token, setToken] = useLocalStorage(tokenName, null);
  const navigate = useNavigate();
  const initialPassword = {
    token: token,
    login: user,
    password: '',
    confirmPassword: '',
  };

  const [password, setPassword] = useState(initialPassword);
  const [message, setMessage] = useState('');
  const [isTypeP, setIsTypeP] = useState(false);
  const [isTypeC, setIsTypeC] = useState(false);

  useEffect(() => {
    setPassword((prev) => ({ ...prev, login: user }));
  }, [user]);

  const queryUpdatePasswordMember = useQuery({
    queryKey: ['update-password-member'],
    queryFn: () => updatePasswordMemberFn(password),
    enabled: false,
    onSuccess: (data) => {
      if (data.data.result === '<Response 77 bytes [401 UNAUTHORIZED]>') {
        alert('Lỗi hệ thống! Vui lòng đăng nhập lại');
        setToken(null);
        navigate('/login');
      } else if (data.data.result.stage === false) {
        setMessage(data.data.result.message);
      } else {
        toast(data.data.result.message.content, 'success');
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
      queryUpdatePasswordMember.refetch();
    }
  };
  return isShow && element === 'ModalChangePasswordUser'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Đổi mật khẩu" hide={hide}>
            <div>
              {message && <p className={modalChangePasswordUserStyles['error__msg']}>{message}</p>}
              <div className={modalChangePasswordUserStyles['control']}>
                <label className={modalChangePasswordUserStyles['label']}>Mật khẩu mới</label>
                <input
                  type={!isTypeP ? 'password' : 'text'}
                  className={
                    message
                      ? `${modalChangePasswordUserStyles['error']} ${modalChangePasswordUserStyles['input']}`
                      : modalChangePasswordUserStyles['input']
                  }
                  value={password.password}
                  onChange={handleChange('password')}
                  onKeyDown={(e) => (e.key === 'Enter' ? handleSubmit() : '')}
                />
                <span
                  className={modalChangePasswordUserStyles['change']}
                  style={{
                    backgroundImage: !isTypeP ? `url(${images.eyeRegular})` : `url(${images.eyeSlashRegular})`,
                  }}
                  onClick={() => setIsTypeP(!isTypeP)}
                ></span>
              </div>
              <div className={modalChangePasswordUserStyles['control']}>
                <label className={modalChangePasswordUserStyles['label']}>Xác nhận mật khẩu</label>
                <input
                  type={!isTypeC ? 'password' : 'text'}
                  className={
                    message
                      ? `${modalChangePasswordUserStyles['error']} ${modalChangePasswordUserStyles['input']}`
                      : modalChangePasswordUserStyles['input']
                  }
                  value={password.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  onKeyDown={(e) => (e.key === 'Enter' ? handleSubmit() : '')}
                />
                <span
                  className={modalChangePasswordUserStyles['change']}
                  style={{
                    backgroundImage: !isTypeC ? `url(${images.eyeRegular})` : `url(${images.eyeSlashRegular})`,
                  }}
                  onClick={() => setIsTypeC(!isTypeC)}
                ></span>
              </div>
            </div>
            <div className={modalChangePasswordUserStyles['submit']}>
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

export default ModalChangePasswordUser;
