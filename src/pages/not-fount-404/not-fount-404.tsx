import { FC } from 'react';
import styles from './not-fount-404.module.css';

export const NotFound404: FC = () => (
  <div className={styles.container}>
    <h3 className={`pb-6 text text_type_main-large`}>
      Страница не найдена. Ошибка 404.
    </h3>
  </div>
);
