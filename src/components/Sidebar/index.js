import { MENU } from '@/utils/menu';
import { Link } from 'react-router-dom';
import ItemNav from '../ItemNav';
import sidebarStyles from './Sidebar.module.scss';

const role = 'admin';

const Sidebar = () => {
  return (
    <aside className={sidebarStyles['sidebar']}>
      <div className={sidebarStyles['logo']}>
        <Link to="/">
          <img src={`${process.env.PUBLIC_URL}/images/logo.svg`} alt="" />
        </Link>
      </div>
      <nav className={sidebarStyles['nav']}>
        {MENU(role).map((item, index) => (
          <ItemNav key={index} href={item.link} icon={item.icon}>
            {item.title}
          </ItemNav>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
