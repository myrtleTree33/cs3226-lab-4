var bootState = {
  preload: function() {},
  create: function() {
    console.log(game);
    console.log('i am loaded')
    game.state.start('input');
    // game.state.start('play');
  }
};
