import ReactDOM from 'react-dom';
import { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import modalCreateForm from './ModalCreateForm.module.scss';

const ModalCreateForm = ({ isShow, hide, element }) => {
  const initial = {
    name: '',
    phone: '',
    service: '',
    company: '',
    nameFb: '',
    linkFb: '',
    note1: '',
    note2: '',
    note3: '',
  };
  const [form, setForm] = useState(initial);

  const handleChange = (name) => (event) => {
    setForm((prev) => ({ ...prev, [name]: event.target.value }));
  };
  const handelSubmit = () => {
    setForm(initial);
    hide();
  };

  return isShow && element === 'ModalCreateForm'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Thêm mới" hide={hide} size="large">
            <div className={modalCreateForm['group']}>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Họ tên</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.name}
                  onChange={handleChange('name')}
                />
              </div>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Số điện thoại</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.phone}
                  onChange={handleChange('phone')}
                />
              </div>
            </div>
            <div className={modalCreateForm['group']}>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Dịch vụ</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.service}
                  onChange={handleChange('service')}
                />
              </div>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Chi nhánh</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.company}
                  onChange={handleChange('company')}
                />
              </div>
            </div>
            <div className={modalCreateForm['group']}>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Tên Facebook</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.nameFb}
                  onChange={handleChange('nameFb')}
                />
              </div>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Link Facebook</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.linkFb}
                  onChange={handleChange('linkFb')}
                />
              </div>
            </div>
            <div className={modalCreateForm['group']}>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Kịch bản</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.note1}
                  onChange={handleChange('note1')}
                />
              </div>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Tương tác</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.note2}
                  onChange={handleChange('note2')}
                />
              </div>
            </div>
            <div className={modalCreateForm['group--full']}>
              <label className={modalCreateForm['label']}>Ghi chú</label>
              <textarea
                className={modalCreateForm['input']}
                value={form.note3}
                onChange={handleChange('note3')}
              ></textarea>
            </div>
            <div className={modalCreateForm['submit']}>
              <Button classItem="primary" event={() => handelSubmit()}>
                Thêm mới
              </Button>
            </div>
          </Modal>
        </>,
        document.body,
      )
    : null;
};

export default ModalCreateForm;
