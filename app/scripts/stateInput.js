var inputState = {
  preload: function() {},
  create: function() {
    $('.container-input').removeClass('hide');
    attachInputFormActions();
  },
  render: function() {},
  update: function() {}
};

var getSolutions = function(n, m) {
  var deferred = new $.Deferred();
  $.getJSON(
    'matching.php?' + 'n=' + n + '&' + 'm=' + m,
    function(data) {
      solutions.solution = data;
      $.getJSON('http://cs3226.comp.nus.edu.sg/matching.php?cmd=solve&graph=' + JSON.stringify(solutions.solution), function(data2) {
        solutions.optimal = data2;
        deferred.resolve();
      });
    });
  return deferred.promise();
};

var attachInputFormActions = function() {
  $(document).ready(function() {
    $('.form-input').submit(function(e) {
      e.preventDefault();
      var data = $('.form-input').serializeArray();
      n = data[0].value;
      m = data[1].value;

      // getSolutions(n, m).done(function() {
        $('.container-input').addClass('hide');
        game.state.start('play');
      // });

    });
  });
};
