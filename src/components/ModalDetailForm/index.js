import ReactDOM from 'react-dom';
import Modal from '../Modal';
import modalDetailForm from './ModalDetailForm.module.scss';

const ModalDetailForm = ({ isShow, hide, element, data }) => {
  return isShow && element === 'ModalDetailForm'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Chi tiết" hide={hide} size="large">
            <div className={modalDetailForm['group']}>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Mã</label>
                <input type="text" className={modalDetailForm['input']} value={data.code} disabled />
              </div>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Họ tên</label>
                <input type="text" className={modalDetailForm['input']} value={data.name} disabled />
              </div>
            </div>
            <div className={modalDetailForm['group']}>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Số điện thoại</label>
                <input type="text" className={modalDetailForm['input']} value={data.phone} disabled />
              </div>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Facebook</label>
                <a
                  href={data.link}
                  className={`${modalDetailForm['input']} ${modalDetailForm['link']}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {data.link}
                </a>
              </div>
            </div>
            <div className={modalDetailForm['group']}>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Dịch vụ</label>
                <input type="text" className={modalDetailForm['input']} value={data.service} disabled />
              </div>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Chi nhánh</label>
                <input type="text" className={modalDetailForm['input']} value={data.company} disabled />
              </div>
            </div>
            <div className={modalDetailForm['group']}>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Kịch bản</label>
                <input type="text" className={modalDetailForm['input']} value={data.service} disabled />
              </div>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Tương tác</label>
                <input type="text" className={modalDetailForm['input']} value={data.service} disabled />
              </div>
            </div>
            <div className={modalDetailForm['group']}>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Thời gian</label>
                <input type="text" className={modalDetailForm['input']} value={data.service} disabled />
              </div>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Ticket Caresoft</label>
                <a
                  href={data.link}
                  className={`${modalDetailForm['input']} ${modalDetailForm['link']}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {data.link}
                </a>
              </div>
            </div>
            <div className={modalDetailForm['group--full']}>
              <label className={modalDetailForm['label']}>Ghi chú</label>
              <textarea className={modalDetailForm['input']} value={data.service} disabled></textarea>
            </div>
          </Modal>
        </>,
        document.body,
      )
    : null;
};

export default ModalDetailForm;
