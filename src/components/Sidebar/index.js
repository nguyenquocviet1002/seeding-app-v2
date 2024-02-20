import { MENU } from '@/utils/menu';
import { Link, useNavigate } from 'react-router-dom';
import ItemNav from '../ItemNav';
import sidebarStyles from './Sidebar.module.scss';
import ModalConfirm from '../ModalConfirm';
import { useModal } from '@/hooks/useModal';

const role = 'admin';

const Sidebar = ({ isShow, toggleLayout, close }) => {
  const { isShowing, cpn, toggle } = useModal();
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/check-data');
  };
  return (
    <>
      <aside className={`${sidebarStyles['sidebar']} ${isShow ? sidebarStyles['show'] : ''}`}>
        <div className={sidebarStyles['logo']}>
          <Link to="/">
            <img src={`${process.env.PUBLIC_URL}/images/logo.svg`} alt="" />
          </Link>
        </div>
        <nav className={sidebarStyles['nav']}>
          {MENU(role).map((item, index) => (
            <ItemNav
              key={index}
              href={item.link}
              icon={item.icon}
              closeSidebar={close}
              check={() => toggle('ModalConfirm')}
            >
              {item.title}
            </ItemNav>
          ))}
        </nav>
        <div
          className={sidebarStyles['buttonMenu']}
          style={{
            backgroundImage: `${
              !isShow
                ? `url(${process.env.PUBLIC_URL}/images/bars-solid.svg`
                : `url(${process.env.PUBLIC_URL}/images/xmark-solid.svg`
            })`,
          }}
          onClick={toggleLayout}
        ></div>
      </aside>
      {isShow && <div className={sidebarStyles['backdrop']} onClick={toggle}></div>}
      <ModalConfirm isShow={isShowing} hide={toggle} element={cpn} event={handleRedirect}>
        Bạn có muốn đi tới trang kiểm tra dữ liệu
      </ModalConfirm>
    </>
  );
};

export default Sidebar;
