import ReactDOM from 'react-dom';
import Modal from '../Modal';
import modalServiceStyles from './ModalService.module.scss';

const ModalService = ({ isShow, hide, element, data }) => {
  return isShow && element === 'ModalService'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Dịch vụ" hide={hide} size="large">
            {data.map((item, index) => (
              <div className={modalServiceStyles['item']} key={index}>
                {item}
              </div>
            ))}
          </Modal>
        </>,
        document.body,
      )
    : null;
};

export default ModalService;
