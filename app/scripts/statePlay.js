console.log('this is loaded too')

var MAX_SPRITE_WIDTH = 80;
var MAX_SPRITE_HEIGHT = 100;
var MAX_SPRITE_MARGIN_X = 10;
var MAX_SPRITE_MARGIN_Y = 0;

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
  return selection.length == 1;
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

var createSprite = function(x, y, type, name) {
  var sprite = game.add.sprite(x, y, type);
  sprite.animations.add('ani', [0, 1, 2, 3, 4, 5, 67, 8, 9, 10], 5, true);
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  sprite.play('ani');
  sprite.name = name;
  sprite.inputEnabled = true;
  sprite.events.onInputDown.add(function() {
    console.log(name);
    setSelection(sprite);
  }, this);
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
    var currSprite = createSprite(x, y, 'alien', names[i]);
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

var drawLine = function(lineObj, to, from, lineStyle) {
  var lineStyle = lineStyle || {
    lineWidth: 2,
    color: 0x00ff00,
    alpha: 1
  };
  lineObj.clear();
  lineObj.lineStyle(lineStyle.lineWidth, lineStyle.color, lineStyle.alpha);
  lineObj.moveTo(to.x, to.y);
  lineObj.lineTo(from.x, from.y);
  return lineObj;
};

var drawPossibilities = function(soln, leftGrp, rightGrp) {
  for (var i = 0; i < soln.E.length; i++) {
    var leftIdx = soln.E[i][0];
    var rightIdx = soln.E[i][1];
    var leftNode = leftGrp.children[leftIdx];
    var rightNode = rightGrp.children[rightIdx];

    var line = drawLine(game.add.graphics(0, 0), {
      x: leftNode.x,
      y: leftNode.y
    }, {
      x: rightNode.x,
      y: rightNode.y
    }, {
      lineWidth: 2,
      color: 0xcccccc,
      alpha: 1
    });
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

  drawSolution(solution);
  solnIsOptimal = false;
  optimalScore = optimal.match_score;
  selection = [

  ];

  drawPossibilities(solution, left, right);

var maxHeight = (MAX_SPRITE_HEIGHT + MAX_SPRITE_MARGIN_Y) * Math.max(solution.N, solution.M);
game.world.setBounds(0, 0, game.width, maxHeight);
console.log(maxHeight);
}

//TODO fill in once prof. Halim has answers.
var getSolutions = function(n,m) {
    $.getJSON(
      'http://localhost:8000/joel/',
      function(data) {
        solution = data;
        $.get('http://cs3226.comp.nus.edu.sg/matching.php?cmd=solve', {
          graph: solution
        }, function(data) {
          optimal = data;
        });
      });
};


var playState = {
  preload: function() {
    // game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    game.load.spritesheet(
      'alien',
      './images/spritesheets/alienPink.png',
      80,
      96,
      11
    );
    // getSolutions(n,m);
console.log(n,m);
  },
  create: function() {
    game.kineticScrolling.start();
    init();
  },
  render: function() {

  },
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
