import { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useModal } from '@/hooks/useModal';
import { useDebounce } from '@/hooks/useDebounce';
import { formatMoney, removeAccents, removeFirstItem, tokenName } from '@/utils/config';
import { getUserFn, updateActiveUserFn } from '@/api/user';
import Button from '../Button';
import Table from '../Table';
import Loading from '../Loading';
import ModalChangePasswordUser from '../ModalChangePasswordUser';
import ModalCreateUser from '../ModalCreateUser';
import ModalTarget from '../ModalTarget';
import staffStyles from './Staff.module.scss';

const Staff = () => {
  const [token] = useLocalStorage(tokenName, null);
  const showToast = useOutletContext();
  const queryClient = useQueryClient();
  const { isShowing, cpn, toggle } = useModal();

  const [infoActive, setInfoActive] = useState({ token: token, code_user: '', active: '' });
  const [user, setUser] = useState('');
  const [listUser, setListUser] = useState([]);
  const [listUserFilter, setListUserFilter] = useState('');
  const [userTarget, setUserTarget] = useState({ name: '', code_user: '' });
  const [valueSearch, setValueSearch] = useState('');

  const debouncedValue = useDebounce(valueSearch, 500);

  const queryGetUser = useQuery({
    queryKey: ['get-user', token],
    queryFn: () => getUserFn({ token: token, code_user: '' }),
    onSuccess: (data) => {
      setListUser(removeFirstItem(data.data.data));
      setListUserFilter(removeFirstItem(data.data.data));
    },
  });

  const queryUpdateActiveUser = useQuery({
    queryKey: ['update-active-user', infoActive],
    queryFn: () => updateActiveUserFn(infoActive),
    enabled: false,
    onSuccess: () => {
      showToast('Thay đổi trạng thái thành công', 'success');
      queryClient.invalidateQueries({ queryKey: ['get-user', token] });
    },
  });

  const handleActiveUser = (isActive, codeUser) => {
    setInfoActive((prev) => ({ ...prev, code_user: codeUser, active: isActive }));
    setTimeout(() => {
      queryUpdateActiveUser.refetch();
    }, 0);
  };

  const searchByName = useCallback(() => {
    if (debouncedValue) {
      const result = listUser.filter((item) => removeAccents(item.name).search(removeAccents(debouncedValue)) !== -1);
      setListUserFilter(result);
    } else {
      setListUserFilter(listUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    searchByName();
  }, [debouncedValue, searchByName]);

  const columns = [
    {
      name: 'Mã nhân viên',
      selector: (row) => row.code_user,
    },
    {
      name: 'Họ và tên',
      selector: (row) => row.name,
      grow: 1.5,
    },
    {
      name: 'Số điện thoại',
      selector: (row) => row.phone,
    },
    {
      name: 'Kết quả',
      selector: (row) => formatMoney(row.kpi_now),
      grow: 1.5,
    },
    {
      name: 'Mục tiêu',
      selector: (row) => formatMoney(row.kpi_target),
      grow: 1.5,
    },
    {
      name: 'Hoàn thành',
      selector: (row) => {
        const kpiTarget = row.kpi_target === 0 ? row.kpi_now : row.kpi_target;
        const percentSet = ((row.kpi_now / kpiTarget) * 100).toFixed(1);
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
          <Button
            classItem="danger"
            icon="ellipsis-vertical-solid.svg"
            size="small"
            event={() => {
              setUserTarget({
                name: row.name,
                code_user: row.code_user,
              });
              toggle('ModalTarget');
            }}
          ></Button>
        </>
      ),
      right: true,
      conditionalCellStyles: [
        {
          when: (row) => !row.active_user,
          style: {
            filter: 'grayscale(1)',
            pointerEvents: 'none',
          },
        },
      ],
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => !row.active_user,
      style: {
        backgroundColor: 'rgb(238, 238, 238)',
      },
    },
  ];

  return (
    <>
      <div className={staffStyles['main']}>
        <div className={staffStyles['head']}>
          <div className={staffStyles['title']}>Danh Sách Nhân Viên</div>
          <div className={staffStyles['right']}>
            <input
              type="text"
              className={staffStyles['search']}
              value={valueSearch}
              placeholder="Tìm kiếm theo tên"
              onChange={(e) => setValueSearch(e.target.value)}
            />
            <div className={staffStyles['cta']}>
              <Button classItem="primary" icon="plus-solid.svg" event={() => toggle('ModalCreateUser')}>
                Thêm mới
              </Button>
            </div>
          </div>
        </div>
        <div className={staffStyles['table']}>
          <Table columns={columns} data={listUserFilter} conditionalRowStyles={conditionalRowStyles} />
        </div>
      </div>
      <ModalChangePasswordUser isShow={isShowing} hide={toggle} element={cpn} toast={showToast} user={user} />
      <ModalCreateUser isShow={isShowing} hide={toggle} element={cpn} toast={showToast} />
      <ModalTarget isShow={isShowing} hide={toggle} element={cpn} toast={showToast} user={userTarget} />
      {(queryGetUser.isLoading || queryUpdateActiveUser.isFetching) && <Loading />}
    </>
  );
};

export default Staff;
