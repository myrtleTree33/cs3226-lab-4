var resultState = {
  preload: function() {},
  create: function() {
    $(document).ready(function() {
      console.log("Is solution optimal? -- ");
      console.log(solnIsOptimal);
      doReport({
        isOptimal: solnIsOptimal,
        score: score,
        optimalScore: optimalScore
      });
    });
  },
  render: function() {},
  update: function() {}
};

var getResult = function() {

};

var doReport = function(stats) {
  var percentage = stats.score / stats.optimalScore * 100 || 0;
  $('.container-result').removeClass('hide');
  $('.input-report').text('Well done!');
  $('.input-percentage').text('You scored ' + percentage + '%.');
  $('.btn-replay').click(function() {
    $('.container-result').addClass('hide');
    game.state.start('boot');
  });
};
