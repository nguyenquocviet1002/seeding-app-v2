import ReactDOM from 'react-dom';
import dayjs from 'dayjs';
import Modal from '../Modal';
import modalDetailBookingStyles from './ModalDetailBooking.module.scss';

const ModalDetailBooking = ({ isShow, hide, element, data }) => {
  return isShow && element === 'ModalDetailBooking'
    ? ReactDOM.createPortal(
        <>
          <Modal title="Chi tiết" hide={hide} size="Xlarge">
            <div className={modalDetailBookingStyles['bot']}>
              <div className={modalDetailBookingStyles['aside']}>
                <div className={modalDetailBookingStyles['infoName']}>
                  <div className={modalDetailBookingStyles['infoIcon']}>
                    <img width="150" height="150" src={`${process.env.PUBLIC_URL}/images/icon-info.png`} alt="" />
                  </div>
                  <span>Thông tin cá nhân</span>
                </div>
                <div className={modalDetailBookingStyles['infoContent']}>
                  <div className={modalDetailBookingStyles['infoContentItem']}>
                    <div className={modalDetailBookingStyles['infoLabel']}>Họ tên:</div>
                    <div className={modalDetailBookingStyles['infoValue']}>{data.contact_name}</div>
                  </div>
                  <div className={modalDetailBookingStyles['infoContentItem']}>
                    <div className={modalDetailBookingStyles['infoLabel']}>Điện thoại 1:</div>
                    <div className={modalDetailBookingStyles['infoValue']}>{data.phone_1}</div>
                  </div>
                  {data.phone_2 && (
                    <div className={modalDetailBookingStyles['infoContentItem']}>
                      <div className={modalDetailBookingStyles['infoLabel']}>Điện thoại 2:</div>
                      <div className={modalDetailBookingStyles['infoValue']}>{data.phone_2}</div>
                    </div>
                  )}
                  {data.city && (
                    <div className={modalDetailBookingStyles['infoContentItem']}>
                      <div className={modalDetailBookingStyles['infoLabel']}>Tỉnh/TP:</div>
                      <div className={modalDetailBookingStyles['infoValue']}>{data.city}</div>
                    </div>
                  )}
                  {data.booking_date && (
                    <div className={modalDetailBookingStyles['infoContentItem']}>
                      <div className={modalDetailBookingStyles['infoLabel']}>Ngày hẹn lịch:</div>
                      <div className={modalDetailBookingStyles['infoValue']}>
                        {dayjs(data.booking_date).format('DD/MM/YYYY')}
                      </div>
                    </div>
                  )}
                  {data.day_expire && (
                    <div className={modalDetailBookingStyles['infoContentItem']}>
                      <div className={modalDetailBookingStyles['infoLabel']}>Hiệu lực đến ngày:</div>
                      <div className={modalDetailBookingStyles['infoValue']}>
                        {dayjs(data.day_expire).format('DD/MM/YYYY')}
                      </div>
                    </div>
                  )}
                  {data.effect && (
                    <div className={modalDetailBookingStyles['infoContentItem']}>
                      <div className={modalDetailBookingStyles['infoLabel']}>Trạng thái hiệu lực:</div>
                      <div className={modalDetailBookingStyles['infoValue']}>{data.effect}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={modalDetailBookingStyles['aside']}>
                <div className={modalDetailBookingStyles['infoName']}>
                  <div className={modalDetailBookingStyles['infoIcon']}>
                    <img width="150" height="150" src={`${process.env.PUBLIC_URL}/images/icon-bookmark.png`} alt="" />
                  </div>
                  <span>Thông tin cá nhân</span>
                </div>
                <div className={modalDetailBookingStyles['infoContent']}>
                  {data.code_booking && (
                    <div className={modalDetailBookingStyles['infoContentItem']}>
                      <div className={modalDetailBookingStyles['infoLabel']}>Mã booking:</div>
                      <div className={modalDetailBookingStyles['infoValue']}>{data.code_booking}</div>
                    </div>
                  )}
                  <div className={modalDetailBookingStyles['infoContentItem']}>
                    <div className={modalDetailBookingStyles['infoLabel']}>Dịch vụ:</div>
                    <div className={modalDetailBookingStyles['infoValue']}>
                      {data.line_ids.length !== 0 ? data.line_ids.join(', ') : 'Trống'}
                    </div>
                  </div>
                  <div className={modalDetailBookingStyles['infoContentItem']}>
                    <div className={modalDetailBookingStyles['infoLabel']}>Trạng thái:</div>
                    <div className={modalDetailBookingStyles['infoValue']}>{data.stage_id}</div>
                  </div>
                  {data.dongia > 0 && (
                    <div className={modalDetailBookingStyles['infoContentItem']}>
                      <div className={modalDetailBookingStyles['infoLabel']}>Đơn giá:</div>
                      <div className={modalDetailBookingStyles['infoValue']}>
                        {data.dongia
                          ? data.dongia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                          : '0 VND'}
                      </div>
                    </div>
                  )}
                  {data.tien_truoc_giam > 0 && (
                    <div className={modalDetailBookingStyles['infoContentItem']}>
                      <div className={modalDetailBookingStyles['infoLabel']}>Tiền trước giảm:</div>
                      <div className={modalDetailBookingStyles['infoValue']}>
                        {data.tien_truoc_giam
                          ? data.tien_truoc_giam.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                          : '0 VND'}
                      </div>
                    </div>
                  )}
                  {data.tien_phai_thu > 0 && (
                    <div className={modalDetailBookingStyles['infoContentItem']}>
                      <div className={modalDetailBookingStyles['infoLabel']}>Tiền phải thu:</div>
                      <div className={modalDetailBookingStyles['infoValue']}>
                        {data.tien_phai_thu
                          ? data.tien_phai_thu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                          : '0 VND'}
                      </div>
                    </div>
                  )}
                  {data.tien_da_thu > 0 && (
                    <div className={modalDetailBookingStyles['infoContentItem']}>
                      <div className={modalDetailBookingStyles['infoLabel']}>Tiền đã thu:</div>
                      <div className={modalDetailBookingStyles['infoValue']}>
                        {data.tien_da_thu
                          ? data.tien_da_thu.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                          : '0 VND'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={modalDetailBookingStyles['main']}>
              <div className={modalDetailBookingStyles['infoName']}>
                <div className={modalDetailBookingStyles['infoIcon']}>
                  <img width="150" height="150" src={`${process.env.PUBLIC_URL}/images/icon-company.png`} alt="" />
                </div>
                <span>Thương hiệu</span>
              </div>
              <div className={modalDetailBookingStyles['infoContent']}>
                <div className={modalDetailBookingStyles['infoContentItem']}>
                  <div
                    className={`${modalDetailBookingStyles['infoLabel']} ${modalDetailBookingStyles['infoLabel--1']}`}
                  >
                    Họ tên:
                  </div>
                  <div className={modalDetailBookingStyles['infoValue']}>{data.brand}</div>
                </div>
                <div className={modalDetailBookingStyles['infoContentItem']}>
                  <div
                    className={`${modalDetailBookingStyles['infoLabel']} ${modalDetailBookingStyles['infoLabel--1']}`}
                  >
                    Điện thoại 1:
                  </div>
                  <div className={modalDetailBookingStyles['infoValue']}>{data.company}</div>
                </div>
                <div className={modalDetailBookingStyles['infoContentItem']}>
                  <div
                    className={`${modalDetailBookingStyles['infoLabel']} ${modalDetailBookingStyles['infoLabel--1']}`}
                  >
                    Ghi chú:
                  </div>
                  <div className={modalDetailBookingStyles['infoValue']}>{data.note ? data.note : 'Trống'}</div>
                </div>
              </div>
            </div>
          </Modal>
        </>,
        document.body,
      )
    : null;
};

export default ModalDetailBooking;
