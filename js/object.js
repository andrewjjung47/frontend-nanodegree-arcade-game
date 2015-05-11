// Add Entity object to global.window
window.GameObject = window.GameObject || {};

// Use immediate invocation to reduce global namespace litter
(function() {
  var intGenerator = Utils.intGenerator;
  var renderImg = Utils.renderImg;

  // Create separate canvas for players to make players animate more reponsively to the key stroke.
  // Rendering on this canvas will be triggered by key press event.
  var objectsCanvas = new Utils.Canvas('object-canvas', 505, 606);
  document.body.appendChild(objectsCanvas.canvas);
  var ctx = objectsCanvas.ctx;

  // Keep tack of objects to make sure they are not rendered on top of each other.
  var listObjects = [];
  var checkObjectCollision = function(obj1) {
    if (listObjects.length === 0) return false;
    var obj2, i;
    for (i = 0; i < listObjects.length; i++) {
      obj2 = listObjects[i];
      if (obj1 !== obj2 && Utils.checkCollision(obj1, obj2)) return true;
    }
    return false;
  };

  window.checkObjectCollision = checkObjectCollision;

  var Objects = function() {
    this.width = 100; // for objects, width does not really matter, but what column it is in does
    this.reset();
    listObjects.push(this);
    GameObject.renderObjects();
  };

  Objects.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  Objects.prototype.reset = function() {
    do {
      this.x = intGenerator(0, 4) * 101;
      this.left = this.x; // left margin does not really matter for objects
      this.row = intGenerator(0, 4);
      this.y = this.row * 83 - this.top; // this.top is the top margin
    } while (checkObjectCollision(this));
    GameObject.renderObjects();
  };

  var Rock = function() {
    this.base = Objects;
    this.sprite = 'images/Rock.png';
    this.top = 25;
    this.base();
  };

  Rock.prototype = Object.create(Objects.prototype);


  var Key = function() {
    this.base = Objects;
    this.sprite = 'images/Key.png';
    this.y = -20;
    this.row = 0; // always stays in the first row
    this.base();
  };

  Key.prototype = Object.create(Objects.prototype);

  Key.prototype.reset = function() {
    do {
      // Key has fixed row and y property
      this.x = 101 * intGenerator(0, 4);
      this.left = this.x;
    } while (checkObjectCollision(this));
    GameObject.renderObjects();
  };

  var GemOrange = function() {
    this.base = Objects;
    this.sprite = 'images/Gem Orange.png';
    this.top = 35;
    this.base();
  };

  GemOrange.prototype = Object.create(Objects.prototype);

  var GemBlue = function() {
    this.base = Objects;
    this.sprite = 'images/Gem Blue.png';
    this.top = 35;
    this.base();
  };

  GemBlue.prototype = Object.create(Objects.prototype);


  window.GameObject.Rock = Rock;
  window.GameObject.Key = Key;
  window.GameObject.GemOrange = GemOrange;
  window.GameObject.GemBlue = GemBlue;


  window.GameObject.renderObjects = function() {
    ctx.clearRect(0, 0, 505, 606);
    // TODO: use listObject
    /*if (rocks !== []) {
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
    }*/
    listObjects.forEach(function(gameObject) {
      gameObject.render();
    });
  };

  window.GameObject.destroyObject = function(objRef) {
    var index = listObjects.indexOf(objRef);
    listObjects.splice(index, 1);
    return null;
  };

}) ();
