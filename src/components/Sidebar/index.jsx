import { MENU } from '../../utils/menu';
import { Link, useNavigate } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';
import ItemNav from '../ItemNav';
import sidebarStyles from './Sidebar.module.scss';
import ModalConfirm from '../ModalConfirm';

import { images } from '../../assets/images.jsx';

const Sidebar = ({ isShow, toggleLayout, close, user }) => {
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
            <img src={images.logo} alt="" />
          </Link>
        </div>
        <nav className={sidebarStyles['nav']}>
          {MENU(user.rule).map((item, index) => (
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
            // backgroundImage: !isShow ? `url(${barsSolid}` : `url(${images.xmark_solid})`,
          }}
          onClick={toggleLayout}
        >{
          !isShow ? <img src={images.barsSolid} /> : <img src={images.xmark_solid} />
        }</div>
      </aside>
      {isShow && <div className={sidebarStyles['backdrop']} onClick={toggleLayout}></div>}
      <ModalConfirm isShow={isShowing} hide={toggle} element={cpn} event={handleRedirect}>
        Bạn có muốn đi tới trang kiểm tra dữ liệu
      </ModalConfirm>
    </>
  );
};

export default Sidebar;
