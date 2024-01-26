import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '@/hooks/useModal';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getUserFn } from '@/api/user';
import { tokenName } from '@/utils/config';
import Button from '../Button';
import ModalChangePassword from '../ModalChangePassword';
import headerStyles from './Header.module.scss';

const Header = ({ showToast }) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const [token] = useLocalStorage(tokenName, null);
  const navigate = useNavigate();
  const { isShowing, cpn, toggle } = useModal();

  const queryGetUser = useQuery({
    queryKey: ['get-user', token],
    queryFn: () => getUserFn(token),
    onSuccess: (data) => {
      if (data.data.message === 'token seems to have expired or invalid') {
        navigate('/login');
        showToast('Lỗi hệ thống! Vui lòng đăng nhập lại ', 'failure');
        localStorage.clear();
      }
    },
  });

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };
  return (
    <>
      <header className={headerStyles['header']}>
        <div className="container-full" style={{ height: '100%' }}>
          <div className={headerStyles['content']}>
            <div className={headerStyles['content__left']}></div>
            <div className={headerStyles['content__right']}>
              <div className={headerStyles['cta']}>
                <Button classItem="light" icon="key-solid.svg" event={() => toggle('ModalChangePassword')}>
                  Đổi mật khẩu
                </Button>
                <Button classItem="light" icon="right-from-bracket-solid.svg" event={logout}>
                  Đăng xuất
                </Button>
              </div>
              <div className={headerStyles['user']}>
                <p className={headerStyles['userName']}>
                  {queryGetUser.isSuccess && queryGetUser.data.data.data.username}
                </p>
                <div className={headerStyles['userAvt']} onClick={() => setIsDropdown(!isDropdown)}>
                  <img src={`${process.env.PUBLIC_URL}/images/profile.png`} alt="" />
                </div>
                {isDropdown && (
                  <div className={headerStyles['dropdown']}>
                    <Button classItem="light" icon="key-solid.svg" event={() => toggle('ModalChangePassword')}>
                      Đổi mật khẩu
                    </Button>
                    <Button classItem="light" icon="right-from-bracket-solid.svg" event={logout}>
                      Đăng xuất
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <ModalChangePassword isShow={isShowing} hide={toggle} element={cpn} toast={showToast} />
    </>
  );
};

export default Header;
