import ReactDOM from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getUserFn } from '@/api/user';
import { tokenName } from '@/utils/config';
import Modal from '../Modal';
import modalDetailForm from './ModalDetailForm.module.scss';

const ModalDetailForm = ({ isShow, hide, element, data }) => {
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useLocalStorage(tokenName, null);

  const queryGetUser = useQuery({
    queryKey: ['get-user', token],
    queryFn: () => getUserFn(token),
  });

  return isShow && element === 'ModalDetailForm'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Chi tiết" hide={hide} size="large">
            <div className={modalDetailForm['group']}>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Mã</label>
                <input
                  type="text"
                  className={modalDetailForm['input']}
                  value={data.code_form ? data.code_form : 'Trống'}
                  disabled
                />
              </div>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Họ tên</label>
                <input
                  type="text"
                  className={modalDetailForm['input']}
                  value={data.name ? data.name : 'Trống'}
                  disabled
                />
              </div>
            </div>
            <div className={modalDetailForm['group']}>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Số điện thoại</label>
                <input
                  type="text"
                  className={modalDetailForm['input']}
                  value={data.phone ? data.phone : 'Trống'}
                  disabled
                />
              </div>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Facebook</label>
                <a
                  href={data.link_fb}
                  className={`${modalDetailForm['input']} ${modalDetailForm['link']}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {data.name_fb ? data.name_fb : 'Trống'}
                </a>
              </div>
            </div>
            <div className={modalDetailForm['group']}>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Dịch vụ</label>
                <input
                  type="text"
                  className={modalDetailForm['input']}
                  value={data.service ? data.service : 'Trống'}
                  disabled
                />
              </div>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Chi nhánh</label>
                <input
                  type="text"
                  className={modalDetailForm['input']}
                  value={data.company_name ? data.company_name : 'Trống'}
                  disabled
                />
              </div>
            </div>
            <div className={modalDetailForm['group']}>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Kịch bản</label>
                <input
                  type="text"
                  className={modalDetailForm['input']}
                  value={data.script ? data.script : 'Trống'}
                  disabled
                />
              </div>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Tương tác</label>
                <a
                  href={data.interactive_proof}
                  className={`${modalDetailForm['input']} ${modalDetailForm['link']}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {data.interactive_proof ? data.interactive_proof : 'Trống'}
                </a>
              </div>
            </div>
            <div className={modalDetailForm['group']}>
              <div className={modalDetailForm['control']}>
                <label className={modalDetailForm['label']}>Thời gian</label>
                <input
                  type="text"
                  className={modalDetailForm['input']}
                  value={data.create_date ? new Date(data.create_date).toLocaleString('en-GB') : 'Trống'}
                  disabled
                />
              </div>
              {queryGetUser.isSuccess && queryGetUser.data.data.data.rule === 'admin' && (
                <div className={modalDetailForm['control']}>
                  <label className={modalDetailForm['label']}>Ticket Caresoft</label>
                  <a
                    href={data.link_url}
                    className={`${modalDetailForm['input']} ${modalDetailForm['link']}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {data.link_url ? data.link_url : 'Trống'}
                  </a>
                </div>
              )}
            </div>
            <div className={modalDetailForm['group--full']}>
              <label className={modalDetailForm['label']}>Ghi chú</label>
              <textarea
                className={`${modalDetailForm['input']} ${modalDetailForm['textarea']}`}
                value={data.note ? data.note : 'Trống'}
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
