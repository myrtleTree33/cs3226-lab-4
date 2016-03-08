var MAX_SPRITE_WIDTH = 80;
var MAX_SPRITE_HEIGHT = 100;
var MAX_SPRITE_MARGIN_X = 10;
var MAX_SPRITE_MARGIN_Y = 20;

function range(n) {
  // referenced from http://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n , populates an array with [1,2,...,n-1]
  return Object.keys(Array.apply(0, Array(n))).map(Number)
}

function concatArr(arr, x) {
  return arr.map(function(curr) {
    return x + curr;
  });
}

var solution = {
  "N": 2,
  "M": 3,
  "E": [
    [0, 0, 1],
    [0, 1, 99],
    [1, 1, 81]
  ]
};



var optimal = {
  "num_match": 2,
  "match_score": 82,
  "match": [
    [0, 0],
    [1, 1]
  ]
};

// TODO comment mocks in deploy mode
// solutions.solution = solution;
// solutions.optimal = optimal;
// end uncomment mocks in deploy mode

var currentSoln;
var selcLine;
var selection;
var validLines;

// groups
var all, left, right, possibilities;

var checkGameOver = function(optimalSoln, currentSoln) {
  return optimalSoln.match.length === currentSoln.matches.length;
};

var setSelection = function(target) {
  if (selection.length == 0) {
    selection.push(target);
  } else if (selection.length == 1) {
    if (selection[0] == target) {
      selection = [];
    } else {
      selection.push(target);
      checkValidSolution(solution, selection[0], selection[1]); // check the ans
      solnIsOptimal = isOptimalSoln(optimal, currentSoln);

      // check for game over
      if (checkGameOver(optimal, currentSoln)) {
        game.kineticScrolling.stop();
        game.kineticScrolling.stop();
        score = currentSoln.score;
        game.state.start('result');
        score = currentSoln.score;
        game.state.start('result');
      }

    }
  } else { // selection is 2, check the ans
    selection = [];
    selection.push(target);
  }
};

var isOptimalSoln = function(optimalSoln, currentSoln) {
  if (optimalSoln.match_score !== currentSoln.score) {
    return false;
  }
  if (optimalSoln.match.length !== currentSoln.matches.length) {
    return false;
  }
  optimalSoln.match.sort();
  // create a deep clone so we keep the history of array insertion
  var currentSolnCopy = _.cloneDeep(currentSoln);
  currentSolnCopy.matches.sort();
  return _.isEqual(optimalSoln.match, currentSolnCopy.matches);
};

var checkIsSelected = function() {
  if (!selection) {
    return false;
  }
  return selection.length == 1 || false;
};

var getLeftRight = function(a, b) {
  var left, right;
  console.log(a, b)
  if (a[0] == "l") {
    left = a[1];
  } else {
    right = a[1];
  }
  if (b[0] == "l") {
    left = b[1];
  } else {
    right = b[1];
  }

  left = parseInt(left);
  right = parseInt(right);
  return {
    left: left,
    right: right
  };
};

var checkValidSolution = function(solution, sprite1, sprite2) {
  var a = sprite1.name,
    b = sprite2.name;
  var leftRight = getLeftRight(a, b);
  var left = leftRight.left,
    right = leftRight.right;
  for (var i = 0; i < solution.E.length; i++) {
    var curr = solution.E[i];

    // solution is valid
    if (curr[0] == left && curr[1] == right) {
      // push the valid solution into the pile
      currentSoln.matches.push([
        left, right
      ]);

      // add the score to total score
      currentSoln.score += curr[2];

      // draw the line
      drawSelectedLine(validLines, {
        x: sprite1.x,
        y: sprite1.y
      }, {
        x: sprite2.x,
        y: sprite2.y
      });

      return true;
    }
  }
  return false;
};

var spriteFactory = function(x, y, idx) {
  var sprite;
  if (idx === 0) {
    sprite = game.add.sprite(x, y, 'flappy1');
    sprite.animations.add('ani', [0, 1], 4, true);
  } else if (idx === 1) {
    sprite = game.add.sprite(x, y, 'flappy2');
    sprite.animations.add('ani', [0, 1, 2, 3, 4, 5, 6], 4, true);
  } else if (idx === 2) {
    sprite = game.add.sprite(x, y, 'flappy3');
    sprite.animations.add('ani', [0, 1, 2, 3], 4, true);
  }
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  sprite.play('ani');
  return sprite;
};

var createSprite = function(x, y, type, name) {
  // var sprite = game.add.sprite(x, y, type);
  // sprite.animations.add('ani', [0, 1, 2, 3, 4, 5, 67, 8, 9, 10], 5, true);
  var sprite = spriteFactory(x, y, Math.round(Math.random() * (2 - 0) + 0));
  sprite.name = name;
  // sprite.inputEnabled = true;
  // sprite.events.onInputDown.add(function() {
  //   setSelection(sprite);
  // }, this);
  return sprite;
};

var getSpriteByName = function(name) {
  for (var i = 0; i < all.length; i++) {
    var currSprite = all.children[i];
    if (currSprite.name === name) {
      return currSprite;
    }
  }
};

var drawSolution = function(solution) {
  createColumn(left, concatArr(range(solution.N), "l"));
  createColumn(right, concatArr(range(solution.M), "r"));
};

var createColumn = function(group, names) {
  var side = group.name;
  var midX = MAX_SPRITE_WIDTH / 2;
  var x = side === 'left' ? midX : game.width - midX;
  for (var i = 0; i < names.length; i++) {
    var y = (MAX_SPRITE_HEIGHT + MAX_SPRITE_MARGIN_Y) * i + MAX_SPRITE_HEIGHT / 2;
    var currSprite = createSprite(x, y, 'flappy1', names[i]);
    group.add(currSprite);
  }
};

var drawSelectedLine = function(lineGroup, to, from) {
  var line = drawLine(game.add.graphics(0, 0), to, from, {
    lineWidth: 4,
    color: 0xff0000,
    alpha: 1
  });
  lineGroup.add(line);
};

var drawLine = function(lineObj, to, from, lineStyle, alpha) {
  var lineStyle = lineStyle || {
    lineWidth: 2,
    color: 0x00ff00,
    alpha: 1
  };

  lineObj.makeSelected = function() {
    lineObj.clear();
    lineObj.lineStyle(lineStyle.lineWidth, 0xff0000, lineStyle.alpha);
    lineObj.moveTo(to.x, to.y);
    lineObj.lineTo(from.x, from.y);
  };

  lineObj.makeDeselected = function() {
    lineObj.clear();
    lineObj.lineStyle(lineStyle.lineWidth, lineStyle.color, lineStyle.alpha);
    lineObj.moveTo(to.x, to.y);
    lineObj.lineTo(from.x, from.y);
  };

  lineObj.makeDeselected();
  return lineObj;
};

var createTextField = function(x, y, text) {
  var textField = game.add.text(x, y, text, {
    font: '2.5em Lato',
    fill: '#ffffff',
    backgroundColor: '#333333'
  });
  textField.anchor.set(0.5);
  textField.inputEnabled = true;

  textField.events.onInputOver.add(function(target) {}, this);

  textField.events.onInputOut.add(function(target) {}, this);
  return textField;
};

var removeLeftIdxPossibilities = function(leftIdx, rightIdx) {
  var foundList = [];
  for (var i = 0; i < possibilities.children.length; i++) {
    var currLine = possibilities.children[i];
    if (currLine.name[0] === String(leftIdx)) {
      foundList.push(currLine);
    }
  }

  for (var i = 0; i < possibilities.children.length; i++) {
    var currLine = possibilities.children[i];
    if (currLine.name[1] === String(rightIdx)) {
      foundList.push(currLine);
    }
  }

  for (var i = 0; i < foundList.length; i++) {
    foundList[i].destroy();
  }

};

var checkForEndGame = function() {
  if (possibilities.children.length === 0) {
    game.state.start('result');
  }
}

var drawOptimalSolution = function(optimal, leftGrp, rightGrp) {
  _.forEach(optimal.match, function(match) {
    var leftNode = leftGrp.children[match[0]];
    var rightNode = rightGrp.children[match[1]];

    console.log(rightNode.x);

    var line = drawLine(game.add.graphics(0, 0), {
      x: leftNode.x,
      y: leftNode.y
    }, {
      x: rightNode.x,
      y: rightNode.y
    }, {
      lineWidth: 8,
      color: 0x00ff00,
      alpha: 1
    });
  });
};

var drawPossibilities = function(soln, leftGrp, rightGrp) {
  // closure
  var bindGoalFunctionality = function(line, leftIdx, rightIdx, weight) {
    var textBox;

    line.name = leftIdx + "" + rightIdx;

    line.events.onInputUp.add(function(target) {
      target.makeSelected();
      var leftNode = left.children[leftIdx];
      var rightNode = right.children[rightIdx];
      setSelection(leftNode);
      setSelection(rightNode);
      removeLeftIdxPossibilities(leftIdx, rightIdx);

      for (var i = 0; i < solution.E.length; i++) {
        var match = solution.E[i];
        if (match[0] == leftIdx && match[1] == rightIdx) {
          var weight = match[2];
          userSolution.push([leftIdx, rightIdx]);
          // score += weight;
          $('.disp-score').text(currentSoln.score);
          break;
        }
      }

      checkForEndGame();
    }, this);

    var mid = {
      x: (rightNode.x - leftNode.x) / 2,
      y: (leftNode.y + rightNode.y) / 2
    }

    line.events.onInputOver.add(function(target) {
      target.makeSelected();
      console.log(weight);
      textBox = createTextField(mid.x, mid.y, ' ' + weight + ' ');
    }, this);

    line.events.onInputOut.add(function(target) {
      target.makeDeselected();
      if (textBox) {
        textBox.destroy();
      }
    }, this);

  };

  for (var i = 0; i < soln.E.length; i++) {
    var leftIdx = soln.E[i][0] + 0;
    var rightIdx = soln.E[i][1] + 0;
    var weight = soln.E[i][2];
    var leftNode = leftGrp.children[leftIdx];
    var rightNode = rightGrp.children[rightIdx];
    //
    // var line = drawLine(game.add.graphics(0, 0), {
    //   x: leftNode.x,
    //   y: leftNode.y
    // }, {
    //   x: rightNode.x,
    //   y: rightNode.y
    // }, {
    //   lineWidth: 2,
    //   color: 0xcccccc,
    //   alpha: 0.7
    // });
    var lenA = Math.sqrt(Math.pow((rightNode.y - leftNode.y), 2) + Math.pow((rightNode.x - leftNode.x), 2));
    var line = drawLine(game.add.graphics(leftNode.x, leftNode.y), {
      x: 0,
      y: 0
    }, {
      x: lenA,
      y: 0
    }, {
      lineWidth: 2,
      color: 0xcccccc,
      alpha: 0.7
    });
    var xLen = rightNode.x;
    var yLen = rightNode.y - leftNode.y;
    line.angle = Math.atan(yLen / xLen) * 180 / Math.PI;
    var mid = {
      x: (rightNode.x - leftNode.x) / 2,
      y: (leftNode.y + rightNode.y) / 2
    }
    line.inputEnabled = true;
    var activeArea = {
        width: game.width * .8,
        height: 30
      }
      // line.hitArea = new PIXI.Rectangle(mid.x - activeArea.width / 2, mid.y - activeArea.height / 2, activeArea.width, activeArea.height);
    line.hitArea = new PIXI.Rectangle(0, -activeArea.height / 2, activeArea.width, activeArea.height / 2);
    bindGoalFunctionality(line, leftIdx, rightIdx, weight);

    possibilities.add(line);
  }
};


function init() {
  game.world.removeAll();
  game.input.mouse.capture = true;
  game.stage.backgroundColor = '#124184';

  all = game.add.group();
  possibilities = game.add.group();
  left = game.add.group();
  right = game.add.group();
  validLines = game.add.group();
  left.name = 'left';
  right.name = 'right';
  selcLine = game.add.graphics(0, 0);

  currentSoln = {
    score: 0,
    matches: []
  };
  score = 0;
  $('.disp-score').text(currentSoln.score);

  drawSolution(solution);
  solnIsOptimal = false;
  optimalScore = optimal.match_score;
  selection = [];

  drawPossibilities(solution, left, right);

  var maxHeight = (MAX_SPRITE_HEIGHT + MAX_SPRITE_MARGIN_Y) * Math.max(solution.N, solution.M);
  game.world.setBounds(0, 0, game.width, maxHeight);
}

//TODO fill in once prof. Halim has answers.

var playState = {
  preload: function() {
    game.load.spritesheet(
      'alien',
      './images/spritesheets/alienPink.png',
      80,
      96,
      11
    );

    game.load.spritesheet(
      'flappy1',
      './images/spritesheets/flappy1.png',
      101.5,
      80,
      4
    );

    game.load.spritesheet(
      'flappy2',
      './images/spritesheets/flappy2.png',
      80,
      63.6,
      8
    );

    game.load.spritesheet(
      'flappy3',
      './images/spritesheets/flappy3.png',
      80,
      70.5,
      4
    );
  },
  create: function() {
    solution = solutions.solution;
    optimal = solutions.optimal;
    userSolution = [];
    // optimal = game.cache.getJSON(optimal);
    $('.container-play-console').removeClass('hide');

    $('.btn-reset').click(function() {
      $('.container-play-console').addClass('hide');
      game.state.start('input');
    });

    $('.btn-submit-soln').click(function() {
      $('.container-play-console').addClass('hide');
      console.log(currentSoln);
      console.log('Game paused');
      game.kineticScrolling.stop();
      score = currentSoln.score;
      game.state.start('result');
    });

    $('.btn-solve').click(function() {
      drawOptimalSolution(optimal, left, right);
      setTimeout(function() {
        $('.container-play-console').addClass('hide');
        game.state.start('input');
      }, 5000);
    });

    game.kineticScrolling.start();
    init();
  },
  render: function() {},
  update: function() {
    if (checkIsSelected()) {
      drawLine(selcLine, {
        x: selection[0].x,
        y: selection[0].y
      }, {
        x: game.input.x,
        y: game.input.y
      });
    } else {
      selcLine.clear();
    }
  }
};
