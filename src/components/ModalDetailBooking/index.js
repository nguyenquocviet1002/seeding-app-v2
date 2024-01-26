import ReactDOM from 'react-dom';
import Modal from '../Modal';
import modalDetailBookingStyles from './ModalDetailBooking.module.scss';

const ModalDetailBooking = ({ isShow, hide, element, data }) => {
  return isShow && element === 'ModalDetailBooking'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Chi tiết" hide={hide} size="Xlarge">
            <div className={modalDetailBookingStyles['bot']}>
              <div className={modalDetailBookingStyles['aside']}>
                <div className={modalDetailBookingStyles['infoName']}>
                  <div className={modalDetailBookingStyles['infoIcon']}>
                    <img width="150" height="150" src={`${process.env.PUBLIC_URL}/images/icon-info.png`} alt="" />
                  </div>
                  <span>Thông tin cá nhân</span>
                </div>
                <div className={modalDetailBookingStyles['infoContent']}>
                  <div className={modalDetailBookingStyles['infoContentItem']}>
                    <div className={modalDetailBookingStyles['infoLabel']}>Họ tên:</div>
                    <div className={modalDetailBookingStyles['infoValue']}>{data.contact_name}</div>
                  </div>
                  <div className={modalDetailBookingStyles['infoContentItem']}>
                    <div className={modalDetailBookingStyles['infoLabel']}>Điện thoại 1:</div>
                    <div className={modalDetailBookingStyles['infoValue']}>{data.phone_1}</div>
                  </div>
                </div>
              </div>
              <div className={modalDetailBookingStyles['aside']}>
                <div className={modalDetailBookingStyles['infoName']}>
                  <div className={modalDetailBookingStyles['infoIcon']}>
                    <img width="150" height="150" src={`${process.env.PUBLIC_URL}/images/icon-info.png`} alt="" />
                  </div>
                  <span>Thông tin cá nhân</span>
                </div>
                <div className={modalDetailBookingStyles['infoContent']}>
                  <div className={modalDetailBookingStyles['infoContentItem']}>
                    <div className={modalDetailBookingStyles['infoLabel']}>Họ tên:</div>
                    <div className={modalDetailBookingStyles['infoValue']}>{data.company}</div>
                  </div>
                  <div className={modalDetailBookingStyles['infoContentItem']}>
                    <div className={modalDetailBookingStyles['infoLabel']}>Họ tên:</div>
                    <div className={modalDetailBookingStyles['infoValue']}>{data.company}</div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </>,
        document.body,
      )
    : null;
};

export default ModalDetailBooking;
