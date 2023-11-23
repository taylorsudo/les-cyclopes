// Timing variables
let counter = 0; // Initialise counter variable
let startMillis; // Initialise start time variable

// Game variables
let polyphemusHealth = 500; // Initial health value for Polyphemus
let odysseusHealth = 3; // Initial health value for Odysseus
let bulletNum = 100; // Initial number of bullets
let bulletDelay = 10; // Value to set the delay between bullets
let bulletTimer = 0; // Timer value for bullets

// Game objects and flags
let obstacles = []; // Array to store obstacles
let powerUps = []; // Array to store power-ups
let shooting = false; // Flag to indicate if player is shooting
let isGameOver = false; // Flag to indicate if the game is over
let gameStarted = false; // Flag to indicate if the game has started
let gameWon = false; // Flag to indicate if the game is won

// Visual and animation variables
let blink = 3;
// Initial y-coordinate for first and second control points of eyelid Bézier vertex
let fadeOut = 0; // Initial alpha value of fade out background colour
let canvasWidth, canvasHeight, music, wonTime, slideIn;
// Variables for canvas dimensions, music, win time, and slide-in effect
let eyeX, eyeY, eyeW, eyeH, eyeSpeechX, eyeSpeechY;
// Variables for eye position and Polyphemus' dialogue position
let irisX, irisY, irisSize, pupilSize, irisShakeTimer;
// Variables for iris position, size, pupil size, and iris shake timer

// Obstacle variables
let obstacleSpeed, obstacleNum; // Variables for obstacle speed and number of obstacles

// Typewriter effect adapted from "Simple typewriter effect" by Pippin Barr
// https://editor.p5js.org/pippinbarr/sketches/bjxEfpiwS
//  - Function: Displays text as if it were being written on a typewriter
//  - Implementation: Displaying dialogue in the opening and ending cutscenes
//  - Integration: currentCharacter[n] variable stores the number of characters
//    in the string to be displayed, to be incremented later on
//    when a certain frameCount is reached
//  - Modifications: Encoded the string so that the dialogue cannot be read in the source code
//    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent
//    https://onlinestringtools.com/url-encode-string
let string1 = decodeURIComponent("%57%68%6F%20%61%72%65%20%79%6F%75%3F");
let currentCharacter1 = 0;
let string2 = decodeURIComponent("%4E%6F%62%6F%64%79%2E%2E%2E");
let currentCharacter2 = 0;
let string3 = decodeURIComponent(
  "%57%68%6F%20%64%69%64%20%74%68%69%73%20%74%6F%20%79%6F%75%3F"
);
let currentCharacter3 = 0;
let string4 = decodeURIComponent("%4E%6F%62%6F%64%79%2E%2E%2E");
let currentCharacter4 = 0;
let string5 = decodeURIComponent("%54%48%45%20%45%4E%44");
let currentCharacter5 = 0;

// Preload function for loading music before the game starts
function preload() {
  // Soundtrack created by merging 2 tracks together in GarageBand
  //  1. Les Cyclopes - Jean-Phillippe Rameau - Synthesia (2013)
  //    - MIDI recorded by GTManiac
  //      https://www.youtube.com/watch?v=fxOnOGLkB-I
  //    - Composed by Jean-Philippe Rameau (1724)
  //  2. Unpleasant Sonata (2010)
  //    - Produced by Gautier Serre / Igorrr
  //      https://www.youtube.com/watch?v=xDc26K8NmnA
  music = loadSound("cyclops.mp3");
}

// Eye shape function adapted from EYES by Jackie Hu
// https://editor.p5js.org/jackiehu/sketches/Sy7JkKJk4
//  - Function: Draws an eye using Bézier vertices
//  - Implementation: Displaying a singular eye to represent a cyclops
//    obscured by the darkness of a cave
//  - Integration: Incorporated the code into a custom function
//    so that the eye shape can be used to draw Polyphemus
//    throughout the game, and his friend in the ending cutscene
//  - Modifications: Scaled down the Bézier vertices to their minimum values
//    and used the scale() function to work with custom parameters,
//    so that the shape can be resized with width and height values
//    similar to a native p5.js shape
function eye(x, y, w, h, lid) {
  push(); // Start a new drawing state
  translate(x, y); // Custom parameters for x and y coordinates of shape
  scale(w * 0.1, h * 0.1);
  // Custom parameters for width and height of shape, scaled down to be measurable in pixels
  strokeWeight(1 / w);
  // Stroke weight is scaled down by dividing with custom width parameter
  beginShape(); // Begin the shape
  vertex(-4, 0); // Specify vertex coordinates
  bezierVertex(-1.5, -2.5, 1.5, -2.5, 4, 0);
  bezierVertex(1.5, lid, -1.5, lid, -4, 0);
  // Bottom half of eye shape uses custom parameter for the eyelid
  endShape(CLOSE); // Close the shape
  pop(); // Restore original state
}

// Heart shape function adapted from a mathematical formula from Wolfram MathWorld
// https://mathworld.wolfram.com/HeartCurve.html
//  - Function: Draws a cardioid (heart-shaped curve) using the sin() and cos() functions
//  - Implementation: Displaying hearts to represent Odysseus' health values
//  - Integration: Used the formula in a for loop that repeats until theta (t) is reached,
//    plotted with x and y-coordinates and drawn with vertices
//  - Modifications: Modified the formula to work as a custom function
function heart(x, y, w) {
  push(); // Start a new drawing state
  noStroke(); // Remove stroke
  translate(x, y); // Custom parameters for x and y coordinates of shape
  scale(w); // Custom parameter for width of shape
  beginShape(); // Begin the shape
  for (let t = 0; t < 360; t++) {
    // Loop through theta until 360
    x = 160 * sin(t) ** 3 * 0.005;
    y = (130 * cos(t) - 50 * cos(2 * t) - 20 * cos(3 * t) - cos(4 * t)) * 0.005;
    vertex(x, -y); // Specify vertex coordinates
  }
  endShape(CLOSE); // Close the shape
  pop(); // Restore original state
}

// Setting up the initial variables of the game
function setup() {
  // Set the canvas size to match the window size with variables,
  // and create canvas using those variables
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  createCanvas(canvasWidth, canvasHeight);

  // The obstacleSpeed variable is calculated based on the canvas height.
  // The max() function ensures that the minimum speed is 5
  // and adjusts the speed based on the height of the canvas divided by 235.
  // The floor() function is used to round down the result to the nearest integer.
  obstacleSpeed = max(5, floor(canvasHeight / 235));

  // The obstacleNum variable is calculated based on the canvas width.
  // The max() function  ensures that the minimum number of obstacles is 2
  // and adjusts the number based on the width of the canvas divided by 1000.
  // The floor() function is used to round down the result to the nearest integer.
  obstacleNum = max(2, floor(canvasWidth / 1000));

  // Define eye shape variables
  eyeH = height / 2; // Height of the eye is half of the canvas height
  eyeW = eyeH; // Width of the eye is equal to the eye height
  eyeX = width / 2; // x position of the eye is at half of the canvas width
  eyeY = eyeH / 4; // y position of the eye is at a quarter of the eye height
  eyeSpeechX = eyeX + eyeW / 2;
  // x position of Polyphemus' dialogue is the eye's x position plus half of its width
  eyeSpeechY = eyeY - eyeH / 6;
  // y position of Polyphemus' dialogue is the eye's y position minus a sixth of its height
  irisSize = eyeW / 8; // Iris size is an eighth of the eye's width
  pupilSize = irisSize / 2; // Pupil size is half of the iris size
  irisColour = color(0, 0, 255); // Iris colour is blue

  // Define slideIn variable
  slideIn = 0 - eyeW / 2; // Initial position is 0 minus half of the eye's width

  odysseus = new Player(); // Create instance of the Player class (Odysseus)
}

// Draw function runs repeatedly throughout the game
function draw() {
  background(0); // Set the background color to black

  odysseus.show(); // Show instance of the Player class (Odysseus)
  
  // If shooting is true and game is not won, shoot bullets
  if (shooting && !gameWon) {
    if (bulletTimer <= 0) {
      odysseus.shoot();
      bulletTimer = bulletDelay; // Reset the timer
    } else {
      bulletTimer--; // Decrease the timer
    }
  }

  // If the counter is greater than or equal to 16000 milliseconds
  if (counter >= 16000) {
    
    // Adjust the obstacle speed based on the canvas height divided by 120
    // and ensure the minimum speed is 10
    obstacleSpeed = max(10, floor(canvasHeight / 120));

    // Adjust the obstacle number based on the canvas width divided by 700
    // Ensure the minimum number is 2
    obstacleNum = max(2, floor(canvasWidth / 700));
  }

  // If the counter is greater than or equal to 32500 milliseconds
  if (counter >= 32500) {
    
    // Adjust the obstacle speed based on the canvas height divided by 60
    // Ensure the minimum speed is 20
    obstacleSpeed = max(20, floor(canvasHeight / 60));

    // Adjust the obstacle number based on the canvas width divided by 600
    // Ensure the minimum number is 2
    obstacleNum = max(2, floor(canvasWidth / 600));
  }

  // If the counter is greater than or equal to 44000 milliseconds
  if (counter >= 44000) {
    // Adjust the obstacle speed based on the canvas height divided by 40
    // Ensure the minimum speed is 30
    obstacleSpeed = max(30, floor(canvasHeight / 40));

    // Adjust the obstacle number based on the canvas width divided by 500
    // Ensure the minimum number is 3
    obstacleNum = max(3, floor(canvasWidth / 500));
  }

  // If the counter is greater than or equal to 55750 milliseconds
  if (counter >= 55750) {
    // Adjust the obstacle number based on the canvas width divided by 300
    // Ensure the minimum number is 5
    obstacleNum = max(5, floor(canvasWidth / 300));
  }

  // If the counter is greater than or equal to 83000 milliseconds
  if (counter >= 83000) {
    // Adjust the obstacle speed based on the canvas height divided by 35
    // Ensure the minimum speed is 34
    obstacleSpeed = max(34, floor(canvasHeight / 35));
  }

  if (counter >= 115000) {
    // If the counter is greater than or equal to 115000 milliseconds
    // Adjust the obstacle speed based on the canvas height divided by 33
    // Ensure the minimum speed is 36
    obstacleSpeed = max(36, floor(canvasHeight / 33));

    // Adjust the obstacle number based on the canvas width divided by 400
    // Ensure the minimum number is 4
    obstacleNum = max(4, floor(canvasWidth / 400)); // first
  }

  // If the counter is greater than or equal to 133000 milliseconds
  if (counter >= 133000) {
    // Adjust the obstacle speed based on the canvas height divided by 80
    // Ensure the minimum speed is 15
    obstacleSpeed = max(15, floor(canvasHeight / 80));

    // Adjust the obstacle number based on the canvas width divided by 200
    // Ensure the minimum number is 10
    obstacleNum = max(10, floor(canvasWidth / 200));
  }

  // Create new obstacles based on the obstacleNum value
  for (let i = 0; i < obstacleNum; i++) {
    // Loop through the specified number of obstacles

    if (counter <= 115000) {
      // If the counter is less than or equal to 115000

      if (frameCount % 60 == 0 && gameStarted) {
        // If the frameCount is divisible by 60 and the game has started

        // Generate random values for the obstacle's X and Y positions
        let obstacleX = random(0, width);
        let obstacleY = random(-height / 3, -height / 20);

        obstacles.push(new Obstacle(obstacleX, obstacleY));
        // Create a new obstacle object and add it to the obstacles array
      }
    } else if (counter >= 115000) {
      // If the counter is greater than or equal to 115000

      if (frameCount % 30 == 0) {
        // If the frameCount is divisible by 30

        let obstacleX = random(0, width);
        let obstacleY = random(-height / 3, -height / 20);
        // Generate random values for the obstacle's X and Y positions

        obstacles.push(new Obstacle(obstacleX, obstacleY));
        // Create a new obstacle object and add it to the obstacles array
      }
    } else if (counter >= 133000) {
      // If the counter is greater than or equal to 133000

      if (frameCount % 48 == 0) {
        // If the frameCount is divisible by 48 (0.8 seconds)

        let obstacleX = random(0, width);
        let obstacleY = random(-height / 3, -height / 20);
        // Generate random values for the obstacle's X and Y positions

        obstacles.push(new Obstacle(obstacleX, obstacleY));
        // Create a new obstacle object and push it to the obstacles array
      }
    }
  }

  // Changing the properties of the eye
  if (counter >= 55000 || gameWon) {
    // If the counter is greater than or equal to 55000 or the game has been won

    irisSize = lerp(irisSize, eyeW / 7, 0.5);
    pupilSize = lerp(pupilSize, irisSize / 4, 0.5);
    // Linearly interpolate the irisSize and pupilSize properties

    irisColour = color(255, 0, 0); // Set the iris colour to red
  }

  // If the game has not been won
  if (!gameWon) {
    // Calculate the x-coordinate of the iris's position based on Odysseus's x-coordinate
    // mapped from the range of 0 to the canvas width, to a new range defined by
    // the minimum and maximum values of the iris's x-coordinate
    // This mapping contains the horizontal position of the iris
    // within the boundaries of the eye shape, and the
    // resulting mapped value is assigned to the variable irisX
    irisX = map(
      odysseus.x,
      0,
      width,
      eyeX - eyeW / 6 + irisSize / 2,
      // The minimum value ensures the iris remains within the left side of the eye
      eyeX + eyeW / 6 - irisSize / 2
      // The maximum value ensures the iris remains within the right side of the eye
    );

    // Calculate the y-coordinate of the iris's position based on Odysseus's y-coordinate
    // mapped from the range of 0 to the canvas height, to a new range defined by
    // the minimum and maximum values of the iris's y-coordinate
    // This mapping contains the vertical position of the iris
    // within the boundaries of the eye shape, and the
    // resulting mapped value is assigned to the variable irisY
    irisY = map(
      odysseus.y,
      0,
      height,
      eyeY - eyeH / 6 + irisSize / 2,
      // The minimum value ensures the iris remains within the top of the eye
      eyeY + eyeH / 6 - irisSize / 2
      // The maximum value ensures the iris remains within the bottom of the eye
    );
  }

  // Iris shake animation
  if (irisShakeTimer > 0) {
    // If the iris shake timer is greater than 0

    irisX += random(-irisShake, irisShake);
    // Add a random value within the range of iris shake to the iris's x-coordinate

    irisY += random(-irisShake, irisShake);
    // Add a random value within the range of iris shake to the iris's y-coordinate

    irisShakeTimer--; // Decrement the iris shake timer by 1
  }

  // Draw Polyphemus
  fill(255); // Fill eye shape with white
  eye(eyeX, eyeY, eyeW, eyeH, 2.5); // Draw custom eye shape with eye shape variables

  push(); // Start a new drawing state
  // Draw Polyphemus' iris
  fill(irisColour); // Fill iris with iris colour
  ellipse(irisX, irisY, irisSize); // Draw ellipse with iris variables

  // Draw Polyphemus' pupil
  fill(0); // Fill pupil with black
  ellipse(irisX, irisY, pupilSize); // Draw ellipse with iris and pupil variables
  pop(); // Restore original state

  // Continuation of typewriter effect adaptation
  // of "Simple typewriter effect" by Pippin Barr
  // for displaying opening dialogue between Odysseus and Polyphemus
  // https://editor.p5js.org/pippinbarr/sketches/bjxEfpiwS
  let currentString1 = string1.substring(0, currentCharacter1);
  // Return all the characters of string1 between 0 and currentCharacter1
  // with the substring() method

  let currentString2 = string2.substring(0, currentCharacter2);
  // Return all the characters of string2 between 0 and currentCharacter2
  // with the substring() method

  // Opening cutscene
  if (!gameStarted) {
    // Displays the following if the game hasn't started
    if (frameCount >= 60) {
      // Animates the eyelid after frameCount reaches 60
      blink = lerp(blink, -2.5, 0.05);
      // Linearly interpolate the blink value towards -2.5 to simulate eye opening
    }

    // Draw Polyphemus' eyelid
    fill(0); // Fill eye shape with black to simulate negative space
    eye(eyeX, eyeY, eyeW, eyeH, blink);
    // Draw eye shape with the blink value to animate Polyphemus' eyelid

    fill(255); // Fill text with white
    textFont("Courier"); // Set font to Courier

    // Display the partial string currentString1
    // at the specified position and size on the screen
    push(); // Start a new drawing state
    textSize(height / 40);
    textAlign(LEFT, TOP);
    text(
      currentString1,
      eyeSpeechX,
      eyeSpeechY,
      width - width / 3,
      height - height / 25
    );
    pop(); // Restore original state

    // If frameCount reaches 180, display Polyphemus' line
    // by randomly increasing the currentCharacter1 value
    // to gradually reveal more characters of string1
    if (frameCount >= 180) {
      currentCharacter1 += random(0, 0.25);
    }

    // Display the partial string currentString2
    // at the specified position and size on the screen
    push(); // Start a new drawing state
    textSize(height / 40);
    textAlign(LEFT, TOP);
    text(
      currentString2,
      eyeSpeechX,
      odysseus.y,
      width - width / 3,
      height - height / 25
    );
    pop(); // Restore original state

    // If frameCount reaches 360, display Odysseus' line
    // by randomly increasing the currentCharacter2 value
    // to gradually reveal more characters of string2
    if (frameCount >= 360) {
      currentCharacter2 += random(0, 0.15);
    }

    // If frameCount reaches 570, display title screen
    // at the center of the screen with the specified font size
    if (frameCount >= 570) {
      textAlign(CENTER);
      textSize(height / 20);
      text("Les Cyclopes", width / 2, height / 3);

      // Display instructions for movement and shooting controls
      textSize(height / 30);
      text(
        "Press left and right keys to move,\nhold spacebar to shoot",
        width / 2,
        height / 1.9
      );

      // Prompt the user to press any key to start the game
      text("Press any key to start", width / 2, height / 1.33);
    }

    return; // Exit the function since the game has not started yet
  }

  if (startMillis) {
    // Start counting the elapsed time in milliseconds if startMillis is activated
    counter = millis() - startMillis;
    // Subtract startMillis from millis() and assign to counter variable
  }

  // Draw Polyphemus' health bar
  let healthBar = map(polyphemusHealth, 0, 500, 0, width / 4);
  // Map Polyphemus' health value to the width of the health bar
  // and assign to healthBar variable

  // Set the fill colour based on Polyphemus' health value
  if (polyphemusHealth > 100) {
    fill(0, 255, 0); // Fill health bar with green if Polyphemus' health is above 100
  } else {
    fill(255, 0, 0); // Fill health bar with red if Polyphemus' health is below 100
  }

  // Draw the health bar with mapped size at the specified position
  rect(width / 25, height / 25, healthBar, height / 50);

  // Draw the hearts representing Odysseus' remaining lives
  for (let lives = 0; lives < odysseusHealth; lives++) {
    // Loop through the current value of Odysseus' health
    fill(255, 0, 0); // Fill hearts with red
    heart(width / 25 + (lives * width) / 25, height - height / 25, height / 50);
    // Draw a heart at the specified position for each remaining life of Odysseus
  }

  fill(255); // Fill text with white

  // Display information about Polyphemus' health, the number of obstacles, and ammo
  textAlign(LEFT);
  textSize(height / 60);
  text("Polyphemus: " + polyphemusHealth, width / 25, height / 10);
  text("Obstacles: " + obstacleNum, width / 25, height / 6.6);
  text("Ammo: " + bulletNum, width / 25, height / 5);

  odysseus.update(); // Update the Player class

  // Show and update obstacles
  for (let i = 0; i < obstacles.length; i++) {
    // Loop through the obstacles array
    obstacles[i].show();
    obstacles[i].update();

    if (odysseus.hits(obstacles[i])) {
      // Check for collision between Odysseus and the current obstacle
      if (odysseus.hitTimer === 0) {
        // Check if Odysseus' hit timer is already 0
        odysseus.hitTimer = odysseus.hitDuration; // Assign hit duration to hit timer
      }
      odysseusHealth--; // Decrement Odysseus' health by 1

      obstacles.splice(i, 1); // Remove the obstacle from the array
      break; // Exit the loop to avoid checking the remaining obstacles
    }
  }

  // If Odysseus' health reaches 0, end the game and stop the music
  if (odysseusHealth == 0) {
    isGameOver = true;
    music.stop();
    console.log("Game Over"); // Log "Game Over" to the console
  }

  // Show and update power ups
  for (let i = 0; i < powerUps.length; i++) {
    // Loop through the powerUps array
    powerUps[i].show();
    powerUps[i].update();

    // If the player hits a power up, add 50 bullets to bulletNum
    if (odysseus.hits(powerUps[i])) {
      bulletNum += 25;
      powerUps.splice(i, 1); // Remove the power up from the array
    }
  }

  // Create new power ups
  for (let i = 0; i < 1; i++) {
    // Every 300 frames, create new power up at a random coordinates at the top of the screen
    if (frameCount % 300 == 0) {
      let powerUpX = random(0, width);
      let powerUpY = random(-height / 3, -height / 20);
      powerUps.push(new PowerUp(powerUpX, powerUpY));
    }
  }

  // If the game is over, display a message and stop looping
  if (isGameOver) {
    textAlign(CENTER);
    textSize(height / 20);
    fill(255);
    text("GAME OVER", width / 2, height / 2);
    textSize(height / 40);
    text("Press R to restart", width / 2, height / 2 + 50);
    noLoop();
  }

  checkGameWon();

  // If game is won, stop the music and display end cutscene
  if (gameWon == true) {
    music.stop();
    obstacles = []; // Clear obstacles array
    powerUps = []; // Clear power ups array

    // Animate Polyphemus' eyelid by linearly interpolating blink and irisY values
    blink = lerp(blink, 0.5, 0.05);
    irisY = lerp(irisY, eyeY - pupilSize / 10, 0.05);

    // Draw Polyphemus' eyelid
    fill(0); // Fill eye shape with black
    eye(eyeX, eyeY, eyeW, eyeH, blink); // Draw eye shape with eye and blink variables

    // Draw the second eye
    fill(255); // Fill eye shape with white
    push(); // Start another new drawing state
    translate(slideIn, height - height / 8); // Animate with slideIn variable
    eye(0, 0, eyeW, eyeH, 2.5); // Draw eye shape with eye size variables

    // Draw the second eye's iris and animate with slideIn variable
    push(); // Start a new drawing state
    fill(0, 0, 255); // Fill iris shape with blue
    ellipse(eyeW / 6 - slideIn / 10, 0 - slideIn / 10, irisSize);

    // Draw the second eye's pupil and animate with slideIn variable
    fill(0); // Fill pupil shape with black
    ellipse(eyeW / 6 - slideIn / 10, 0 - slideIn / 10, pupilSize * 2);
    pop(); // Restore previous state

    pop(); // Restore original state

    // Gradually increment slideIn if counter is greater than 4000 milliseconds
    // and slideIn value is less than a fifth of the canvas width
    if (counter >= wonTime + 4000) {
      if (slideIn <= width / 5) {
        slideIn += width * 0.005;
      }
    }

    // Return all the characters of the remaining strings
    // between 0 and currentCharacter[n] with the substring() method
    let currentString3 = string3.substring(0, currentCharacter3);
    let currentString4 = string4.substring(0, currentCharacter4);
    let currentString5 = string5.substring(0, currentCharacter5);

    // Display the partial string currentString3
    // at the specified position and size on the screen
    push(); // Start a new drawing state
    textSize(height / 40);
    textAlign(LEFT, TOP);
    text(
      currentString3,
      width / 4,
      height - eyeH / 2,
      width - width / 3,
      height - height / 25
    );
    pop(); // Restore original state

    // If counter reaches 7500, display second eye's line
    // by randomly increasing the currentCharacter3 value
    // to gradually reveal more characters of string3
    if (counter >= wonTime + 7500) {
      currentCharacter3 += random(0, 0.25);
    }

    // Display the partial string currentString4
    // at the specified position and size on the screen
    push(); // Start a new drawing state
    textSize(height / 40);
    textAlign(LEFT, TOP);
    text(
      currentString4,
      eyeSpeechX,
      eyeSpeechY,
      width - width / 3,
      height - height / 25
    );
    pop(); // Restore original state

    // Draw black background over sketch with fadeOut variable as alpha value
    // so that cutscene fades to black after it ends
    background(0, fadeOut);

    // If counter reaches 12500, display Polyphemus' line
    // by randomly increasing the currentCharacter4 value
    // to gradually reveal more characters of string4
    if (counter >= wonTime + 12500) {
      // Increment currentCharacter4 at random rate
      currentCharacter4 += random(0, 0.1);
    }

    // Display the partial string currentString5
    // at the specified position and size on the screen
    push(); // Start a new drawing state
    textSize(height / 20);
    textAlign(CENTER);
    text(currentString5, width / 2, height / 2);
    pop(); // Restore original state

    // If counter reaches 17500, display final line
    // by randomly increasing the currentCharacter5 value
    // to gradually reveal more characters of string5
    if (counter >= wonTime + 17500) {
      currentCharacter5 += random(0, 0.1);
    }

    // If counter reaches 22500, increment fadeOut variable by one
    // to increase the alpha value until it reaches 255
    if (counter >= wonTime + 22500 && fadeOut <= 255) {
      fadeOut++;
    }
  }

  // Update and show bullets
  for (let i = odysseus.bullets.length - 1; i >= 0; i--) {
    // Loop through bullets array
    odysseus.bullets[i].show();
    odysseus.bullets[i].update();

    // Check for collision with Polyphemus by defining boundaries of his shape
    if (
      odysseus.bullets[i].x < eyeX + eyeW / 2 &&
      odysseus.bullets[i].x + odysseus.bullets[i].width > eyeX - eyeW / 2 &&
      odysseus.bullets[i].y + odysseus.bullets[i].height < eyeY + eyeH / 6 &&
      gameWon == false // Prevent Polyphemus from taking damage if game is already won
    ) {
      polyphemusHealth--; // Decrement Polyphemus' health by one when he is hit
      odysseus.bullets.splice(i, 1); // Remove bullet when it collides with Polyphemus
      // Shake Polyphemus' iris when he is hit
      irisShake = 10; // Set amount of shake
      irisShakeTimer = 10; // Set duration of shake
    }
  }
}

// Function to handle key presses
function keyPressed() {
  // If game hasn't started yet, start it, loop the music,
  // and begin recording time in milliseconds
  if (!gameStarted) {
    gameStarted = true;
    music.loop();
    startMillis = millis();
  }
  // If left arrow key is pressed and game is not yet won,
  // move the player to the left with setDir method
  else if (keyCode === LEFT_ARROW && !gameWon) {
    odysseus.setDir(-1);
  }
  // If right arrow key is pressed and game is not yet won,
  // move the player to the right with setDir method
  else if (keyCode === RIGHT_ARROW && !gameWon) {
    odysseus.setDir(1);
  }
  // If R key is pressed and game is over,
  // restart the game and reset all variables
  else if ((key === "r" && isGameOver) || (key === "R" && isGameOver)) {
    obstacleSpeed = floor(canvasHeight / 235);
    obstacleNum = max(2, floor(canvasWidth / 1000));
    bulletNum = 100;
    obstacles = [];
    powerUps = [];
    odysseus = new Player();
    polyphemusHealth = 500;
    odysseusHealth = 3;
    irisSize = eyeW / 8;
    pupilSize = irisSize / 2;
    irisColour = color(0, 0, 255);
    counter = 0;
    startMillis = millis();
    isGameOver = false;
    music.loop();
    loop();
  // If spacebar is pressed and game is not yet won, shoot a bullet
  } else if (keyCode === 32 && !gameWon) {
    shooting = true;
  }
}

// Function to handle key releases
function keyReleased() {
  // If left or right arrow key is released,
  // stop moving the player with setDir method
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    odysseus.setDir(0);
  }
  if (keyCode === 32) {
    shooting = false;
  }
}

// Function to check if game has been won
function checkGameWon() {
  if (polyphemusHealth <= 0 && !gameWon) {
    gameWon = true;
    wonTime = millis(); // Log the time when the game was won
  }
}

// Teardrop shape adapted from "rain+ water droplet" by zygugi
// https://editor.p5js.org/zygugi/sketches/H1-5-1p5W
//  - Function: Draws a droplet shape to the canvas
//  - Implementation: Drawing obstacles as teardrops / droplets of blood
//    when the second phase of the game begins
//  - Integration: Incorporated the code into a custom function
//    so that the shape can reused for each instance of an obstacle
//  - Modifications: Scaled down the Bézier vertices to their minimum values
//    and used the scale() function to work with custom parameters,
//    so that the shape can be resized with width and height values
//    similar to a native p5.js shape
function tearDrop(x, y, w, h) {
  push(); // Start a new drawing state
  translate(x, y + h); // Custom parameters for x and y coordinates of shape
  scale(w); // Custom parameters for width and height of shape
  noStroke(); // Remove the stroke
  fill(255, 0, 0); // Set the teardrop colour to red
  beginShape(); // Begin the shape
  vertex(0, -5); // Top vertex of the tear drop
  quadraticVertex(3, 0, 0, 1); // Quadratic Bézier curve control points
  quadraticVertex(-3, 0, 0, -5); // Quadratic Bézier curve control points
  endShape(CLOSE); // Close the shape
  pop(); // Restore original state
}

// Lightning bolt shape for first phase of the game
function lightningBolt(x, y, w, h) {
  push(); // Start a new drawing state
  noFill(); // Remove fill
  stroke(255, 255, 224); // Set the stroke colour to a pale yellow
  strokeWeight(4); // Set the stroke weight to 4
  beginShape(); // Begin the shape
  vertex(x, y - h); // Starting point of the lightning bolt
  for (let i = 0; i < 10; i++) {
    // Loop through 10 iterations of i
    let boltX = x + random(-w, w);
    // Randomise x-coordinate of lightning bolt segment
    let boltY = lerp(y - h, y + h, i / 10);
    // Linearly interpolate y-coordinate of lightning bolt segment
    vertex(boltX, boltY); // Add a vertex to the lightning bolt shape
  }
  vertex(x, y + h); // Ending point of the lightning bolt
  endShape(); // End the shape
  pop(); // Restore original state
}

// Call windowResized function when the window is resized
function windowResized() {
  // Update the canvas size variables to match the new size
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;

  // Resize the canvas to the new size
  resizeCanvas(canvasWidth, canvasHeight);

  // Redefine eye variables
  eyeH = height / 2;
  eyeW = eyeH;
  eyeX = width / 2;
  eyeY = eyeH / 4;
  eyeSpeechX = eyeX + eyeW / 2;
  eyeSpeechY = eyeY - eyeH / 6;
  irisSize = eyeW / 10;
  pupilSize = irisSize / 2;
  irisColour = color(0, 0, 255);

  // Redefine slideIn variable
  slideIn = 0 - width / 2;

  // Reset iris position
  irisX = map(
    odysseus.x,
    0,
    width,
    eyeX - eyeW / 10 + irisSize / 4,
    eyeX + eyeW / 10 - irisSize / 4
  );
  irisY = map(
    odysseus.y,
    0,
    height,
    eyeY - eyeH / 10 + irisSize / 4,
    eyeY + eyeH / 10 - irisSize / 4
  );

  // Reset Odysseus' properties
  odysseus.width = eyeW / 10;
  odysseus.height = odysseus.width * 2;
  odysseus.x = width / 2 - odysseus.width / 2;
  odysseus.y = height - odysseus.height;
  odysseus.bullets.width = odysseus.width / 3;
  odysseus.bullets.height = odysseus.width / 3;
  
  // Reset obstacles' properties
  obstacles.width = odysseus.width / 4;
  obstacles.height = odysseus.height / 3;

  // Reset power ups' properties
  powerUps.width = odysseus.width / 3;
  powerUps.height = odysseus.width / 3;
}
