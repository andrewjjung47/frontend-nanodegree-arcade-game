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
   * Check whether an object has collided with another object. The object must have
   * properties row, left and width.
   * @return {boolean} true when collision has occured
   */
  window.Utils.checkCollision = function(obj1, obj2) {
    // check if the two objects are in the same row
    if (obj1.row === obj2.row) {
      // check if they overlaps
      if (obj1.left + obj1.width > obj2.left && obj1.left < obj2.left + obj2.width) {
        return true;
      }
    }
    return false;
  };
