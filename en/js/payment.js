this.payMonthly = function () {
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
  )
};

this.paySingle = function () {
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
  )
};

// $('#checkout').click(pay);