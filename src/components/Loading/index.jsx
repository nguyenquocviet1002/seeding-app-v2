import loadingStyles from './Loading.module.scss';

export default function Loading() {
  return (
    <>
      <div className={loadingStyles['loading']}>
        <div className={loadingStyles['loading__box']}></div>
      </div>
      <div className={loadingStyles['body']}></div>
    </>
  );
}
