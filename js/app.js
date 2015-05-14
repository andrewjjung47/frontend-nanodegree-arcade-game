var level = 1;
function updateLevel() {
  level++;
  var numEnemies = 2 + Math.floor(level / 2);
  if (allEnemies.length < numEnemies) {
    allEnemies.push(new Entity.Enemy());
  }

  if (gemOrange !== null) {
    GameObject.destroyObject(gemOrange);
  }
  gemOrange = new GameObject.GemOrange();
  if (gemBlue !== null) {
    GameObject.destroyObject(gemBlue);
  }
  gemBlue = new GameObject.GemBlue();
  listBlocks = [0, 1, 2, 3, 4];

  renderBackground();
}

var collectedOrangeGem = 0;

var starTimer = null;
var starCounter = function() {
  var timeElapsed = starTimer && starTimer();
  if (timeElapsed <= 0) {
    starTimer = null;
    if (player) player.render();
    return 0;
  }
  else {
    return timeElapsed;
  }
};

/**
 * Check collision with any collidable object defined in the game.
 * Take appropriate action in case of a collision.
 */
Entity.Player.prototype.update = function() {
    for (var i = 0; i < allEnemies.length; i++) {
      if (this.checkCollision(allEnemies[i])) {
        if (starTimer) {
          allEnemies[i].reset();
        }
        else {
          this.reset();
          this.life--;
          renderBackground();
          break;
        }
      }
    }
    if (starTimer) {
      renderBackground();
    }
};

/* Check if the new movement command would bring the player
outside the canvas or collide with rocks, and if it doesn't move the player */
Entity.Player.prototype.move = function(direction, displacement) {
    var temp = {width: this.width};
    if (direction === 'x') {
      temp.col = this.col + displacement;
      temp.row = this.row;
      this.resetPosition(temp);
    }
    else if (direction === 'y') {
      temp.row = this.row + displacement;
      temp.col = this.col;
      this.resetPosition(temp);
    }
    if (temp.x >= 0 && temp.x <= 404 && temp.y >= -13 && temp.y <= 404) {
        for (var i = 0; i < rocks.length; i++) {
          if (Utils.checkCollision(rocks[i], temp)) {
            if (collectedOrangeGem) {
              GameObject.destroyObject(rocks[i]);
              rocks.splice(i, 1);
              break;
            }
            else return;
          }
        }
        this.x = temp.x;
        this.y = temp.y;
        this.left = temp.left;
        this.row = temp.row;
        this.col = temp.col;
    }
};

Entity.Player.prototype.handleInput = function(key, _this) {
  var allowedKeys = {
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down'
        };

  if (!pause) {
    key = allowedKeys[key.keyCode];
    switch (key) {
      case 'left':
          this.move('x', -1);
          break;
      case 'up':
          this.move('y', -1);
          break;
      case 'right':
          this.move('x', 1);
          break;
      case 'down':
          this.move('y', 1);
          break;
    }

    if (this.row === 0 && listBlocks.indexOf(this.col) !== -1) {
      this.life--;
      renderBackground();
      this.reset();
    }

    if (heart !== null) {
      if (this.checkCollision(heart)) {
        heart = GameObject.destroyObject(heart);
        this.life++;
        renderBackground();
      }
    }

    if (star !== null) {
      if (this.checkCollision(star)) {
        star = GameObject.destroyObject(star);
        starTimer = Utils.timeCountStart();
      }
    }

    if (gemOrange !== null) {
      if (this.checkCollision(gemOrange)) {
        gemOrange = GameObject.destroyObject(gemOrange);
        collectedOrangeGem++;
        renderBackground();
      }
    }

    if (gemBlue !== null) {
      if (this.checkCollision(gemBlue)) {
        gemBlue = GameObject.destroyObject(gemBlue);

        if(listBlocks !== []) {
          var randIndex = Utils.intGenerator(0, listBlocks.length - 1);
          listBlocks.splice(randIndex, 1);
          renderBackground();
          if(listBlocks.length > 0) {
            gemBlue = new GameObject.GemBlue();
          }
        }
      }
    }

    if (this.checkCollision(levelKey)) {
      this.reset();
      updateLevel();
      levelKey = GameObject.destroyObject(levelKey);
      levelKey = new GameObject.Key();
    }

    this.render();
  }
};

/**
 * Render background on a separate canvas to avoid repeatedly redrawing it
 */
var backgroundCanvas = new Utils.Canvas('back-ground', 606, 606);
document.body.appendChild(backgroundCanvas.canvas);
function renderBackground() {
  var ctx = backgroundCanvas.ctx;

  ctx.clearRect(0, 0, 606, 606);

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

          if(row === 0) {
            if(listBlocks.indexOf(col) === -1) {
              ctx.drawImage(Resources.get('images/stone-block.png'),
                col * 101 + 101, 0);
            }
          }
        }
    }

    ctx.fillStyle = 'black';
    ctx.font = '17px Courier New';
    ctx.fillText('Level:' + level, 1, 90);

    ctx.drawImage(Resources.get('images/Heart.png'), 5, 90, 40, 68);
    ctx.fillText(':' + (player ? player.life : 0), 52, 130);

    ctx.drawImage(Resources.get('images/Gem Orange.png'), 5, 135, 40, 68);
    ctx.fillText(':' + collectedOrangeGem, 52, 181);

    var a = starCounter();
    ctx.drawImage(Resources.get('images/Star.png'), 5, 185, 40, 68);
    ctx.fillText(':' + a.toFixed(1), 52, 230);
}

// Column numbers of stone-blocks where the player can walk on
var listBlocks,

// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
    allEnemies,
    player,
    rocks,
    levelKey,
    gemOrange,
    gemBlue,
    heart,
    star;


