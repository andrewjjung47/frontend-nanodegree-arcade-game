// Add to global.window Utils object
window.Utils = window.Utils || {};

/**
 * Canvas class with reference to canvas element and its context
 * @param {string} id     canvas element id
 * @param {int} width  width of canvas
 * @param {int} height height of canvas
 */
window.Utils.Canvas = function(id, width, height) {
    var canvas = window.document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.setAttribute('id', id);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
};

/**
 * Randomly generate an integer between min and max integers, inclusive.
 * @param  {integer} min minimum integer
 * @param  {integer} max maximum integer
 * @return {integer}     randomly generated integer
 */
window.Utils.intGenerator = function(min, max) {
    /* Generates a random integer in between min and max, inclusive */
    return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Render an image of a general object. Only intended to be used for prototype.
 */
window.Utils.renderImg = function() {
  this.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
   * Check whether the character has collided with an object. The object must have
   * properties row, left and width. Second argument can be used when dummy object
   * should be used instead of the player.
   * @return {boolean} true if the player has collided with the object
   */
  window.Utils.checkCollision = function(obj) {
    if (obj === null) {
      return false;
    }
    // check if the object is in the same row as the character
    else if (obj.row === this.row) {
      // check if the object overlaps with the player
      if (obj.left + obj.width > this.left && obj.left < this.left + this.width) {
        return true;
      }
    }
    return false;
  };
