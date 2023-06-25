// Define the Player class (Odysseus)
class Player {
  // Define constructor() to set initial properties of the Player class
  constructor() {
    this.width = eyeW / 10; // Width of the player (tenth of eye width)
    this.height = this.width * 2; // Height of the player (twice the player width)
    this.x = width / 2 - this.width / 2;
    // Initial x position of the player (centre of canvas, minus half the player width
    // as rectMode would alter the position of text elements)
    this.y = height - this.height;
    // Initial y position of the player (bottom of canvas minus the player height)
    this.speed = max(15, floor(canvasWidth / 150));
    // The speed of the player is calculated based on the canvas width,
    // the max() function ensures that the minimum speed is 15
    // and adjusts the speed based on the height of the canvas divided by 150, and
    // the floor() function is used to round down the result to the nearest integer.
    this.dir = 0; // Direction of the player's movement (0: stationary, -1: left, 1: right)
    this.bullets = []; // Array to store the player's bullets
    this.colour = "white"; // Set colour of the player to white
    this.hitColour = "red"; // Set colour of the player when hit to red
    this.hitDuration = 30; // Duration in frames for the hit effect
    this.hitTimer = 0; // Timer to keep track of the hit effect duration
  }

  // Define a shoot() method
  shoot() {
    if (bulletNum > 0 && bulletTimer <= 0) {
      // Run only if the player has bullets and the delay timer has reached 0
      let bullet = new Bullet(this.x + this.width / 2, this.y);
      // Create a new bullet at the player's position
      this.bullets.push(bullet); // Add the bullet to the player's bullet array
      bulletNum--; // Decrement the bullet count by one
      bulletTimer = bulletDelay; // Reset the timer
    }
  }

  // Define a show() method to draw the player
  show() {
    // Calculate the interpolated colour between the normal colour and hit colour
    let lerpedColour = lerpColor(
      color(this.colour),
      color(this.hitColour),
      this.hitTimer / this.hitDuration
    );

    fill(lerpedColour); // Set the fill colour to the interpolated colour

    rect(this.x, this.y, this.width, this.height); // Draw the player as a rectangle
  }

  // Define a setDir() method to set the direction of the player based on user input
  setDir(dir) {
    this.dir = dir; // Set the direction of the player to the provided direction
  }

  // Define a hits() method to detect collisions between the player and an obstacle
  hits(obstacle) {
    // Check if the player's right edge is to the left of the obstacle's left edge,
    // or if the player's left edge is to the right of the obstacle's right edge.
    // If either condition is true, there is no horizontal overlap.
    if (
      this.x < obstacle.x + obstacle.width &&
      this.x + this.width > obstacle.x
    ) {
      // Check if the player's bottom edge is above the obstacle's top edge,
      // or if the player's top edge is below the obstacle's bottom edge.
      // If either condition is true, there is no vertical overlap.
      if (
        this.y < obstacle.y + obstacle.height &&
        this.y + this.height > obstacle.y
      ) {
        return true; // Return true to indicate that a collision occurred
      }
    }
    return false; // Return false to indicate that there was no collision
  }

  // Define an update() method to update player's properties
  update() {
    this.x += this.dir * this.speed; // Update x-position based on direction and speed
    this.x = constrain(this.x, 0, width - this.width); // Keep player within bounds of canvas
    if (this.hitTimer > 0) {
      // If hit timer is greater than zero (due to collision)
      this.hitTimer--; // Decrement hit effect timer until it's back to zero
    }
  }
}

// Define the Bullet class
class Bullet {
  // Define constructor() to set initial properties of the Bullet class
  constructor(x, y) {
    this.x = x; // x-coordinate of the bullet's position
    this.y = y; // y-coordinate of the bullet's position
    this.width = odysseus.width / 3; // Width of the bullet (one third of player width)
    this.height = odysseus.width / 3; // Height of the bullet (one third of player width)
    this.speed = max(15, floor(canvasHeight / 80));
    // The speed of the bullet is calculated based on the canvas height,
    // the max() function ensures that the minimum speed is 15
    // and adjusts the speed based on the height of the canvas divided by 80, and
    // the floor() function is used to round down the result to the nearest integer.
  }

  // Define a show() method to draw the bullets
  show() {
    fill(255); // Set the colour of the bullets to white
    ellipse(this.x, this.y, this.width, this.height); // Draw the bullet as an ellipse
  }

  // Define an update() method to update bullet's properties
  update() {
    this.y -= this.speed; // Update y-coordinate of bullet with its speed to move it vertically
  }
}

// Define the Obstacle class
class Obstacle {
  // Define constructor() to set initial properties of the Obstacle class
  constructor(x, y) {
    this.x = x; // Initial x position of the obstacle
    this.y = y; // Initial y position of the obstacle
    this.width = odysseus.width / 4; // Width of the obstacle (one quarter of player width)
    this.height = odysseus.height / 3; // Height of the bullet (one third of player height)
  }

  // Define a show() method to draw the obstacle
  show() {
    // Draw obstacle at obstacle's x and y position with specified width and height
    if (counter >= 57500) {
      // If counter has reached 57500 milliseconds
      tearDrop(this.x, this.y, this.width, this.height); // Draw obstacle as teardrop
    } else {
      // Else draw obstacle as lightning bolt
      lightningBolt(this.x, this.y, this.width, this.height);
    }
  }

  // Define an update() method to update the obstacle's properties
  update() {
    this.y += obstacleSpeed; // Update the obstacle's y position by obstacleSpeed
  }
}

// Define the PowerUp class
class PowerUp {
  // Define constructor() to set initial properties of the PowerUp class
  constructor(x, y) {
    this.x = x; // Initial x position of the power up
    this.y = y; // Initial y position of the power up
    this.width = odysseus.width / 3; // Width of the bullet (one third of player width)
    this.height = odysseus.width / 3; // Height of the bullet (one third of player width)
  }

  // Define a show() method to draw the power up
  show() {
    fill(0, 255, 0);
    ellipse(this.x, this.y, this.width, this.height);
  }

  // Define an update() method to update the power up's properties
  update() {
    this.y += max(5, floor(canvasHeight / 235)); // Update power up's y position
    // The speed of the power up is calculated based on the canvas height,
    // the max() function ensures that the minimum speed is 5
    // and adjusts the speed based on the height of the canvas divided by 235, and
    // the floor() function is used to round down the result to the nearest integer.
  }
}