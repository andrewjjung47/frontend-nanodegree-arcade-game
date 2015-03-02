var intGenerator = function(min, max) {
    /* Generates a random integer in between min and max, inclusive */
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.width = 95; // 3px blank on each sides of the image
    this.speed = Math.random() * 350 + 50; // speed within range of [50, 400) px/s
    this.x = -101;
    this.row = intGenerator(0, 2); // random position
    this.y =  this.row * 83 + 60;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    this.left = this.x + 3;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.width = 65; // 18px blank on each sides of the image
    this.x = 202;
    this.y = 402;
    this.row = (this.y + 13) / 83;
};

Player.prototype.update = function() {
    this.left = this.x + 18;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Check if the new movement command would bring the player
outside the canvas, and if it doesn't move the player */
Player.prototype.move = function(direction, displacement) {
    var temp;
    if (direction === 'x') {
        temp = this.x + displacement;
        if (temp >= 0 && temp <= 404) this.x = temp;
    }
    else if (direction === 'y') {
        temp = this.y + displacement;
        if (temp >= -13 && temp <= 404) this.y = temp;
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

    this.render();
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
allEnemies[0] = new Enemy();
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
