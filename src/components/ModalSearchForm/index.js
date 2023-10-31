import ReactDOM from 'react-dom';
import { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import modalCreateForm from './ModalSearchForm.module.scss';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useQuery } from '@tanstack/react-query';
import { getFormFn } from '@/api/form';

const ModalSearchForm = ({ isShow, hide, element }) => {
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useLocalStorage('token-manage', null);
  const initial = {
    brand_id: '',
    type: '',
    limit: '',
    offset: '',
    company_id: '',
    name_fb: '',
    phone: '',
    service: '',
    name: '',
    start_date: '',
    end_date: '',
    user_seeding: '',
    token: token,
  };
  const [form, setForm] = useState(initial);
  const queryGetForm = useQuery({
    queryKey: ['get-form', token],
    queryFn: () => getFormFn(form),
    enabled: false,
    onSuccess: (data) => {
      console.log('data: ', data);
    },
  });

  const handleChange = (name) => (event) => {
    setForm((prev) => ({ ...prev, [name]: event.target.value }));
  };
  const handelSubmit = () => {
    queryGetForm.refetch();
    setForm(initial);
    hide();
  };

  return isShow && element === 'ModalSearchForm'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Tìm kiếm" hide={hide} size="large">
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
                <label className={modalCreateForm['label']}>Tên Facebook</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.nameFb}
                  onChange={handleChange('nameFb')}
                />
              </div>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Dịch vụ</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.service}
                  onChange={handleChange('service')}
                />
              </div>
            </div>
            <div className={modalCreateForm['group']}>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Chi nhánh</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.company}
                  onChange={handleChange('company')}
                />
              </div>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Nhân viên</label>
                <input
                  type="text"
                  className={modalCreateForm['input']}
                  value={form.user}
                  onChange={handleChange('user')}
                />
              </div>
            </div>
            <div className={modalCreateForm['group']}>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Từ ngày</label>
                <input
                  type="date"
                  className={modalCreateForm['input']}
                  value={form.from}
                  onChange={handleChange('from')}
                />
              </div>
              <div className={modalCreateForm['control']}>
                <label className={modalCreateForm['label']}>Đến ngày</label>
                <input type="date" className={modalCreateForm['input']} value={form.to} onChange={handleChange('to')} />
              </div>
            </div>
            <div className={modalCreateForm['submit']}>
              <Button classItem="primary" event={() => handelSubmit()}>
                Tìm kiếm
              </Button>
            </div>
          </Modal>
        </>,
        document.body,
      )
    : null;
};

export default ModalSearchForm;
