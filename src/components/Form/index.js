import { useState } from 'react';
import { useModal } from '@/hooks/useModal';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getFormFn } from '@/api/form';
import { removeFirstItem } from '@/utils/config';
import Button from '../Button';
import Table from '../Table';
import ModalDetailForm from '../ModalDetailForm';
import ModalCreateForm from '../ModalCreateForm';
import ModalSearchForm from '../ModalSearchForm';
import ModalEditForm from '../ModalEditForm';
import ModalConfirm from '../ModalConfirm';
import formStyles from './Form.module.scss';

const Form = () => {
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
  const [itemDetail, setItemDetail] = useState();
  const { isShowing, cpn, toggle } = useModal();
  const queryGetForm = useQuery({
    queryKey: ['get-form', token],
    queryFn: () => getFormFn(initial),
    onSuccess: (data) => {},
  });
  const columns = [
    {
      name: 'Họ và tên',
      selector: (row) => row.name,
    },
    {
      name: 'Điện thoại',
      selector: (row) => row.phone,
    },
    {
      name: 'Dịch vụ đăng ký',
      selector: (row) => row.service,
    },
    {
      name: 'Chi nhánh',
      selector: (row) => row.company,
    },
    {
      name: 'Nhân viên',
      selector: (row) => row.user,
    },
    {
      name: 'Ngày tạo',
      selector: (row) => row.date,
    },
    {
      name: 'Xem thêm',
      cell: (row) => (
        <Button classItem="outline" event={() => detailForm(row.id, 'ModalDetailForm')}>
          Chi tiết
        </Button>
      ),
    },
    {
      name: 'Hành động',
      cell: (row) => (
        <>
          <Button
            classItem="primary"
            icon="pencil-solid.svg"
            size="small"
            event={() => detailForm(row.id, 'ModalEditForm')}
          ></Button>
          <Button classItem="danger" icon="trash-solid.svg" size="small" event={() => toggle('ModalConfirm')}></Button>
        </>
      ),
    },
  ];

  const detailForm = (id, modal) => {
    const item = queryGetForm.data.data.data.filter((item) => item.id === id);
    setItemDetail(item[0]);
    setTimeout(() => {
      toggle(modal);
    }, 0);
  };
  return (
    <>
      <div className={formStyles['inner']}>
        <div className={formStyles['head']}>
          <div className={formStyles['top']}>
            <div className={formStyles['title']}>Danh Sách Form</div>
            <div className={formStyles['action']}>
              <Button classItem="primary" icon="magnifying-glass-solid.svg" event={() => toggle('ModalSearchForm')}>
                Tìm kiếm
              </Button>
              <Button classItem="primary" icon="plus-solid.svg" event={() => toggle('ModalCreateForm')}>
                Thêm mới
              </Button>
            </div>
          </div>
        </div>
        {queryGetForm.isSuccess && (
          <div className={formStyles['table']}>
            <Table
              columns={columns}
              data={queryGetForm.data.data.count > 1 ? removeFirstItem(queryGetForm.data.data.data) : []}
            />
          </div>
        )}
      </div>
      <ModalConfirm isShow={isShowing} hide={toggle} element={cpn}>
        Bạn có muốn xóa
      </ModalConfirm>
      <ModalCreateForm isShow={isShowing} hide={toggle} element={cpn} />
      <ModalSearchForm isShow={isShowing} hide={toggle} element={cpn} />
      <ModalEditForm isShow={isShowing} hide={toggle} element={cpn} data={itemDetail} />
      <ModalDetailForm isShow={isShowing} hide={toggle} element={cpn} data={itemDetail} />
    </>
  );
};

export default Form;
