import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';
import Button from '../Button';
import ModalChangePassword from '../ModalChangePassword';
import profile from '/profile.png';

import headerStyles from './Header.module.scss';

const Header = ({ showToast, user }) => {
  const { isShowing, cpn, toggle } = useModal();
  const navigate = useNavigate();

  const [isDropdown, setIsDropdown] = useState(false);

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
                <p className={headerStyles['userName']}>{user.username}</p>
                <div className={headerStyles['userAvt']} onClick={() => setIsDropdown(!isDropdown)}>
                  <img src={profile} alt="" />
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
