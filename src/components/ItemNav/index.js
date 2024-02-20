import { NavLink } from 'react-router-dom';
import itemNavStyles from './ItemNav.module.scss';

const ItemNav = ({ href, icon, children, closeSidebar, check }) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        isActive ? `${itemNavStyles['item']} ${itemNavStyles['active']}` : itemNavStyles['item']
      }
      onClick={(e) => {
        closeSidebar();
        if (href === 'check-data') {
          check();
          e.preventDefault();
        }
      }}
    >
      <span
        className={itemNavStyles['icon']}
        style={{
          WebkitMaskImage: `url(${process.env.PUBLIC_URL}/images/${icon})`,
          maskImage: `url(${process.env.PUBLIC_URL}/images/${icon})`,
        }}
      ></span>
      {children}
    </NavLink>
  );
};

export default ItemNav;
