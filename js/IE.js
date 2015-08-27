  // jQuery-validate launching
IEhandler = function (e, form){
  form.validate({
    messages: {
      name: "Введите Ваше имя",
      email: "Введите Вашу электронную почту",
      country: "Выберите страну",
      company: "Введите название Вашей компании"
    }
  })
}

  $('#pageContent').on('IE', IEhandler);