import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useModal } from '@/hooks/useModal';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getNameFn } from '@/api/user';
import { tokenName } from '@/utils/config';

import Button from '../Button';
import ModalChangePassword from '../ModalChangePassword';

import headerStyles from './Header.module.scss';

const Header = ({ showToast }) => {
  const [token] = useLocalStorage(tokenName, null);
  const { isShowing, cpn, toggle } = useModal();
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [isDropdown, setIsDropdown] = useState(false);

  const queryGetName = useQuery({
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
                <p className={headerStyles['userName']}>{queryGetName.isSuccess && user.username}</p>
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
