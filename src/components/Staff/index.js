import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatMoney, removeFirstItem, tokenName } from '@/utils/config';
import { getUserFn, updateActiveUserFn } from '@/api/user';
import Button from '../Button';
import Table from '../Table';
import staffStyles from './Staff.module.scss';
import Loading from '../Loading';
import ModalChangePasswordUser from '../ModalChangePasswordUser';
import { useModal } from '@/hooks/useModal';
import ModalCreateUser from '../ModalCreateUser';

const Staff = () => {
  const [token] = useLocalStorage(tokenName, null);
  const showToast = useOutletContext();
  const queryClient = useQueryClient();
  const { isShowing, cpn, toggle } = useModal();

  const [infoActive, setInfoActive] = useState({ token: token, code_user: '', active: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState('');

  const queryGetUser = useQuery({
    queryKey: ['get-user', token],
    queryFn: () => getUserFn({ token: token, code_user: '' }),
    onSuccess: () => setIsLoading(false),
  });

  const queryUpdateActiveUser = useQuery({
    queryKey: ['update-active-user', token],
    queryFn: () => updateActiveUserFn(infoActive),
    enabled: false,
    onSuccess: () => {
      showToast('Thay đổi trạng thái thành công', 'success');
      queryClient.invalidateQueries({ queryKey: ['get-user', token] });
    },
  });

  const handleActiveUser = (isActive, codeUser) => {
    setIsLoading(true);
    setInfoActive((prev) => ({ ...prev, code_user: codeUser, active: isActive }));
    setTimeout(() => {
      queryUpdateActiveUser.refetch();
    }, 0);
  };
  const columns = [
    {
      name: 'Mã nhân viên',
      selector: (row) => row.code_user,
    },
    {
      name: 'Họ và tên',
      selector: (row) => row.name,
    },
    {
      name: 'Số điện thoại',
      selector: (row) => row.phone,
    },
    {
      name: 'Kết quả',
      selector: (row) => formatMoney(row.kpi_now),
    },
    {
      name: 'Mục tiêu',
      selector: (row) => formatMoney(row.kpi_target),
    },
    {
      name: 'Hoàn thành',
      selector: (row) => {
        const kpiTarget = row.kpi_target === 0 ? row.kpi_now : row.kpi_target;
        const percentSet = ((row.kpi_now / kpiTarget) * 100).toFixed();
        return percentSet === 'NaN' ? '0%' : `${percentSet}%`;
      },
    },
    {
      name: 'Trạng thái',
      selector: (row) => (
        <select
          value={row.active_user}
          className={`${staffStyles['status']} ${row.active_user ? staffStyles['active'] : staffStyles['unactive']}`}
          onChange={(e) => handleActiveUser(e.target.value, row.code_user)}
        >
          <option value="true">Đang hoạt động</option>
          <option value="false">Vô hiệu hóa</option>
        </select>
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
            event={() => {
              setUser(row.phone);
              toggle('ModalChangePasswordUser');
            }}
          ></Button>
          <Button classItem="danger" icon="ellipsis-vertical-solid.svg" size="small"></Button>
        </>
      ),
    },
  ];

  return (
    <>
      <div className={staffStyles['main']}>
        <div className={staffStyles['head']}>
          <div className={staffStyles['title']}>Danh Sách Nhân Viên</div>
          <div className={staffStyles['cta']}>
            <Button classItem="primary" icon="plus-solid.svg" event={() => toggle('ModalCreateUser')}>
              Thêm mới
            </Button>
          </div>
        </div>
        <div className={staffStyles['table']}>
          <Table
            columns={columns}
            data={
              queryGetUser.isSuccess && queryGetUser.data.data.count > 0
                ? removeFirstItem(queryGetUser.data.data.data)
                : []
            }
          />
        </div>
      </div>
      <ModalChangePasswordUser isShow={isShowing} hide={toggle} element={cpn} toast={showToast} user={user} />
      <ModalCreateUser isShow={isShowing} hide={toggle} element={cpn} toast={showToast} />
      {isLoading && <Loading />}
    </>
  );
};

export default Staff;
