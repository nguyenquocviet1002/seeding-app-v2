import ReactDOM from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { tokenName } from '../../utils/config';
import { getNameFn } from '../../api/user';
import dayjs from 'dayjs';
import Modal from '../Modal';
import styles from './ModalDetailForm.module.scss';

const ModalDetailForm = ({ isShow, hide, element, data }) => {
  const [token] = useLocalStorage(tokenName, null);

  // Data cho Type Customer (Giống với ModalCreateForm và ModalEditForm)
  const dataTypeCustomer = [
    { id: 'marketing', name: 'Marketing - Việt kiều' },
    { id: 'branch', name: 'Chi nhánh - Việt Kiều' },
    { id: 'mkt_oversea', name: 'Marketing - Quốc tế' },
    { id: 'branch_oversea', name: 'Chi nhánh - Quốc tế' },
  ];

  const queryGetName = useQuery({
    queryKey: ['get-name', token],
    queryFn: () => getNameFn(token),
  });

  // Tìm tên hiển thị của type_customer
  // Thêm kiểm tra an toàn cho 'data' và 'data.type_customer'
  const customerTypeName = data && data.type_customer
    ? (dataTypeCustomer.find((item) => item.id === data.type_customer)?.name || 'Trống')
    : 'Trống';


  return isShow && element === 'ModalDetailForm'
    ? ReactDOM.createPortal(
      <>
        <Modal title="Chi tiết" hide={hide} size="large">
          <div className={styles['group']}>
            <div className={styles['control']}>
              <label className={styles['label']}>Mã</label>
              <input
                type="text"
                className={styles['input']}
                value={data?.code_form ? data.code_form : 'Trống'} // Thêm optional chaining
                disabled
              />
            </div>
            <div className={styles['control']}>
              <label className={styles['label']}>Họ tên</label>
              <input
                type="text"
                className={styles['input']}
                value={data?.name ? data.name : 'Trống'} // Thêm optional chaining
                disabled
              />
            </div>
          </div>
          <div className={styles['group']}>
            <div className={styles['control']}>
              <label className={styles['label']}>Số điện thoại</label>
              <input
                type="text"
                className={styles['input']}
                value={data?.phone ? data.phone : 'Trống'} // Thêm optional chaining
                disabled
              />
            </div>
            <div className={styles['control']}>
              <label className={styles['label']}>Facebook</label>
              <a
                href={data?.link_fb || '#'} // Thêm optional chaining và fallback href
                className={`${styles['input']} ${styles['link']}`}
                target="_blank"
                rel="noreferrer"
              >
                {data?.name_fb ? data.name_fb : 'Trống'} // Thêm optional chaining
              </a>
            </div>
          </div>
          <div className={styles['group']}>
            <div className={styles['control']}>
              <label className={styles['label']}>Dịch vụ</label>
              <input
                type="text"
                className={styles['input']}
                value={data?.service ? data.service : 'Trống'} // Thêm optional chaining
                disabled
              />
            </div>
            <div className={styles['control']}>
              <label className={styles['label']}>Chi nhánh</label>
              <input
                type="text"
                className={styles['input']}
                value={data?.company_name ? data.company_name : 'Trống'} // Thêm optional chaining
                disabled
              />
            </div>
          </div>
          <div className={styles['group']}>
            <div className={styles['control']}>
              <label className={styles['label']}>Kịch bản</label>
              <input
                type="text"
                className={styles['input']}
                value={data?.script ? data.script : 'Trống'} // Thêm optional chaining
                disabled
              />
            </div>
            <div className={styles['control']}>
              <label className={styles['label']}>Link Fanpage [Bác sĩ]</label>
              <a
                href={data?.interactive_proof || '#'} // Thêm optional chaining và fallback href
                className={`${styles['input']} ${styles['link']}`}
                target="_blank"
                rel="noreferrer"
              >
                {data?.interactive_proof ? data.interactive_proof : 'Trống'} // Thêm optional chaining
              </a>
            </div>
          </div>
          <div className={styles['group']}>
            <div className={styles['control']}>
              <label className={styles['label']}>Bác sĩ</label>
              <input
                type="text"
                className={styles['input']}
                value={data?.doctor_id?.name ? data.doctor_id.name : 'Trống'} // Thêm optional chaining cho data và doctor_id
                disabled
              />
            </div>
            <div className={styles['control']}>
              <label className={styles['label']}>Loại khách hàng</label>
              <input
                type="text"
                className={styles['input']}
                value={customerTypeName}
                disabled
              />
            </div>
          </div>
          <div className={styles['group']}>
            <div className={styles['control']}>
              <label className={styles['label']}>Thời gian</label>
              <input
                type="text"
                className={styles['input']}
                value={data?.create_date ? dayjs(data.create_date).format('DD/MM/YYYY, HH:mm:ss') : 'Trống'} // Thêm optional chaining
                disabled
              />
            </div>
            {queryGetName.isSuccess && queryGetName.data.data.data.rule === 'admin' && (
              <div className={styles['control']}>
                <label className={styles['label']}>Ticket Caresoft</label>
                <a
                  href={data?.link_url || '#'} // Thêm optional chaining và fallback href
                  className={`${styles['input']} ${styles['link']}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {data?.link_url ? data.link_url : 'Trống'} // Thêm optional chaining
                </a>
              </div>
            )}
          </div>
          <div className={styles['group--full']}>
            <label className={styles['label']}>Ghi chú</label>
            <textarea
              className={`${styles['input']} ${styles['textarea']}`}
              value={data?.note ? data.note : 'Trống'} // Thêm optional chaining
              disabled
            ></textarea>
          </div>
        </Modal>
      </>,
      document.body,
    )
    : null;
};

export default ModalDetailForm;