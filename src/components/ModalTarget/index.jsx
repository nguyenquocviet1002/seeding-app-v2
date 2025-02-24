import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  formatMoney,
  numberWithCommas,
  numberWithoutCommas,
  removeFirstItem,
  sortDate,
  tokenName,
} from '../../utils/config';
import { createTargetFn, getTargetFn, updateTargetFn } from '../../api/target';

import Modal from '../Modal';
import Table from '../Table';
import Button from '../Button';

import modalTargetStyles from './ModalTarget.module.scss';
import { images } from '../../assets/images.jsx';

const ModalTarget = ({ isShow, hide, element, toast, user }) => {
  const [token] = useLocalStorage(tokenName, null);

  const queryClient = useQueryClient();

  const initialAddTarget = {
    token: token,
    kpi_date: '',
    kpi_target: '',
    user_seeding: user.code_user,
  };
  const initialEditTarget = {
    token: token,
    id: '',
    kpi_date: '',
    kpi_target: '',
    user_seeding: user.code_user,
  };

  const [info, setInfo] = useState({
    token: token,
    user_seeding: user.code_user,
  });
  const [addTarget, setAddTarget] = useState(initialAddTarget);
  const [editTarget, setEditTarget] = useState(initialEditTarget);
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    setInfo((prev) => ({ ...prev, user_seeding: user.code_user }));
    setAddTarget((prev) => ({ ...prev, user_seeding: user.code_user }));
    setEditTarget((prev) => ({ ...prev, user_seeding: user.code_user }));
  }, [user]);

  const queryGetTarget = useQuery({
    queryKey: ['get-target', info.user_seeding],
    queryFn: () => getTargetFn(info),
    enabled: !info.user_seeding ? false : true,
  });

  const queryCreateTarget = useQuery({
    queryKey: ['create-target'],
    queryFn: () => createTargetFn(addTarget),
    enabled: false,
    onSuccess: () => {
      toast('Thêm mới thành công', 'success');
      queryClient.invalidateQueries({ queryKey: ['get-target', addTarget.user_seeding] });
    },
  });

  const queryUpdateTarget = useQuery({
    queryKey: ['update-target'],
    queryFn: () => updateTargetFn(editTarget),
    enabled: false,
    onSuccess: () => {
      toast('Sửa thành công', 'success');
      queryClient.invalidateQueries({ queryKey: ['get-target', addTarget.user_seeding] });
    },
  });

  const handleChangeAddTarget = (name) => (event) => {
    setAddTarget((prev) => ({
      ...prev,
      [name]: name === 'kpi_target' ? numberWithoutCommas(event.target.value) : event.target.value,
    }));
  };

  const handleChangeEditTarget = (name) => (event) => {
    setEditTarget((prev) => ({
      ...prev,
      [name]: name === 'kpi_target' ? numberWithoutCommas(event.target.value) : event.target.value,
    }));
  };

  const columns = [
    {
      name: 'Thời gian',
      selector: (row) =>
        !isEdit || row.id !== editTarget.id ? (
          row.month
        ) : (
          <input
            type="date"
            className={modalTargetStyles['input']}
            value={editTarget.kpi_date}
            onChange={handleChangeEditTarget('kpi_date')}
          />
        ),
      grow: 2,
    },
    {
      name: 'Target',
      selector: (row) =>
        !isEdit || row.id !== editTarget.id ? (
          formatMoney(row.target)
        ) : (
          <input
            type="type"
            className={modalTargetStyles['input']}
            value={numberWithCommas(editTarget.kpi_target)}
            onChange={handleChangeEditTarget('kpi_target')}
          />
        ),
      center: true,
      grow: 2,
    },
    {
      name: 'Sửa',
      cell: (row) =>
        !isEdit || row.id !== editTarget.id ? (
          <Button
            classItem="primary"
            event={() => {
              setEditTarget((prev) => ({ ...prev, id: row.id, kpi_date: row.date, kpi_target: row.target }));
              setIsEdit(true);
              setIsAdd(false);
            }}
            icon={images.pencil_solid}
            size="small"
          ></Button>
        ) : (
          <div className={modalTargetStyles['ctas__add']}>
            <Button
              classItem="primary"
              event={() => {
                queryUpdateTarget.refetch();
                setIsEdit(false);
                setEditTarget(initialEditTarget);
              }}
              icon={images.check_solid}
              size="small"
            ></Button>
            <Button
              classItem="danger"
              event={() => {
                setIsEdit(false);
                setEditTarget(initialEditTarget);
              }}
              icon={images.xmark_solid}
              size="small"
            ></Button>
          </div>
        ),
      right: true,
    },
  ];

  return isShow && element === 'ModalTarget'
    ? ReactDOM.createPortal(
        <>
          <Modal
            title={user.name}
            hide={() => {
              hide();
              setIsAdd(false);
              setAddTarget(initialAddTarget);
            }}
            size="large"
          >
            {!isAdd ? (
              <div className={modalTargetStyles['add']}>
                <Button
                  classItem="primary"
                  event={() => {
                    setIsAdd(true);
                    setIsEdit(false);
                  }}
                >
                  Thêm mới
                </Button>
              </div>
            ) : (
              <>
                <div className={modalTargetStyles['group']}>
                  <div className={modalTargetStyles['control']}>
                    <input type="date" value={addTarget.kpi_date} onChange={handleChangeAddTarget('kpi_date')} />
                  </div>
                  <div className={modalTargetStyles['control']}>
                    <input
                      type="text"
                      placeholder="Mục tiêu"
                      value={numberWithCommas(addTarget.kpi_target)}
                      onChange={handleChangeAddTarget('kpi_target')}
                    />
                  </div>
                </div>
                <div className={modalTargetStyles['ctas__add']}>
                  <Button
                    classItem="primary"
                    event={() => {
                      queryCreateTarget.refetch();
                      setIsAdd(false);
                      setAddTarget(initialAddTarget);
                    }}
                  >
                    Lưu
                  </Button>
                  <Button
                    classItem="danger"
                    event={() => {
                      setIsAdd(false);
                      setAddTarget(initialAddTarget);
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </>
            )}
            <Table
              columns={columns}
              data={queryGetTarget.isSuccess ? sortDate(removeFirstItem(queryGetTarget.data.data.data)) : []}
              noTableHead
              progressPending={queryGetTarget.isLoading}
            />
          </Modal>
        </>,
        document.body,
      )
    : null;
};

export default ModalTarget;
