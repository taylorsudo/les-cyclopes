# Les Cyclopes

Les Cyclopes is a retelling of Odysseus’ encounter with the cyclops Polyphemus in Homer’s Odyssey. Using the format of a video game written in p5.js, the sketch relies on user interaction to progress through the story. 

The concept of the sketch reflects my interest in symphonic music and is based on the titular piece by Jean-Philippe Rameau (Rameau, 1724/2013), which is combined with Unpleasant Sonata (Serre, 2010) to separate the sketch into two contrasting “spaces”, defined by Howard (2016, p. 284) as “blocks or chunks of time with prescribed limits”. The MIDI version of Rameau’s Les Cyclopes was used to conform to the target aesthetic of classic 80s video games.

In music theory, time is expressed through sound “in the forms of measure, rhythm, duration, and repetition”, and in conjunction with space, generates “movement over the course of a piece of music” (Howard, 2016, p. 284). 

Time is the foundation of the sketch’s functionality, measured with a counter variable that serves to harmonise the speed of obstacles with the tempo of the soundtrack, so that the cyclical nature of the rondeau can be visualised and interacted with through the movement of elements.

The characteristics of Odysseus and Polyphemus as told in the Odyssey are reproduced through the imbalances between their corresponding characters in the game. Polyphemus, possessing nothing but brute strength, starts with a relatively high health value of 400, is able to launch multiple projectiles at once, and yet is statically positioned. In contrast, Odysseus starts with a meagre health value of 3, can only launch one projectile at a time, and yet can move to dodge attacks. 

Just as Odysseus relies on his wits to defeat Polyphemus in the Odyssey, strategy is required on the part of the user to complete the game by “shooting” Polyphemus and outmanoeuvring his attacks until his health value reaches 0. Additionally, the singular eye against the black background represents the darkness of the cave where the story takes place, a stylistic choice also inspired by cartoons of the 80s (TV Tropes, n.d.).

The sketch utilises object-oriented and conditional programming to generate and manipulate elements on the canvas. The obstacles and ammunition top-ups are generated as objects at indeterminate positions at the top of the canvas, creating a different emergent design each time the game is replayed (Monro, 2009). Furthermore, if statements are used in conjunction with the counter variable to handle keyboard event functions, trigger cutscenes, and set the rate and speed at which obstacles drop, determined by the time that has passed since the game has started.

The design is intended to be viewed in a desktop browser, as the sketch requires keyboard input for interaction. To make the design suitable for the web, relative values were used to determine the sizes and positions of all elements on the canvas, which scale when the window is resized. The number of obstacles that appear over time are determined by the width of the window, so that the difficulty of the gameplay is uniform across all window sizes. 

## References

Howard, M. (2016). Time and Space as Manipulated Materials in Rameau’s Les Cyclopes. Time: Sense, Space, Structure, 5(1), 284–298. https://doi.org/10.1163/9789004312319_014

Monro, G. (2009). Emergence and Generative Art. Leonardo (Oxford), 42(5). https://doi.org/10.1162/leon.2009.42.5.47

Rameau, J. P. (2013). Les cyclopes [Song recorded by GTManiac]. YouTube. (Original work published 1724)

Serre, G. (2010). Unpleasant Sonata [Song]. On Nostril. Nuclear Blast.

TV Tropes. (n.d.). By the Lights of Their Eyes. https://tvtropes.org/pmwiki/pmwiki.php/Main/ByTheLightsOfTheirEyes
