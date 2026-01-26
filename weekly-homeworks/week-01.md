# Game Ideas

## 1. The Battle Cats (Tower Defense)
### Game Description
A 2D side-scrolling tower defense game where the player manages a base and summons various units (cats) to march across the screen and destroy the enemy's base. The game focuses on strategic unit composition and resource management.

### Mechanics
+ **Economic System:** Income increases over time; players spend currency to summon units or upgrade the base's wallet capacity.
+ **Unit Production:** Each unit type has a specific cost and cooldown timer.
+ **Automated Combat:** Once summoned, units move forward automatically and switch to an "attack" state when an enemy enters their range.
+ **Health & Damage:** Both bases and individual units have HP. The game ends when either base's HP reaches zero.

### Technical Challenges
+ **State Machine Architecture:** Managing the lifecycle of multiple units simultaneously (Idle, Walking, Attacking, Knockback, Dying). 
+ **Frontline & Stacking Logic:** Designing a system for units to detect the combat frontline and stack visually while maintaining accurate hit detection.

### Game Twist
Instead of fixed waves, enemy spawns will dynamically change based on the player's summons to counter their strategy. If the player summons many "Ranged" units, the AI will prioritize spawning "Fast Assassin" units to counter them.

## 2. Vampire Survivors (Roguelike)
### Game Description
A top-down "reverse bullet hell" survival game. The player controls a single character moving through an endless field, while thousands of monsters swarm in. Weapons fire automatically, and the goal is to survive for a set duration while collecting experience points to level up.

### Mechanics
+ **Passive Interaction:** Players focus purely on positioning and movement; the shooting logic is handled by the system.
+ **XP & Leveling:** Enemies drop gems upon death. Collecting gems allows the player to choose new weapons or passive buffs from a randomized pool.
+ **Horde Spawning:** The game difficulty scales by increasing the density and health of the monster "swarms" over time.

### Technical Challenges
+ **Performance Optimization:** p5.js can struggle with thousands of objects.
+ **Object Pooling:** Frequent creation and deletion of bullet and enemy objects will trigger JavaScript's Garbage Collector, causing stutters.

### Game Twist
The traditional infinite grass field is replaced with a dynamic level generator. For every stage, the game automatically generates walls, corridors, and obstacles.

## 3. Shuttle Smash (2D Sports Game)
### Game Description
A simple 2D badminton game where the player controls a character to move, jump, and hit a shuttlecock over a net. The goal is to score points by making the shuttlecock land on the opponent’s side.

### Mechanics
+ **Basic Movement:** The player can move left/right and jump.
+ **Automatic Physics:** The shuttlecock moves using gravity and air resistance to simulate badminton-like motion.
+ **Hit Detection:** When the shuttlecock is close to the player and the hit key is pressed, it is returned.

### Technical Challenges
+ **Shuttlecock Physics:** Implementing a simple drag effect so the shuttlecock slows down quickly in the air.
+ **Collision Detection:** Detecting hits between the racket area and the shuttlecock reliably.

### Game Twist
Each round has a small random wind effect that slightly changes the shuttlecock’s flight direction, encouraging players to adapt their timing and positioning.

## 4. Splatoon (Turf War)
### Game Description
A game of capturing territory, Players use ink weapons to cover the tiles in their own color, and the player who covers the most area within the time limit wins.

### Mechanics
+ Players are equipped with a Ink weapon to shoot the floor with their own color.
+ When players move, tiles automatically convert to the player's color.
+ Players move at fast speed when they are in their own color. If players move to the enemy's tiles, their HP will be continuously reduced. 

### Technical Challenges
+ **Create Enemies:** need to create enemies to chase the player and reclaim tiles.
+ **Tile Status:** Every tile has different status. (e.g., color, health and status effects.)
+ **Efficient Optimization:** p5.js may struggle with thousands of tiles.

### Game Twist
Unlike Splatoon, the floor will flip every 30 seconds. Players need to react fast to move to the safe tiles.

## 5. Air Hockey
### Game Description
A 2D sports game where two players use paddles to hit a puck into the opponent's goal. The game focuses on quick reactions, predicting the puck's movement, and controlling the speed of the game.

### Mechanics
+ **Scoring System:** The game is based on points. Each time the puck enters the opponent's goal, the player earns a point.
+ **Item Spawning:** Special items appear randomly on the table at set intervals. Players must hit these items with the puck or their paddle to activate them.

### Technical Challenges
+ **Trajectory Accuracy:** Vector has to be calculated correctly when multiplied pucks collide.
+ **Contact Detection:** Detection of contact between the puck and an item

### Game Twist
Various items appear during the match to change the gameplay. For example, some items can multiply the puck, while others cause the puck to accelerate, creating a chaotic and unpredictable challenge.

## 6. Horse Race
### Game Description
A 2D side-scrolling racing game where players control a "Centaur" in a high-speed obstacle course. The game focuses on reflex-based jumping and tactical stamina management to defeat rival racers.

### Mechanics
+ **Real-time Racing:** The Centaur runs automatically at a base speed. Players must manage a "Stamina Bar" to use speed boosts strategically while ensuring they have enough energy to finish the race.

### Technical Challenges
+ **Jump Physics & Trajectory:** Implementing a realistic parabolic jump. The code must handle gravity and vertical velocity to ensure the Centaur follows a smooth arc when clearing hurdles.
+ **Collision Detection:** Precisely detecting contact between the Centaur's hitbox and the hurdles. The challenge is to distinguish between a "successful jump" and a "crash" based on the character's y-axis position.

### Game Twist
Players control a "Centaur" (half-human, half-horse) in a high-stakes hurdle race. During the match, various obstacles appear that require perfect timing to jump over. The challenge lies in managing the Centaur's speed and momentum to clear these hurdles without crashing, creating a fast-paced and unpredictable racing experience.

## 7. Tennis 2d game
### Game Description
a 2d tennis game where a player face each others to compete in a tournament

### Mechanics
1. perspective of the game and coordinate system that would be using in the game
    + to move left right
    + to move forward backward
2. ball physics
    + ball movement across the court
    + gravity of the ball
    + bouncing and unbouncing
    + net collision when ball hit the net
3. player movement
    + player should be able to move in different types of positions
    + racket swings
        - when idle or standing: the racket can move freely
        - active swing the racket moves with the power of the person hitting the ball with the racket
        - when player run too much there should be a cooldown cause human can get tired so there should be a cooldown for a stamina gauge
4. when the ball hit the racket
    + timing like real life interaction	
        - early hit: hit to fast before the ball come and would missed(also might hit the ball but the ball would be uncontrollably and out)
        - late hit: hit to slow and the ball passed by(might hit the ball but uncontrollably)
        - perfect hit: hit at the perfect timing and the ball would be straight and fast
    + shot types (in this game we should provide shot type with each specific buttons)
        - Topspin: high forward shot, very fast (button W for example)
        - Slice : slice shot would be slower forward shot with low gravity or near the net (button D for example)
        - Lob: high shot which used when the opponent is near the net we used it so that it goes over the opponent head (button A for example)
        - Smash: As it says hard strong shot which make the opponent unpredictable and unable to receive but can only be used if the ball is high above the player’s head (button S for example)
5. Game logic (the same as real life)
    + serve state: only one side start with the serve
    + fault/out: when the ball bounce the floor twice or bounce of the court
    + scoretracking: 0,15,30,40, Deuce, Ad

## 8. 2D badminton
### Game Description
would be a game similar to tennis game but with different styles

### Mechanics
Mechanics and other things would be the same as tennis but change the ball to shuttlecock and it shouldn’t fall down to the ground or you will lose your points. Also, the point system would be totally different from 15, 30 to 1 point, 2 points, and etc. Other mechanics are the same so can use ideas similar to tennis gameplay.

## 9. Time-Glitch Repairer
### Game Description
A 2D puzzle-platformer where players act as a technician inside a failing computer system. The goal is to reach and repair the system Core by navigating through "glitched" terrain and by passing "looping" enemies. 

### Game Twist
**The Recorder:** Players possess a recording device that captures their actions (movement, jumping, carrying objects) for 5 seconds. It then generates a "Ghost Clone" that repeats these actions in real-time, allowing for solo-cooperation to solve complex puzzles, such as holding down distant switches. 

### Mechanics
+ **Gravity Flip:** Players can locally change the direction of gravity in specific areas.
+ **Block Interaction:** Carrying and placing "Logic Blocks" to fill gaps or create paths.
+ **Code Attack:** A long-range shot that temporarily "freezes" the script logic of enemies. 

### Technical Challenges
1. **Decoupling Input with the Command Pattern** 
    + **Description:** To implement the "Ghost Clone" reliably, the game must store and replay sequences of actions. We must ensure the clone's movements are identical to the player's recorded path regardless of frame rate fluctuations.
    + **Software Engineering Method:** We will apply the **Command Pattern**. Every action is treated as an object stored in a list. The player entity and ghost entity will both share the same command execution logic, making the recording system robust and easy to debug. 
2. **Managing Dynamic Physics in Locally Flipped Gravity** 
    + **Description:** Handling collision detection when different objects (player, blocks, enemies) are subject to different gravity vectors in the same scene is technically complex in p5.js.
    + **Software Engineering Method:** We will design a **Physics Manager** using Composition. Instead of global gravity, each entity will hold a Gravity Component. The manager will calculate collisions based on the entity's local orientation, ensuring "Logic Blocks" fall correctly even when the player is on a ceiling.