var level = 1;
function updateLevel() {
  level++;
  var numEnemies = 2 + Math.floor(level / 2);
  if (allEnemies.length < numEnemies) {
    allEnemies.push(new Entity.Enemy());
  }
  renderBackground();
}


/**
 * Render background on a separate canvas to avoid repeatedly redrawing it
 */
var backgroundCanvas = new Utils.Canvas('back-ground', 606, 606);
document.body.appendChild(backgroundCanvas.canvas);
function renderBackground() {
  var ctx = backgroundCanvas.ctx;

  ctx.clearRect(0, 0, 505, 606);

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
        }
    }

    ctx.fillStyle = 'black';
    ctx.font = '17px Courier New';
    ctx.fillText('Level:' + level, 1, 90);

    ctx.drawImage(Resources.get('images/Heart.png'), 5, 90, 40, 68);
    ctx.fillText(':' + (player ? player.life : 0), 52, 130);

    ctx.drawImage(Resources.get('images/Gem Orange.png'), 5, 135, 40, 68);
    ctx.fillText(':' + 10, 52, 181);

    var a = 5;
    ctx.drawImage(Resources.get('images/Star.png'), 5, 185, 40, 68);
    ctx.fillText(':' + a.toFixed(1), 52, 230);
}

// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

// Do not initialize player object before character selection
var player = null;

var rocks = [];
var levelKey = null;
var gemOrange = null;
var gemBlue = null;


