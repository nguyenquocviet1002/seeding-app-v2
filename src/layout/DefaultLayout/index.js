import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import defaultLayoutStyles from './DefaultLayout.module.scss';

const DefaultLayout = ({ children, showToast }) => {
  const [isShow, setIsShow] = useState(false);
  const toggleLayout = () => {
    setIsShow(!isShow);
  };
  const closeLayout = () => {
    setIsShow(false);
  };

  return (
    <>
      <Header showToast={showToast} />
      <Sidebar isShow={isShow} toggleLayout={toggleLayout} close={closeLayout} />

      <main className={defaultLayoutStyles['main']}>
        <div className="container-full">
          <div className={defaultLayoutStyles['content']}>{children}</div>
        </div>
      </main>
    </>
  );
};

export default DefaultLayout;
