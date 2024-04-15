import ReactDOM from 'react-dom';
import { formatMoney } from '@/utils/config';
import dayjs from 'dayjs';
import Modal from '../Modal';
import modalTotalPriceStyles from './ModalTotalPrice.module.scss';

const ModalTotalPrice = ({ isShow, hide, element, data }) => {
  const total = () => {
    let totalPrice = 0;
    data.map((item) => (totalPrice += Number(item.tien)));
    return totalPrice;
  };

  return isShow && element === 'ModalTotalPrice'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Doanh số" hide={hide} size="large">
            {data.map((item, index) => (
              <div className={modalTotalPriceStyles['group']} key={index}>
                <div className={modalTotalPriceStyles['item']}>{item.dich_vu}</div>
                <div className={modalTotalPriceStyles['item']}>{dayjs(item.ngay_thanh_toan).format('DD/MM/YYYY')}</div>
                <div className={modalTotalPriceStyles['item']}>{formatMoney(item.tien)}</div>
              </div>
            ))}
            <div>Tổng: {formatMoney(total())}</div>
          </Modal>
        </>,
        document.body,
      )
    : null;
};

export default ModalTotalPrice;
