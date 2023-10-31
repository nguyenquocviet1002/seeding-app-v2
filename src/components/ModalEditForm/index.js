import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import modalDetailForm from './ModalEditForm.module.scss';

const ModalEditForm = ({ isShow, hide, element, data }) => {
  const initial = {
    code: '',
    name: '',
    link: '',
    phone: '',
    service: '',
    company: '',
    user: '',
    date: '',
  };
  const [dataDetail, setDataDetail] = useState(initial);

  useEffect(() => {
    setDataDetail(data);
  }, [data]);

  const handleChange = (name) => (event) => {
    setDataDetail((prev) => ({ ...prev, [name]: event.target.value }));
  };
  const handelSubmit = () => {
    hide();
  };

  return isShow && element === 'ModalEditForm'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Sửa" hide={hide} size="large">
            <div className={modalDetailForm['group']}>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Mã</label>
                <input
                  type="text"
                  className={modalDetailForm['input']}
                  value={dataDetail.code}
                  onChange={handleChange('code')}
                />
              </div>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Họ tên</label>
                <input
                  type="text"
                  className={modalDetailForm['input']}
                  value={dataDetail.code}
                  onChange={handleChange('code')}
                />
              </div>
            </div>
            <div className={modalDetailForm['group']}>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Số điện thoại</label>
                <input
                  type="text"
                  className={modalDetailForm['input']}
                  value={dataDetail.code}
                  onChange={handleChange('code')}
                />
              </div>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Facebook</label>
                <input
                  type="text"
                  className={modalDetailForm['input']}
                  value={dataDetail.code}
                  onChange={handleChange('code')}
                />
              </div>
            </div>
            <div className={modalDetailForm['group']}>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Dịch vụ</label>
                <input
                  type="text"
                  className={modalDetailForm['input']}
                  value={dataDetail.code}
                  onChange={handleChange('code')}
                />
              </div>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Chi nhánh</label>
                <input
                  type="text"
                  className={modalDetailForm['input']}
                  value={dataDetail.code}
                  onChange={handleChange('code')}
                />
              </div>
            </div>
            <div className={modalDetailForm['group']}>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Kịch bản</label>
                <input
                  type="text"
                  className={modalDetailForm['input']}
                  value={dataDetail.code}
                  onChange={handleChange('code')}
                />
              </div>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Tương tác</label>
                <input
                  type="text"
                  className={modalDetailForm['input']}
                  value={dataDetail.code}
                  onChange={handleChange('code')}
                />
              </div>
            </div>
            <div className={modalDetailForm['group--full']}>
              <label className={modalDetailForm['label']}>Ghi chú</label>
              <textarea
                className={modalDetailForm['input']}
                value={dataDetail.code}
                onChange={handleChange('code')}
              ></textarea>
            </div>
            <div className={modalDetailForm['submit']}>
              <Button classItem="primary" event={() => handelSubmit()}>
                Lưu
              </Button>
            </div>
          </Modal>
        </>,
        document.body,
      )
    : null;
};

export default ModalEditForm;
