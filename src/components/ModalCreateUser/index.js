import ReactDOM from 'react-dom';
import Modal from '../Modal';
import modalCreateUserStyles from './ModalCreateUser.module.scss';
import Button from '../Button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { tokenName } from '@/utils/config';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createUserFn } from '@/api/user';

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
  const [message, setMessage] = useState();

  const queryClient = useQueryClient();

  const queryCreateUser = useQuery({
    queryKey: ['create-user'],
    queryFn: () => createUserFn(infoUser),
    enabled: false,
    onSuccess: () => {
      hide();
      setInfoUser(initial);
      toast('Thêm nhân viên thành công', 'success');
      queryClient.invalidateQueries({ queryKey: ['get-user', token] });
    },
  });

  const handleChange = (name) => (event) => {
    setInfoUser((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const handleSubmit = () => {
    setMessage();
    if (!infoUser.name) {
      toast('Tên không được để trống', 'warning');
      setMessage('nameErr');
    } else if (!infoUser.phone) {
      toast('Số điện thoại không được để trống', 'warning');
      setMessage('phoneErr');
    } else {
      queryCreateUser.refetch();
    }
  };

  return isShow && element === 'ModalCreateUser'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Thêm mới nhân viên" hide={hide}>
            <div className={modalCreateUserStyles['group']}>
              <label htmlFor="name" className={modalCreateUserStyles['label']}>
                Họ và tên
              </label>
              <input
                type="text"
                id="name"
                className={`${modalCreateUserStyles['input']} ${
                  message === 'nameErr' ? modalCreateUserStyles['error'] : ''
                }`}
                value={infoUser.name}
                onChange={handleChange('name')}
              />
            </div>
            <div className={modalCreateUserStyles['group']}>
              <label htmlFor="phone1" className={modalCreateUserStyles['label']}>
                Số điện thoại 1
              </label>
              <input
                type="text"
                id="phone1"
                className={`${modalCreateUserStyles['input']} ${
                  message === 'phoneErr' ? modalCreateUserStyles['error'] : ''
                }`}
                value={infoUser.phone}
                onChange={handleChange('phone')}
              />
            </div>
            <div className={modalCreateUserStyles['group']}>
              <label htmlFor="phone2" className={modalCreateUserStyles['label']}>
                Số điện thoại 2
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
                Ngày sinh
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
