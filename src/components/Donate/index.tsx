import React, { ChangeEvent, ChangeEventHandler, useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Translate, {translate} from '@docusaurus/Translate';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CurrencyInput from 'react-currency-input-field';


// === Единовременная помощь
function PaymentSingleBtn() {

  const [sum, setSum] = useState("1000");

  const handleChange = (value: string | undefined): void => {
    const sum = value === undefined ? 'undefined' : value;
    setSum(sum || ' ');
    // if (!value) {
    //   setClassName('');
    // } else if (Number.isNaN(Number(value))) {
    //   setErrorMessage('Please enter a valid number');
    //   setClassName('is-invalid');
    // } else {
    //   setClassName('is-valid');
    // }
  };

  function handleSubmit(e) {
    e.preventDefault();
    // console.log(+sum);
    var widget = new cp.CloudPayments();
    widget.pay('auth', // или 'charge'
      { //options
        publicId: 'pk_3018668db11eb861d16c3d8a73bf1', //id из личного кабинета
        description: 'Помощь проекту ruarxive.org', //назначение
        amount: +sum, //сумма
        currency: 'RUB', //валюта
        // accountId: 'user@example.com', //идентификатор плательщика (необязательно)
        // invoiceId: '1234567', //номер заказа  (необязательно)
        // email: 'user@example.com', //email плательщика (необязательно)
        skin: 'mini', //дизайн виджета (необязательно)
        data: {
          myProp: 'myProp value'
        }
      },
      {
        onSuccess: function (options) { // success
            //действие при успешной оплате
        },
        onFail: function (reason, options) { // fail
            //действие при неуспешной оплате
        },
        onComplete: function (paymentResult, options) { //Вызывается как только виджет получает от api.cloudpayments ответ с результатом транзакции.
            //например вызов вашей аналитики Facebook Pixel
        }
      }
    );
    
    // console.log('SUBMIT. Value = ' + sum);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={'row row--no-gutters margin-bottom--md'}>
        <div className={'col'}>
          <CurrencyInput
            placeholder="Please enter a number"
            defaultValue={1000}
            value={sum}
            allowDecimals={false}
            allowNegativeValue={false}
            suffix={' ₽'}
            decimalSeparator={','}
            groupSeparator={' '}
            maxLength={7}
            step={50}
            onValueChange={handleChange}
            className={styles.donateInput}
          />
        </div>
      </div>
      <div className={'row row--no-gutters'}>
        <div className={'col'}>
          <button type="submit" className={clsx('button button--primary button--lg', styles.donateBtn)}>
            <Translate>
              Support project
            </Translate>
          </button>
        </div>
      </div>
    </form>
  )

}

// === Ежемесячная помощь
function PaymentMonthlyBtn() { 
  const [sum, setSum] = useState("200");
  const [email, setEmail] = useState("");

  const handleChange = (value: string | undefined): void => {
    const sum = value === undefined ? 'undefined' : value;
    setSum(sum || ' ');
    // if (!value) {
    //   setClassName('');
    // } else if (Number.isNaN(Number(value))) {
    //   setErrorMessage('Please enter a valid number');
    //   setClassName('is-invalid');
    // } else {
    //   setClassName('is-valid');
    // }
  };

  const handleChange2 = (e: React.FormEvent<HTMLInputElement>): void => {
    // const email = "";
    setEmail({email: e.currentTarget.value});
    // console.log(email)
  };

  function handleSubmit(e) {
    e.preventDefault();
    var widget = new cp.CloudPayments();
    widget.pay('auth', // или 'charge'
      { //options
        publicId: 'pk_3018668db11eb861d16c3d8a73bf1', //id из личного кабинета
        description: 'Ежемесячная помощь проекту ruarxive.org', //назначение
        amount: +sum, //сумма
        currency: 'RUB', //валюта
        requireEmail: true, //требование указать e-mail адрес пользователя в виджете
        accountId: email.email, //идентификатор плательщика (необязательно)
        // invoiceId: '1234567', //номер заказа  (необязательно)
        email: email.email, //email плательщика (необязательно)
        skin: "mini", //дизайн виджета (необязательно)
        data: {
          CloudPayments: {
            recurrent: {
              interval: 'Month',
              period: 1, 
            }
          }
        }
      },
      {
        onSuccess: function (options) { // success
            //действие при успешной оплате
        },
        onFail: function (reason, options) { // fail
            //действие при неуспешной оплате
        },
        onComplete: function (paymentResult, options) { //Вызывается как только виджет получает от api.cloudpayments ответ с результатом транзакции.
            //например вызов вашей аналитики Facebook Pixel
        }
      }
    );
    // console.log('SUBMIT. Value = ' + email.email+ '');
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className={'row row--no-gutters margin-bottom--xs'}>
        <div className={'col'}>
          <CurrencyInput
            placeholder="Please enter a number"
            defaultValue={1000}
            value={sum}
            allowDecimals={false}
            allowNegativeValue={false}
            suffix={' ₽'}
            decimalSeparator={','}
            groupSeparator={' '}
            maxLength={7}
            step={50}
            onValueChange={handleChange}
            className={styles.donateInput}
          />
        </div>
      </div>
      <div className={'row row--no-gutters margin-bottom--md'}>
        <div className={'col'}>
          <label style={{color: 'black'}}>
            <Translate>E-mail</Translate><span style={{color: 'red'}}>*</span> <span className={styles.donateDisclaimer}>(<Translate>required in case of subscription cancellation</Translate>)</span>
          </label>
          <input type="email" className={styles.donateInput} onChange={handleChange2} required/>
        </div>
      </div>
      <div className={'row row--no-gutters'}>
        <div className={'col'}>
          <button type="submit" className={clsx('button button--primary button--lg', styles.donateBtn)}><Translate>Support project monthly</Translate></button>
        </div>
      </div>
    </form>
  )
}



export default function Donate(): JSX.Element {
  return (
    <div className={styles.donateCard}>
      <div className={'card padding--md'}>{/*
        <div className={'card__header'}>
          <h3>Lorem Ipsum</h3>
        </div>*/}
        <div className={'card__body'}>
          <Tabs className={'tabs--block margin-bottom--lg'}>

            <TabItem 
              value="single" 
              label={
                translate({
                  message: 'One-time',
                  description: 'Single payment',
                })
              } 
              attributes={{className: styles.donateTabsItem}} 
              default
            >
              <PaymentSingleBtn></PaymentSingleBtn>
            </TabItem>

            <TabItem 
              value="monthly" 
              label={
                translate({
                  message: 'Monthly',
                  description: 'Monthly payment',
                })
              } 
              attributes={{className: styles.donateTabsItem}}
            >
              <PaymentMonthlyBtn></PaymentMonthlyBtn>
            </TabItem>

            {/*<TabItem value="bank" label="Переводом" attributes={{className: styles.donateTabsItem}}>

            АНО "ИНФОКУЛЬТУРА"  
            ИНН 7702389486  
            Расчётный счёт 40703 810 8026 2000 0019 в АО "АЛЬФА-БАНК" Г МОСКВА  
            БИК 044525593   
            к/с 30101810200000000593  
            Назначение платежа: добровольный благотворительный взнос  

            </TabItem>*/}

          </Tabs>
        </div>
        <div className={'card__footer padding-top--none'}>
          <div className={styles.donateDisclaimer}>
            <p>
              Нажатие кнопки означает согласие с <a href="https://www.infoculture.ru/wp-content/uploads/2019/01/Publichnaja-oferta-dlja-pozhertvovanii-.docx" target="_blank">договором оферты</a>
            </p>
            {/*<p>Вы также можете помочь проекту через банковский перевод по реквизитам:</p>
            <p>
              АНО "ИНФОКУЛЬТУРА" <br/>
              ИНН 7702389486 <br/>
              Расчётный счёт 40703 810 8026 2000 0019 в АО "АЛЬФА-БАНК" Г МОСКВА <br/>
              БИК 044525593  <br/>
              к/с 30101810200000000593 <br/>
              Назначение платежа: добровольный благотворительный взнос
            </p>*/}
          </div>
        </div>
      </div>
    </div>
  );
}
