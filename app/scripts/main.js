console.log('\'Allo \'Allo!');

var game;
var solnIsOptimal;
var optimalScore;
var score;
var n; // game param n
var m; // game param m

$(window).on('load', function() {
  game = new Phaser.Game("100", "100", Phaser.AUTO, 'phaser-game', {
    create: onReady
  });

  function onReady() {
    game.state.add('boot', bootState);
    game.state.add('input', inputState);
    game.state.add('play', playState);
    game.state.add('result', resultState);
    game.state.start('boot');
    game.kineticScrolling = game.plugins.add(Phaser.Plugin.KineticScrolling);

    game.kineticScrolling.configure({
      kineticMovement: true,
      timeConstantScroll: 325, //really mimic iOS
      horizontalScroll: false,
      verticalScroll: true,
      horizontalWheel: false,
      verticalWheel: true,
      deltaWheel: 40
    });

  }
});
