---
sidebar_position: 3
position: 3
---

# Поддержать проект

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export function PaymentMonthlyBtn() { 
  function handleSubmit(e) {
    e.preventDefault();
    var widget = new cp.CloudPayments();
    widget.pay('auth', // или 'charge'
        { //options
            publicId: 'pk_3018668db11eb861d16c3d8a73bf1', //id из личного кабинета
            description: 'Ежемесячная помощь проекту ruarxive.org', //назначение
            amount: 100, //сумма
            currency: 'RUB', //валюта
            requireEmail: true, //требование указать e-mail адрес пользователя в виджете
            accountId: 'user@example.com', //идентификатор плательщика (необязательно)
            // invoiceId: '1234567', //номер заказа  (необязательно)
            // email: 'user@example.com', //email плательщика (необязательно)
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
    console.log('You clicked submit.');
  }
  return (
  <form onSubmit={handleSubmit}>
    <button type="submit" className="button button--primary button--lg">Помогать проекту ежемесячно</button>
  </form>
  )
}

export function PaymentSingleBtn() { 
  function handleSubmit(e) {
    e.preventDefault();
    var widget = new cp.CloudPayments();
    widget.pay('auth', // или 'charge'
        { //options
            publicId: 'pk_3018668db11eb861d16c3d8a73bf1', //id из личного кабинета
            description: 'Помощь проекту ruarxive.org', //назначение
            amount: 500, //сумма
            currency: 'RUB', //валюта
            // accountId: 'user@example.com', //идентификатор плательщика (необязательно)
            // invoiceId: '1234567', //номер заказа  (необязательно)
            // email: 'user@example.com', //email плательщика (необязательно)
            skin: "mini", //дизайн виджета (необязательно)
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
    console.log('You clicked submit.');
  }
  return (
  <form onSubmit={handleSubmit}>
    <button type="submit" className="button button--primary button--lg">Помочь проекту</button>
  </form>
  )
}

<Tabs>

  <TabItem value="single" label="Единовременно" default>
    <PaymentSingleBtn></PaymentSingleBtn>
  </TabItem>

  <TabItem value="monthly" label="Ежемесячно">
    <PaymentMonthlyBtn></PaymentMonthlyBtn>
  </TabItem>

  <TabItem value="bank" label="Банковским переводом">

  АНО "ИНФОКУЛЬТУРА"  
  ИНН 7702389486  
  Расчётный счёт 40703 810 8026 2000 0019 в АО "АЛЬФА-БАНК" Г МОСКВА  
  БИК 044525593   
  к/с 30101810200000000593  
  Назначение платежа: добровольный благотворительный взнос  

  </TabItem>

</Tabs>

<!-- <Tabs>

  <TabItem value="single" label="Единовременно" default>
    <input type="submit" value="Помочь проекту" className="button button--primary button--lg" onClick={paySingle} />
  </TabItem>

  <TabItem value="monthly" label="Ежемесячно">
    <input type="submit" value="Помогать проекту ежемесячно" className="button button--primary button--lg" onClick={payMonthly} />
  </TabItem>

  <TabItem value="bank" label="Банковским переводом">

  	АНО "ИНФОКУЛЬТУРА"  
  	ИНН 7702389486  
  	Расчётный счёт 40703 810 8026 2000 0019 в АО "АЛЬФА-БАНК" Г МОСКВА  
  	БИК 044525593   
  	к/с 30101810200000000593  
  	Назначение платежа: добровольный благотворительный взнос  

  </TabItem>

</Tabs> -->


<!-- <Tabs>

  <TabItem value="monthly" label="Ежемесячно" default>
    <input type="submit" value="Помогать проекту ежемесячно" className="button button--primary button--lg" onClick={payMonthly} />
    <form>
      <div class="form-group">
          <label for="monthlycustominput">Укажите сумму пожертвования в рублях</label>
          <div class="input-group">
              <input type="text" class="form-control" id="monthlycustominput" value="100"></input>
          </div>
      </div>
      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="monthlyaccept" required=""></input>
        <label class="form-check-label" for="monthlyaccept">Нажимая на кнопку «Помогать проекту ежемесячно» я принимаю условия <a href="https://www.infoculture.ru/wp-content/uploads/2019/01/Publichnaja-oferta-dlja-pozhertvovanii-.docx">договора оферты</a> <span style={{color: 'red'}}>*</span></label>
      </div>
      <button type="button" class="btn btn-primary payModalBtn">
        Помогать проекту ежемесячно
      </button>
    </form>
  </TabItem>

  <TabItem value="single" label="Единовременно">
    <input type="submit" value="Помочь проекту" className="button button--primary button--lg" onClick={paySingle} />
    <form>
      <div class="form-group">
          <label for="singletimecustominput">Укажите сумму пожертвования в рублях</label>
          <div class="input-group">
              <input type="text" class="form-control" id="singletimecustominput" value="500"></input>
          </div>
      </div>
      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="singletimeaccept" required=""></input>
        <label class="form-check-label" for="singletimeaccept">Нажимая на кнопку «Помочь проекту» я принимаю условия <a href="https://www.infoculture.ru/wp-content/uploads/2019/01/Publichnaja-oferta-dlja-pozhertvovanii-.docx">договора оферты</a> <span style={{color: 'red'}}>*</span></label>
      </div>
      <button type="button" class="btn btn-primary payModalBtn">
        Помочь проекту
      </button>
    </form>
  </TabItem>

  <TabItem value="bank" label="Банковским переводом">

    АНО "ИНФОКУЛЬТУРА"  
    ИНН 7702389486  
    Расчётный счёт 40703 810 8026 2000 0019 в АО "АЛЬФА-БАНК" Г МОСКВА  
    БИК 044525593   
    к/с 30101810200000000593  
    Назначение платежа: добровольный благотворительный взнос  

  </TabItem>

</Tabs> -->

<!-- <script src="https://widget.cloudpayments.ru/bundles/cloudpayments"></script>
<script src="../static/js/payment.js"></script> -->


<!-- <iframe frameborder="0" allowtransparency="true" scrolling="no" src="https://money.yandex.ru/quickpay/shop-widget?account=4100174113060&quickpay=shop&payment-type-choice=on&mobile-payment-type-choice=on&writer=seller&targets=%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%B0%D1%82%D1%8C+%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82+%22%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9+%D1%86%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%BE%D0%B9+%D0%B0%D1%80%D1%85%D0%B8%D0%B2%22&targets-hint=&default-sum=1000&button-text=03&successURL=" width="450" height="260"></iframe> -->



<!-- #### Перевести банковским переводом:

АНО "ИНФОКУЛЬТУРА", ИНН 7702389486  
Расчётный счёт 40703 810 8026 2000 0019 в АО "АЛЬФА-БАНК" Г МОСКВА, БИК 044525593, к/с 30101810200000000593  
Назначение платежа: добровольный благотворительный взнос -->
