// Add Entity object to global.window
window.Entity = window.Entity || {};

// Use immediate invocation to reduce global namespace litter
(function() {
  // Enemies our player must avoid
  var Enemy = function() {
      // The image/sprite for our enemies, this uses
      // a helper we've provided to easily load images
      this.sprite = 'images/enemy-bug.png';
      this.width = 95; // 3px blank on each sides of the image
      this.ctx = ctx; // this ctx is the mainCanvas ctx saved in global namespace
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

  Enemy.prototype.render = Utils.renderImg;

/**
 * Randomly sets an enemy's speed and position.
 */
  Enemy.prototype.reset = function() {
      this.speed = Math.round(Math.random() * 350) + 50; // speed within range of [50, 400) px/s
      this.x = Math.round(-Math.random() * level) * 100 -101; // prevent enemies to show up all at once
      this.row = Utils.intGenerator(1, 3); // random position
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
            levelKey.reset();
            GameObject.renderObjects();
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
    return Utils.checkCollision(this, obj);
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



  window.Entity.Enemy = Enemy;
  window.Entity.Player = Player;
}) ();