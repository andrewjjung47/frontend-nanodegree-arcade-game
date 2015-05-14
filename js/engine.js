/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

// TODO: change the reference for character and enemies position coordinate and
// bottom left of the image.

/**
 * Boolean to pause the game or not.
 * @type {Boolean}
 */
var pause = true;

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        Utils = global.Utils,
        lastTime;

    var mainCanvas = new Utils.Canvas('main', 505, 606);
    doc.body.appendChild(mainCanvas.canvas);

    // Game option canvas on top of the main canvas
    var gameOptionCanvas = new Utils.Canvas('game-option', 505, 606);
    doc.body.appendChild(gameOptionCanvas.canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        if (!pause) {
         /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
          update(dt);

          // Randomly generate objects.
          if (!heart && Math.random() < 0.001) {
            heart = new GameObject.Heart();
          }

          if (!star && Math.random() < 0.001) {
            star = new GameObject.Star();
          }

          if (!gemOrange && Math.random() < 0.003) {
            gemOrange = new GameObject.GemOrange();
          }

          if (rocks.length < 5 && Math.random() < 0.003) {
            rocks.push(new GameObject.Rock());
          }

          render();
        }

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
      reset();
      lastTime = Date.now();
      renderBackground();
      main();
      charSelect();
      GameObject.renderObjects();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        player.update();
        if (player.life === 0) {
          pause = true;
          gameOver();
        }
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        ctx.clearRect(0, 0, 505, 606);

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
    }

    /**
     * Execute character selection by setting up selection canvas and add logic
     */
    function charSelect() {


      // Character index
      var character = 0;

      var charImages = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
      ];

      document.addEventListener('keyup', keyHandler);
      renderChar();

      // Handler for keyup event for character seleciton.
      function keyHandler(e) {
          var allowedKeys = {
              37: 'left',
              38: 'up',
              39: 'right',
              40: 'down',
              13: 'enter'
          };

          var input = allowedKeys[e.keyCode];

          if (input === 'left' && character > 0) {
            character--;
          }
          else if (input === 'right' && character < charImages.length - 1) {
            character++;
          }
          else if (input === 'up') {
            level++;
          }
          else if (input === 'down' && level > 1) {
            level--;
          }
          else if (input === 'enter') {
            document.removeEventListener('keyup', keyHandler);
            gameOptionCanvas.ctx.clearRect(0, 0, 505, 606);
            player = new Entity.Player(charImages[character]);

            pause = false;
            document.addEventListener('keyup', pauseHandler);

            player.render();
            renderBackground();
            return;
          }

          renderChar();
          renderBackground();
      }

      /**
      * Render character selection canvas.
      */
      function renderChar() {
        var ctx = gameOptionCanvas.ctx;

        // clear previous drawings on the selection canvas
        ctx.clearRect(0, 0, 505, 606);

        // white opaque background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(0, 0, 505, 606);

        var selector = 'images/Selector.png';
        ctx.drawImage(Resources.get(selector), character * 101, 101);

        for (var i = 0; i < charImages.length; i++) {
          ctx.drawImage(Resources.get(charImages[i]), i * 101, 101);
        }

        ctx.fillStyle = '#1E7FE0';
        ctx.font = '70px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('Characters', 250, 120);

        ctx.textAlign = 'left';
        ctx.fillStyle = 'black';
        ctx.font = '17px Courier New';
        // Starting vertical position of the character selection instruction section
        var paragvert = 300;
        ctx.fillText('Use left and right keys to move the selection', 15, paragvert);
        ctx.fillText('cursor and up and down keys to change level.', 15, paragvert + 20);
        ctx.fillText('Press enter key to start a game.', 15, paragvert + 40);

        // Starting vertical position of the how to play section
        paragvert = 380;
        ctx.fillText('How to play:', 15, paragvert);
        ctx.fillText('  - Use up, down, left, and right keys to move', 15, paragvert + 20);
        ctx.fillText("    your character. Press 'enter' to pause.", 15, paragvert + 40);
        ctx.fillText('  - Collision with a bug or touching the water', 15, paragvert + 60);
        ctx.fillText('    will cost you one heart.', 15, paragvert + 80);
        ctx.fillText('  - Move to the next level by obtaining a key.', 15, paragvert + 100);
        ctx.fillText('  - Blue gem will create a ground on the water,', 15, paragvert + 120);
        ctx.fillText('    and orange gem will help you break a stone.', 15, paragvert + 140);
        ctx.fillText('  - Star will make you invincible for 5 seconds.', 15, paragvert + 160);
      }
    }

    function gameOver() {
      var ctx = gameOptionCanvas.ctx;
      ctx.clearRect(0, 0, 505, 606);

      // white opaque background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(0, 0, 505, 606);

      ctx.fillStyle = 'red';
      ctx.font = '70px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('Game over', 250, 240);

      ctx.textAlign = 'left';
      ctx.fillStyle = 'black';
      ctx.font = '20px Courier New';
      ctx.fillText('Click enter to restart', 15, 350);

      document.removeEventListener('keyup', pauseHandler);
      document.addEventListener('keyup', resetHandler);
    }

    function pauseHandler(e) {
      if (e.keyCode === 13) {
        var ctx = gameOptionCanvas.ctx;
        pause = !pause;
        if (pause) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(0, 0, 505, 606);
        }
        else {
          ctx.clearRect(0, 0, 505, 606);
        }
      }
    }

    function resetHandler(e) {
      if (e.keyCode === 13) {
        document.removeEventListener('keyup', resetHandler);
        init();
      }
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
      allEnemies = [];
      player = null;
      rocks = [];
      levelKey = null;
      gemOrange = null;
      gemBlue = null;
      heart = null;
      star = null;
      GameObject.destroyAllObject();
      level = 0;
      updateLevel();
      collectedOrangeGem = 0;
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Selector.png',
        'images/Key.png',
        'images/Gem Blue.png',
        'images/Rock.png',
        'images/Heart.png',
        'images/Gem Orange.png',
        'images/Star.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = mainCanvas.ctx;
    global.gameOver = gameOver;
})(this);


