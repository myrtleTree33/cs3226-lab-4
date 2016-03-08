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
  $('.input-score').text(stats.score);

  var statUrl = baseUrl + 'matching.php?' + 'graph_id=' + currGraphId + '&' + 'cmd=' + 'submit' + '&solution=' + JSON.stringify(userSolution);
  console.log(statUrl);
  $.getJSON(statUrl,
    function(data) {
      $('.input-highest-score').text(data['match_score']);
      $('.input-highest-score-num-matches').text(data['num_match']);
      if (data['num_best'] == 1) {
        $('.input-report').text('New score achieved!');
      } else {
        $('.input-report').text('Please try harder');
      }
    }).error(function(xhr, status, error) {
        $('.input-report').text('Invalid Solution!');
        $('.report-container').text('Oops - did you tinker with server-side information?  Gotcha.  Here is the response from server= ' + xhr.responseText);
  });

  $('.btn-replay').click(function() {
    $('.container-result').addClass('hide');
    game.state.start('boot');
  });

};
