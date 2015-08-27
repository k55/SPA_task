jQuery(document).ready(function () {
'use strict';
  var formData = {};
  var storedFormData;
  var formFields = ['name', 'email', 'country', 'company', 'description'];

  // step1Init start
  function step1Init () {

    // Call validator for <=IE9 browsers if this one of them
    $('#pageContent').trigger('IE', [$('#form')]);

    // Submit handler
    $('#pageContent #form').submit(function(e) {
      e.preventDefault();
      // Make array-like object of inputed to form data
      for (var i = formFields.length - 1; i >= 0; i--) {
          var t =  i ;
          formData[formFields[i]] = $('#'+ formFields[i]).val();
      };
      // Store form data if browser allows
      if(typeof(localStorage) !== "undefined"){
        localStorage.setItem("storedFormData", JSON.stringify(formData))
      } else {
        console.log("This browser does not support web Storage!")
      }
      if($(this).valid()){
        Router.navigate('/step2');
      }

    });

    // Check if localStorage to get stored data
    if(typeof(localStorage) !== "undefined" && typeof(localStorage.getItem("storedFormData")) !== 'undefined'){
      storedFormData = JSON.parse(localStorage.getItem("storedFormData"));
    } else {
      console.log("There is no stored data in web Storage!")
    }

    // Check if stored data to fill fields with
    if(storedFormData !== undefined && storedFormData !== null){
      for(var i = formFields.length - 1; i >= 0; i--){
        if($('#' + formFields[i]).val() !== null && $('#' + formFields[i]).val() !== undefined){
          // console.log(storedFormData);
          $('#' + formFields[i]).val(storedFormData[formFields[i]]);
        }
      }
    }

  }
  // step1Init END


  // step2Init start
  function step2Init () {

    // Currency changing Start
    // Getting default price values on content load
    var defaultPricesValues = [];
    $('.price').each(function() {
      defaultPricesValues.push($(this).html())
    });
    // Setting default currency sign
    $('.price').prepend('$');
    // Handling select changes, recalculate price view
    $('#currency').change(function() {
      var currentCur = $(this).val();
      var counter = 0;
      $('.price').each(function (counter) {
        $(this).html(convertPrice(currentCur, defaultPricesValues[counter]));
        counter += 1;
      })
    });
    // Price calculator depending on selected currency
    function convertPrice (currency, itemPrice) {
      switch (currency){
        case "USD":
          return "$" + (itemPrice * 1);
        case "EUR":
          return "€" + (itemPrice * 0.87);
        case "UAH":
          return "₴" + (itemPrice * 22.5);
      }
    };
    // Currency changing END

    // Chosing items Start
    var selectedItemName;
    $('.choose').click(function () {

      // Enable sending order btn
      $.fn.hasAttr = function(name) {
         return this.attr(name) !== undefined;
      };
      if($('#sendOrder').hasAttr('disabled')){
        $('#sendOrder').removeAttr('disabled')
      };

      // Getting Name of item to send in Order
      selectedItemName = $(this).siblings('.title').html();

      // Changing color of select-item btn
      $('.choose').each(function (){
        if($(this).hasClass('btn-warning')){
          $(this).removeClass('btn-warning').addClass('btn-success');
        }
      })
      $(this).toggleClass('btn-success').toggleClass('btn-warning');
    })
    // Chosing items END

    // Send order data to server Start
    $('#sendOrder').click(function () {
      var dataToSend = JSON.parse(localStorage.getItem("storedFormData"));
      dataToSend.currency = $('#currency').val();
      dataToSend.itemTitle = selectedItemName;
      $.post('/order/create/', dataToSend)
      .done(function (data, statusText, jQxhr) {
        $('.hint').css({color: 'green', fontWeight: 'bold'}).html("Заказ успешно отправлен!")
        console.log('Request status: ' + jQxhr.status);
      })
      .fail(function () {
        $('.hint').css('color', 'red').html("Ошибка! Заказ НЕ отправлен! (на сервере не работает РНР)")
      })
    })
    // Send order data to server END

  }
  // step2Init END



  // configuration
  Router.config({ mode: 'history'});
  // returning the user to the initial state
  Router.navigate();

  // adding routes
  Router
  .add(/step1/, function() {
    getPage('samples/step1.html');
    $('title').html('Step 1');
  })
  .add(/step2/, function () {
    getPage('samples/step2.html');
    $('title').html('Step 2');
  })
  .add(function() {
    $('title').html('task SPA');
    $('#pageContent').html('<a href="#" id="nextPage">Создать заявку "step1"</a>');

    $('#nextPage').click(function(e){
      e.preventDefault();
      Router.navigate('/step1');
    })
  })
  .check().listen();

  function getPage (path) {
    // console.log("path: " + path);
    $.get(path, function (data) {
      $("#pageContent").html(data);
      if(/1/.test(path)){
        step1Init();
      } else{
        step2Init();
      }
    })
  };

})
