// Add Entity object to global.window
window.Entity = window.Entity || {};

// Use immediate invocation to reduce global namespace litter
(function() {
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
      this.x = Math.round(-Math.random() * level) * 100 -101; // prevent enemies to show up all at once
      this.row = window.Utils.intGenerator(1, 3); // random position
      this.y =  this.row * 83 - 23;
  };

  window.Entity.Enemy = Enemy;
}) ();
