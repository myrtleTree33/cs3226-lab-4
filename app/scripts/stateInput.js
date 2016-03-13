var inputState = {
  preload: function() {},
  create: function() {
    $('.container-input').removeClass('hide');
    attachInputFormActions();
  },
  render: function() {},
  update: function() {}
};

var getSolutions = function(graphId) {
  var deferred = new $.Deferred();
  $.getJSON(
    baseUrl + 'matching.php?' + 'graph_id=' + graphId + '&' + 'cmd=' + 'generate',
    function(data) {
      var obj = {
        N: parseInt(data.n),
        M: parseInt(data.m),
        E: data.E
      };
      n = obj.N.length;
      m = obj.M.length;
      currGraphId = graphId;

      solutions.solution = obj;

      if (APP_STATE === appState.DEPLOY) {
        $.getJSON('http://cs3226.comp.nus.edu.sg/matching.php?cmd=solve&graph=' + JSON.stringify(solutions.solution), function(data2) {
          solutions.optimal = data2;
          deferred.resolve();
        });
      } else {
        solutions.optimal = {
          "num_match": 3,
          "match_score": 235,
          "match": [
            [0, 3],
            [1, 4],
            [2, 0]
          ]
        };
        deferred.resolve();
      }
    });
  return deferred.promise();
};

var attachInputFormActions = function() {
  $(document).ready(function() {
    $('.form-input').submit(function(e) {
      e.preventDefault();
      var data = $('.form-input').serializeArray();
      var graphId = data[0].value;

      getSolutions(graphId).done(function() {
        $('.container-input').addClass('hide');
        game.state.start('play');
      });
    });

    $('#btn-login').click(function(e) {
      e.preventDefault();
      var data = $('.form-input').serializeArray();
      var graphId = data[0].value;
      // window.location = 'http://localhost:8000/joel/login.php';
      window.location = 'login.php';
    });

    $('#btn-admin').click(function(e) {
      e.preventDefault();
      var data = $('.form-input').serializeArray();
      var graphId = data[0].value;
      // window.location = 'http://localhost:8000/joel/admin.php';
      window.location = 'admin.php';
    });

  });
};
