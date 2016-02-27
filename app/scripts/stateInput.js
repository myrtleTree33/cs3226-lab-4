var inputState = {
  preload: function() {},
  create: function() {
    $('.container-input').removeClass('hide');
    attachInputFormActions();
  },
  render: function() {},
  update: function() {}
};

var attachInputFormActions = function() {
  $(document).ready(function() {
    $('.form-input').submit(function(e) {
      e.preventDefault();
      var data = $('.form-input').serializeArray();
      n = data[0].value;
      m = data[1].value;
    $('.container-input').addClass('hide');
      game.state.start('play');
    });
  });
};
