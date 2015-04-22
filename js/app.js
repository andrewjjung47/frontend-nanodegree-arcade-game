var level = 10;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.width = 95; // 3px blank on each sides of the image
    this.reset();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x > 505) this.reset();
    this.x += Math.round(this.speed * dt); // avoid floating point coordinates for better performance.
    this.left = this.x + 3; // furthest left pixel of the enemy bug
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function() {
    this.speed = Math.round(Math.random() * 350) + 50; // speed within range of [50, 400) px/s
    this.x = Math.round(Math.random() * -level) * 100 -101; // prevent enemies to show up all at once
    this.row = window.Utils.intGenerator(1, 3); // random position
    this.y =  this.row * 83 - 23;
};

// Create separate canvas for players to make players animate more reponsively to the key stroke.
// Rendering on this canvas will be triggered by key press event.
var playerCanvas = new Utils.Canvas('player-canvas', 505, 606);
      document.body.appendChild(playerCanvas.canvas);

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(charImage) {
    this.sprite = charImage;
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
        if (temp.x >= 0 && temp.x <= 404 && !this.checkCollision(rocks, temp)) {
          this.x = temp.x;
          this.left = this.x + 18;
        }
    }
    else if (direction === 'y') {
        temp.y = this.y + displacement;
        temp.row = (temp.y + 13)/83;
        temp.left = this.left;
        if (temp.y >= -13 && temp.y <= 404 && !this.checkCollision(rocks, temp)) {
          this.y = temp.y;
          this.row = temp.row;
        }
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
        break;
      }
    }
};

Player.prototype.reset = function() {
    this.x = 202;
    this.y = 402;
    this.render();
};

var Rock = function() {
  this.sprite = 'images/Rock.png';
  this.width = 65; // 18px blank on each sides of the image
  this.x = 202;
  this.y = 319;
  this.row = (this.y + 13) / 83;
  this.left = this.x + 18; // furthest left pixel of the player
};

Rock.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
// Enemy number matches level
for (var i = 0; i < level; i++)
{
    allEnemies[i] = new Enemy();
}

// Do not initialize player object before character selection
var player = null;

var rocks = new Rock();


