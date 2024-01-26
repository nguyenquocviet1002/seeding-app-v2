import { MENU } from '@/utils/menu';
import { Link } from 'react-router-dom';
import ItemNav from '../ItemNav';
import sidebarStyles from './Sidebar.module.scss';

const role = 'admin';

const Sidebar = ({ isShow, toggle, close }) => {
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
            <ItemNav key={index} href={item.link} icon={item.icon} closeSidebar={close}>
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
          onClick={toggle}
        ></div>
      </aside>
      {isShow && <div className={sidebarStyles['backdrop']} onClick={toggle}></div>}
    </>
  );
};

export default Sidebar;
