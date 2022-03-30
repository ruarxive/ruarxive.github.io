export default closeModalFooter = function() {
  $("#paymentModal .modal-footer").hide();
};

var payHandler = function (am, sub, d) {
    var widget = new cp.CloudPayments();
    widget.charge({ // options
            publicId: 'pk_04ac688be709c5d6935413f4ed11d',
            description: 'Помощь проекту infoculture.ru',
            amount: am, //сумма
            currency: 'RUB',
            invoiceId: 'IK-'+sub, //номер заказа
            accountId: '', //плательщик
            requireEmail: true,
            data: d,
        },
        function (options) { // success
            //действие при успешном платеже
            // console.log("DONE");
            // closeModalFooter();
            // $("#messageModal .modal-title").text("Платеж прошел успешно");
            // $("#messageModal .modal-body").text("Спасибо за помощь в развитии проекта!");
            // $('#messageModal').modal('show');
        },
        function (reason, options) { // fail
            //действие при неуспешном платеже
            console.log("ERROR: " + reason);
            // closeModalFooter();
            // $("#messageModal .modal-title").text("Платеж не прошел");
            // $("#messageModal .modal-body").text("Причина: " + reason);
            // $('#messageModal').modal('show');
        });
};

var modalHandler = function () {
  var amount = 100;
  var monthly = true;
  var subscribe = "";
  var data = {};
  var periodText = "";

  if ( $("#monthly-tab").hasClass("vc_active") ) {
    $('.form-error').remove();
    if ($('#monthlyaccept').is(':checked')) {
      monthly = true;
      periodText = "ежемесячно";
      subscribe = "subscribe";
      amount = Number( $("#monthlycustominput").val() )
      data.cloudPayments = { recurrent: { interval: 'Month', period: 1 } };
      payHandler(amount, subscribe, data);
    } else {
      $("#monthly-tab form").prepend("<div class='form-error'>Заполните обязательные поля</div>")
      return false;
    };
  } else if ($("#singletime-tab").hasClass("vc_active")) {
    $('.form-error').remove();
    if ($('#singletimeaccept').is(':checked')) {
      monthly = false;
      periodText = "единовременно";
      subscribe = "single";
      amount = Number( $("#singletimecustominput").val() )
      data = {};
      payHandler(amount, subscribe, data);
    } else {
      $("#singletime-tab form").prepend("<div class='form-error'>Заполните обязательные поля</div>")
      return false;
    };
  };
  // console.log(subscribe);
  // console.log(data);
  
};

$(".payModalBtn").on("click", modalHandler); //кнопка "Помочь проекту"
// $("#payButton").on("click", payHandler); //кнопка "Оплатить"
// $( "#monthlycustominput, #singletimecustominput" )
//   .change(function () {
//     console.log( $(this).val() )
//   })
//   .change();