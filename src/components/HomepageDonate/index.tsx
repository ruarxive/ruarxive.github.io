import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Translate, {translate} from '@docusaurus/Translate';
import Donate from '@site/src/components/Donate';

export default function HomepageDonate(): JSX.Element {
  return (
    <section className={styles.donate}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--6')}>
            <h2 className={styles.donateTitle}>
              <Translate>
                Поддержать проект
              </Translate>
            </h2>
            <p className={styles.donateSubtitle}>
              <Translate>
                Даже небольшое пожертвование позволит проекту Национального цифрового архива России существовать дольше
              </Translate>
            </p>
          </div>
          <div className={clsx('col col--6')}>
            <Donate />
            {/*<iframe frameborder="0" allowtransparency="true" scrolling="no" src="https://money.yandex.ru/quickpay/shop-widget?account=4100174113060&quickpay=shop&payment-type-choice=on&mobile-payment-type-choice=on&writer=seller&targets=%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%B0%D1%82%D1%8C+%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82+%22%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9+%D1%86%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%BE%D0%B9+%D0%B0%D1%80%D1%85%D0%B8%D0%B2%22&targets-hint=&default-sum=1000&button-text=03&successURL=" width="100%" height="260"></iframe>*/}
          </div>
        </div>
      </div>
    </section>
  );
}
