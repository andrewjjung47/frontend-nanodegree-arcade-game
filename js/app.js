var level = 1;
function updateLevel() {
  level++;
  var numEnemies = 2 + Math.floor(level / 2);
  if (allEnemies.length < numEnemies) {
    allEnemies.push(new window.Entity.Enemy());
  }
  renderBackground();
}

// Create separate canvas for players to make players animate more reponsively to the key stroke.
// Rendering on this canvas will be triggered by key press event.
var playerCanvas = new Utils.Canvas('player-canvas', 505, 606);
      document.body.appendChild(playerCanvas.canvas);

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(charImage) {
    this.sprite = charImage;
    this.life = 4;
    this.width = 65; // 18px blank on each sides of the image
    this.x = 202;
    this.y = 402;
    this.row = (this.y + 13) / 83;
    this.left = this.x + 18; // furthest left pixel of the player

    var _this = this;

    document.addEventListener('keyup', function(e) {
      var allowedKeys = {
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down'
      };

      if (!pause) {
        _this.handleInput(allowedKeys[e.keyCode]);
        _this.render(); // makes moves more responsive.
        if (_this.checkCollision(levelKey)) {
          _this.reset();
          updateLevel();
          levelKey = new window.GameObject.Key();
          window.GameObject.renderObjects();
        }
      }
    });
};

Player.prototype.render = function() {
    playerCanvas.ctx.clearRect(0, 0, 505, 606);
    playerCanvas.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Check if the new movement command would bring the player
outside the canvas or collide with rocks, and if it doesn't move the player */
Player.prototype.move = function(direction, displacement) {
    var temp = {width: this.width};
    if (direction === 'x') {
        temp.x = this.x + displacement;
        temp.left = temp.x + 18;
        temp.row = this.row;
        temp.y = this.y;
    }
    else if (direction === 'y') {
        temp.y = this.y + displacement;
        temp.row = (temp.y + 13)/83;
        temp.left = this.left;
        temp.x = this.x;
    }
    if (temp.x >= 0 && temp.x <= 404 && temp.y >= -13 && temp.y <= 404) {
        for (var i = 0; i < rocks.length; i++) {
          if (this.checkCollision(rocks[i], temp)) {
            return;
          }
        }
        this.x = temp.x;
        this.y = temp.y;
        this.left = temp.left;
        this.row = temp.row;
    }
};

Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            this.move('x', -101);
            break;
        case 'up':
            this.move('y', -83);
            break;
        case 'right':
            this.move('x', 101);
            break;
        case 'down':
            this.move('y', 83);
            break;
    }
};

/**
 * Check whether the character has collided with an object. The object must have
 * properties row, left and width. Second argument can be used when dummy object
 * should be used instead of the player.
 * @return {boolean} true if the player has collided with the object
 */
Player.prototype.checkCollision = function(obj) {
  if (arguments.length === 2) _this = arguments[1];
  else _this = this;

  if (obj === null) {
    return false;
  }
  // check if the object is in the same row as the character
  else if (obj.row === _this.row) {
    // check if the object overlaps with the player
    if (obj.left + obj.width > _this.left && obj.left < _this.left + _this.width) {
      return true;
    }
  }
  return false;
};

/**
 * Check collision with any collidable object defined in the game.
 * Take appropriate action in case of a collision.
 */
Player.prototype.update = function() {
    this.row = (this.y + 13) / 83;
    this.left = this.x + 18; // furthest left pixel of the player

    for (var i = 0; i < allEnemies.length; i++) {
      if (this.checkCollision(allEnemies[i])) {
        this.reset();
        this.life--;
        renderBackground();
        break;
      }
    }
};

Player.prototype.reset = function() {
    this.x = 202;
    this.y = 402;
    this.render();
};

/*// Create separate canvas for players to make players animate more reponsively to the key stroke.
// Rendering on this canvas will be triggered by key press event.
var objectsCanvas = new Utils.Canvas('object-canvas', 505, 606);
      document.body.appendChild(objectsCanvas.canvas);

function renderObjects() {
  var ctx = objectsCanvas.ctx;
  ctx.clearRect(0, 0, 505, 606);
  if (rocks !== []) {
    for (var i = 0; i < rocks.length; i++) {
      ctx.drawImage(Resources.get(rocks[i].sprite), rocks[i].x, rocks[i].y);
    }
  }
  if (levelKey !== null) {
    ctx.drawImage(Resources.get(levelKey.sprite), levelKey.x, levelKey.y);
  }
}

var Rock = function() {
  this.sprite = 'images/Rock.png';
  this.width = 86;
  this.x = 202;
  this.y = 307;
  this.row = Math.round((this.y + 25) / 83);
  this.left = this.x + 8; //8px of margin on left side
};

var Key = function() {
  this.sprite = 'images/Key.png';
  this.width = 100; // width does not really matter, but what column this is in matters in this case
  this.x = 101 * window.Utils.intGenerator(0, 4);
  this.y = -20;
  this.row = 0;
  this.left = this.x + 8; // left does not really matter, but what column this is in matters in this case
};*/

/**
 * Render background on a separate canvas to avoid repeatedly redrawing it
 */
var backgroundCanvas = new Utils.Canvas('back-ground', 606, 606);
document.body.appendChild(backgroundCanvas.canvas);
function renderBackground() {
  var ctx = backgroundCanvas.ctx;

  ctx.clearRect(0, 0, 505, 606);

  /* This array holds the relative URL to the image used
   * for that particular row of the game level.
   */
  var rowImages = [
            'images/water-block.png',   // Top row is water
            'images/stone-block.png',   // Row 1 of 3 of stone
            'images/stone-block.png',   // Row 2 of 3 of stone
            'images/stone-block.png',   // Row 3 of 3 of stone
            'images/grass-block.png',   // Row 1 of 2 of grass
            'images/grass-block.png'    // Row 2 of 2 of grass
        ],
        numRows = 6,
        numCols = 5,
        row, col;

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (row = 0; row < numRows; row++) {
        for (col = 0; col < numCols; col++) {
            /* The drawImage function of the canvas' context element
             * requires 3 parameters: the image to draw, the x coordinate
             * to start drawing and the y coordinate to start drawing.
             * We're using our Resources helpers to refer to our images
             * so that we get the benefits of caching these images, since
             * we're using them over and over.
             */
            ctx.drawImage(Resources.get(rowImages[row]),
                                           col * 101 + 101, row * 83);
        }
    }

    ctx.fillStyle = 'black';
    ctx.font = '17px Courier New';
    ctx.fillText('Level:' + level, 1, 90);

    ctx.drawImage(Resources.get('images/Heart.png'), 5, 90, 40, 68);
    ctx.fillText(':' + (player ? player.life : 0), 52, 130);

    ctx.drawImage(Resources.get('images/Gem Orange.png'), 5, 135, 40, 68);
    ctx.fillText(':' + 10, 52, 181);

    var a = 5;
    ctx.drawImage(Resources.get('images/Star.png'), 5, 185, 40, 68);
    ctx.fillText(':' + a.toFixed(1), 52, 230);
}

// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

// Do not initialize player object before character selection
var player = null;

var rocks = [];
var levelKey = null;


