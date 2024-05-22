import ReactDOM from 'react-dom';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { tokenName } from '@/utils/config';
import { createUserFn } from '@/api/user';

import Modal from '../Modal';
import Button from '../Button';

import modalCreateUserStyles from './ModalCreateUser.module.scss';

const ModalCreateUser = ({ isShow, element, hide, toast }) => {
  const [token] = useLocalStorage(tokenName, null);

  const initial = {
    token: token,
    name: '',
    phone: '',
    mobile: '',
    date_of_birth: '',
  };

  const [infoUser, setInfoUser] = useState(initial);

  const queryClient = useQueryClient();

  const queryCreateUser = useQuery({
    queryKey: ['create-user'],
    queryFn: () => createUserFn(infoUser),
    enabled: false,
    onSuccess: (data) => {
      if (data.data.error) {
        hide();
        setInfoUser(initial);
        toast('Thêm nhân viên thất bại', 'failure');
      } else {
        hide();
        setInfoUser(initial);
        toast('Thêm nhân viên thành công', 'success');
        queryClient.invalidateQueries({ queryKey: ['get-user', token] });
      }
    },
  });

  const handleChange = (name) => (event) => {
    setInfoUser((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const handleSubmit = () => {
    if (!infoUser.name || !infoUser.phone || !infoUser.mobile || !infoUser.date_of_birth) {
      toast('Vui lòng điền các trường bắt buộc', 'warning');
    } else {
      queryCreateUser.refetch();
    }
  };

  return isShow && element === 'ModalCreateUser'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Thêm mới nhân viên" hide={hide}>
            <div className={modalCreateUserStyles['note']}>(*): trường bắt buộc</div>
            <div className={modalCreateUserStyles['group']}>
              <label htmlFor="name" className={modalCreateUserStyles['label']}>
                Họ và tên <span className={modalCreateUserStyles['require']}>(*)</span>
              </label>
              <input
                type="text"
                id="name"
                className={modalCreateUserStyles['input']}
                value={infoUser.name}
                onChange={handleChange('name')}
              />
            </div>
            <div className={modalCreateUserStyles['group']}>
              <label htmlFor="phone1" className={modalCreateUserStyles['label']}>
                Số điện thoại 1 <span className={modalCreateUserStyles['require']}>(*)</span>
              </label>
              <input
                type="text"
                id="phone1"
                className={modalCreateUserStyles['input']}
                value={infoUser.phone}
                onChange={handleChange('phone')}
              />
            </div>
            <div className={modalCreateUserStyles['group']}>
              <label htmlFor="phone2" className={modalCreateUserStyles['label']}>
                Số điện thoại 2 <span className={modalCreateUserStyles['require']}>(*)</span>
              </label>
              <input
                type="text"
                id="phone2"
                className={modalCreateUserStyles['input']}
                value={infoUser.mobile}
                onChange={handleChange('mobile')}
              />
            </div>
            <div className={modalCreateUserStyles['group']}>
              <label htmlFor="birth" className={modalCreateUserStyles['label']}>
                Ngày sinh <span className={modalCreateUserStyles['require']}>(*)</span>
              </label>
              <input
                type="date"
                id="birth"
                className={modalCreateUserStyles['input']}
                value={infoUser.date_of_birth}
                onChange={handleChange('date_of_birth')}
              />
            </div>
            <div className={modalCreateUserStyles['submit']}>
              <Button classItem="primary" event={() => handleSubmit()}>
                Thêm mới
              </Button>
            </div>
          </Modal>
        </>,
        document.body,
      )
    : null;
};

export default ModalCreateUser;
