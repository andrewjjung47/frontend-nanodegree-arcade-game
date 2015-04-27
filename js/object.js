// Add Entity object to global.window
window.GameObject = window.GameObject || {};

// Use immediate invocation to reduce global namespace litter
(function() {
  // Create separate canvas for players to make players animate more reponsively to the key stroke.
  // Rendering on this canvas will be triggered by key press event.
  var objectsCanvas = new Utils.Canvas('object-canvas', 505, 606);
  document.body.appendChild(objectsCanvas.canvas);
  var ctx = objectsCanvas.ctx;


  var Rock = function() {
    this.sprite = 'images/Rock.png';
    this.width = 86;
    this.ctx = ctx;
    this.reset();
  };

  Rock.prototype.render = Utils.renderImg;

  Rock.prototype.reset = function() {
    this.x = Utils.intGenerator(0, 4) * 101;
    this.left = this.x + 8; //8px of margin on left side
    this.row = Utils.intGenerator(0, 5);
    this.y = this.row * 83 - 25;
  };


  var Key = function() {
    this.sprite = 'images/Key.png';
    this.width = 100; // width does not really matter, but what column this is in matters in this case
    this.y = -20;
    this.row = 0; // always stays in the first row
    this.ctx = ctx;
    this.reset();
  };

  Key.prototype.render = Utils.renderImg;

  Key.prototype.reset = function() {
    this.x = 101 * Utils.intGenerator(0, 4);
    this.left = this.x + 8; // left does not really matter, but what column this is in matters in this case
  };

  var GemOrange = function() {
    this.sprite = 'images/Gem Orange.png';
    this.width = 100; // width does not really matter, but what column this is in matters in this case
    this.x = 101 * Utils.intGenerator(0, 4);
    this.y = -35 + 83;
    this.row = 0; // always stays in the first row
    this.left = this.x + 8; // left does not really matter, but what column this is in matters in this case
    this.ctx = ctx;
  };

  GemOrange.prototype.render = Utils.renderImg;

  var GemBlue = function() {
    this.sprite = 'images/Gem Blue.png';
    this.width = 100; // width does not really matter, but what column this is in matters in this case
    this.x = 101 * Utils.intGenerator(0, 4);
    this.y = -35 + 83;
    this.row = 0; // always stays in the first row
    this.left = this.x + 8; // left does not really matter, but what column this is in matters in this case
    this.ctx = ctx;
  };

  GemBlue.prototype.render = Utils.renderImg;


  window.GameObject.Rock = Rock;
  window.GameObject.Key = Key;
  window.GameObject.GemOrange = GemOrange;
  window.GameObject.GemBlue = GemBlue;


  window.GameObject.renderObjects = function() {
    ctx.clearRect(0, 0, 505, 606);
    if (rocks !== []) {
      for (var i = 0; i < rocks.length; i++) {
        rocks[i].render();
      }
    }
    if (levelKey !== null) {
      levelKey.render();
    }
    if (gemOrange !== null) {
      gemOrange.render();
    }
    if (gemBlue !== null) {
      gemBlue.render();
    }
  };


}) ();
