import { useNavigate } from 'react-router-dom';
import { useModal } from '@/hooks/useModal';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getUserFn } from '@/api/user';
import Button from '../Button';
import ModalChangePassword from '../ModalChangePassword';
import headerStyles from './Header.module.scss';
import { useState } from 'react';

const Header = () => {
  const [user, setUser] = useState();
  const [isDropdown, setIsDropdown] = useState(false);
  const [token, setToken] = useLocalStorage('token-manage', null);
  const navigate = useNavigate();
  const { isShowing, cpn, toggle } = useModal();

  const queryGetUser = useQuery({
    queryKey: ['get-user', token],
    queryFn: () => getUserFn(token),
    onSuccess: (data) => {
      if (data.data.message === 'token seems to have expired or invalid') {
        alert('Lỗi hệ thống! Vui lòng đăng nhập lại');
        setToken(null);
        navigate('/login');
      } else {
        setUser(data.data.data.username);
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
                <p className={headerStyles['userName']}>{queryGetUser.isSuccess && user}</p>
                <div className={headerStyles['userAvt']} onClick={() => setIsDropdown(!isDropdown)}>
                  <img src={`${process.env.PUBLIC_URL}/images/profile.png`} alt="" />
                </div>
                {isDropdown && (
                  <div className={headerStyles['dropdown']}>
                    <div className={headerStyles['header__dropdownCard']}>
                      {queryGetUser.isSuccess && <div className={headerStyles['header__dropdownHead']}>{user}</div>}
                      <div className={headerStyles['header__dropdownBody']}>
                        <div
                          className={headerStyles['header__dropdownLink']}
                          onClick={() => toggle('ModalChangePassword')}
                        >
                          <img src={`${process.env.PUBLIC_URL}/images/key-solid.svg`} alt="" />
                          <span>Đổi mật khẩu</span>
                        </div>
                        <div className={headerStyles['header__dropdownLink']} onClick={() => logout()}>
                          <img src={`${process.env.PUBLIC_URL}/images/right-from-bracket-solid.svg`} alt="" />
                          <span>Đăng xuất</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <ModalChangePassword isShow={isShowing} hide={toggle} element={cpn} />
    </>
  );
};

export default Header;
