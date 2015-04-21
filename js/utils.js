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
    canvas.width = 505;
    canvas.height = 606;
    canvas.setAttribute('id', id);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
};

window.Utils.intGenerator = function(min, max) {
    /* Generates a random integer in between min and max, inclusive */
    return Math.floor(Math.random() * (max - min + 1) + min);
};