import { useState } from 'react';
import { useModal } from '@/hooks/useModal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { removeFirstItem, tokenName } from '@/utils/config';
import { getFormFn, removeFormFn } from '@/api/form';
import { getUserFn } from '@/api/user';
import Button from '../Button';
import Table from '../Table';
import ModalDetailForm from '../ModalDetailForm';
import ModalCreateForm from '../ModalCreateForm';
import ModalSearchForm from '../ModalSearchForm';
import ModalEditForm from '../ModalEditForm';
import ModalConfirm from '../ModalConfirm';
import Loading from '../Loading';
import formStyles from './Form.module.scss';

const Form = () => {
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useLocalStorage(tokenName, null);
  const initial = {
    brand_id: '',
    type: 'seeding',
    limit: 10,
    offset: 0,
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
  const [body, setBody] = useState(initial);
  const [totalRows, setTotalRows] = useState(0);
  const [itemDetail, setItemDetail] = useState();
  const [itemRemove, setItemRemove] = useState({ token: token, code_form: '' });
  const [filter, setFilter] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { isShowing, cpn, toggle } = useModal();
  const showToast = useOutletContext();

  const queryClient = useQueryClient();

  const queryGetForm = useQuery({
    queryKey: ['get-form', body],
    queryFn: () => getFormFn(body),
    onSuccess: (data) => {
      setTotalRows(data.data.data[0].count_no_limit);
    },
  });

  const queryRemoveForm = useQuery({
    queryKey: ['remove-form'],
    queryFn: () => removeFormFn(itemRemove),
    enabled: false,
    onSuccess: () => {
      handleLoading();
      showToast('Xóa thành công', 'success');
      queryClient.invalidateQueries({ queryKey: ['get-form'] });
    },
  });

  const queryGetUser = useQuery({
    queryKey: ['get-user', token],
    queryFn: () => getUserFn(token),
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
      selector: (row) => row.company_name,
    },
    {
      name: 'Nhân viên',
      selector: (row) => row.seeding_user_name,
      omit: queryGetUser.isSuccess && queryGetUser.data.data.data.rule === 'user' ? true : false,
    },
    {
      name: 'Ngày tạo',
      selector: (row) => new Date(row.create_date).toLocaleDateString('en-GB'),
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
      name: 'Sửa - Xóa',
      cell: (row) => (
        <>
          <Button
            classItem="primary"
            icon="pencil-solid.svg"
            size="small"
            event={() => detailForm(row.id, 'ModalEditForm')}
          ></Button>
          <Button
            classItem="danger"
            icon="trash-solid.svg"
            size="small"
            event={() => {
              toggle('ModalConfirm');
              setItemRemove((prev) => ({ ...prev, code_form: row.code_form }));
            }}
          ></Button>
        </>
      ),
    },
  ];

  const detailForm = (id, modal) => {
    const item = queryGetForm.data.data.data.filter((item) => item.id === id);
    setItemDetail(item[0]);
    setTimeout(() => {
      toggle(modal);
    }, 100);
  };

  const submitSearch = (value) => {
    setBody({ ...body, ...value });
    setFilter(value);
  };

  const removeFilter = () => {
    setBody(initial);
    setFilter();
  };

  const handlePageChange = (page) => {
    setBody({ ...body, offset: (page - 1) * body.limit });
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setBody({ ...body, limit: newPerPage, offset: (page - 1) * newPerPage });
  };

  const removeForm = () => {
    handleLoading();
    queryRemoveForm.refetch();
  };

  const handleLoading = () => {
    setIsLoading(!isLoading);
  };

  return (
    <>
      <div className={formStyles['inner']}>
        <div className={formStyles['head']}>
          <div className={formStyles['top']}>
            <div className={formStyles['title']}>Danh Sách Form</div>
            <div className={formStyles['action']}>
              {filter && (
                <Button classItem="danger" event={removeFilter}>
                  Xóa bộ lọc
                </Button>
              )}
              <Button classItem="primary" icon="magnifying-glass-solid.svg" event={() => toggle('ModalSearchForm')}>
                Tìm kiếm
              </Button>
              <Button classItem="primary" icon="plus-solid.svg" event={() => toggle('ModalCreateForm')}>
                Thêm mới
              </Button>
            </div>
          </div>
          {filter && (
            <div className={formStyles['filter']}>
              <p className={formStyles['filter__title']}>Kết quả tìm kiếm cho: </p>
              <div className={formStyles['filter__box']}>
                {filter.name && <span className={formStyles['filter__item']}>Họ tên: {filter.name}</span>}
                {filter.phone && <span className={formStyles['filter__item']}>Số điện thoại: {filter.phone}</span>}
                {filter.service && <span className={formStyles['filter__item']}>Dịch vụ: {filter.service}</span>}
                {filter.name_fb && <span className={formStyles['filter__item']}>Tên FB: {filter.name_fb}</span>}
                {filter.company_name && (
                  <span className={formStyles['filter__item']}>Chi nhánh: {filter.company_name}</span>
                )}
                {filter.name_seeding && (
                  <span className={formStyles['filter__item']}>Tên nhân viên: {filter.name_seeding}</span>
                )}
                {filter.start_date && (
                  <span className={formStyles['filter__item']}>
                    Ngày bắt đầu: {new Date(filter.start_date).toLocaleDateString('en-GB')}
                  </span>
                )}
                {filter.end_date && (
                  <span className={formStyles['filter__item']}>
                    Ngày kết thúc: {new Date(filter.end_date).toLocaleDateString('en-GB')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className={formStyles['table']}>
          <Table
            columns={columns}
            data={
              queryGetForm.isSuccess && queryGetForm.data.data.count > 1
                ? removeFirstItem(queryGetForm.data.data.data)
                : []
            }
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
          />
        </div>
      </div>
      <ModalConfirm isShow={isShowing} hide={toggle} element={cpn} event={removeForm}>
        Bạn có muốn xóa
      </ModalConfirm>
      <ModalCreateForm isShow={isShowing} hide={toggle} element={cpn} toast={showToast} loading={handleLoading} />
      <ModalSearchForm isShow={isShowing} hide={toggle} element={cpn} event={submitSearch} />
      <ModalEditForm
        isShow={isShowing}
        hide={toggle}
        element={cpn}
        data={itemDetail}
        toast={showToast}
        loading={handleLoading}
      />
      <ModalDetailForm isShow={isShowing} hide={toggle} element={cpn} data={itemDetail} />
      {queryGetForm.isLoading && <Loading />}
      {isLoading && <Loading />}
    </>
  );
};

export default Form;
