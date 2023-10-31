import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import defaultLayoutStyles from './DefaultLayout.module.scss';

const DefaultLayout = ({ children }) => {
  return (
    <>
      <Header />
      <Sidebar />
      <main className={defaultLayoutStyles['main']}>
        <div className="container-full">
          <div className={defaultLayoutStyles['content']}>{children}</div>
        </div>
      </main>
    </>
  );
};

export default DefaultLayout;
