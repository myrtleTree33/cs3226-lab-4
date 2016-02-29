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
  $('.container-result').removeClass('hide');
  if (stats.isOptimal) {
    $('.input-report').text('Well done!');
  } else {
    $('.input-report').text('Please try harder');
  }
  $('.input-score').text(stats.score);
  $('.input-optimal-score').text(stats.optimalScore);
  $('.btn-replay').click(function() {
    $('.container-result').addClass('hide');
    game.state.start('boot');
  });
};
