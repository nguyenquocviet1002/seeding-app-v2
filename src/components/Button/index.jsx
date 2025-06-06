import buttonStyles from './Button.module.scss';

const Button = ({ classItem, icon, event, size, children }) => {
  return (
    <button className={`${buttonStyles['button']} ${buttonStyles[classItem]} ${buttonStyles[size]}`} onClick={event}>
      {
          icon && <span 
            className={buttonStyles['icon']} 
            // style={{ backgroundImage: `url(${icon})` }}
            >
            <img src={icon} alt='icon' />
        </span>
      }
      {children}
    </button>
  );
};

export default Button;
