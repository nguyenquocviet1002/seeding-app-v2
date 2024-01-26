import { Link } from 'react-router-dom';

import pageNotFoundStyles from './PageNotFound.module.scss';

export default function ScreenPageNotFound() {
  return (
    <div className={pageNotFoundStyles['error__body']}>
      <div className="container">
        <div className={pageNotFoundStyles['error__row']}>
          <div className={pageNotFoundStyles['error__col']}>
            <div className={pageNotFoundStyles['error__page']}>
              <div className={pageNotFoundStyles['error__inner']}>
                <div className={pageNotFoundStyles['error__404']}>404</div>
                <div className={pageNotFoundStyles['error__head']}>Không tìm thấy trang bạn đang tìm kiếm !!!</div>
                <div>
                  <Link to="/" className={pageNotFoundStyles['error__btn']}>
                    Quay lại trang chủ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
