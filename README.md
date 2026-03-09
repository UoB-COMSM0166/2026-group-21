# 2026-group-21
2026 COMSM0166 group 21

# COMSM0166 Project Template
A project template for the Software Engineering Discipline and Practice module (COMSM0166).

## Info

This is the template for your group project repo/report. We'll be setting up your repo and assigning you to it after the group forming activity. You can delete this info section, but please keep the rest of the repo structure intact.

You will be developing your game using [P5.js](https://p5js.org) a javascript library that provides you will all the tools you need to make your game. However, we won't be teaching you javascript, this is a chance for you and your team to learn a (friendly) new language and framework quickly, something you will almost certainly have to do with your summer project and in future. There is a lot of documentation online, you can start with:

- [P5.js tutorials](https://p5js.org/tutorials/) 
- [Coding Train P5.js](https://thecodingtrain.com/tracks/code-programming-with-p5-js) course - go here for enthusiastic video tutorials from Dan Shiffman (recommended!)

## Your Game (change to title of your game)

STRAPLINE. Add an exciting one sentence description of your game here.

IMAGE. Add an image of your game here, keep this updated with a snapshot of your latest development.

[CLICK HERE TO PLAY GAME ](https://uob-comsm0166.github.io/2026-group-21/)

VIDEO. Include a demo video of your game here (you don't have to wait until the end, you can insert a work in progress video)

## Your Group

  <p align="center">
    <img src="weekly-homeworks/assets/week-01-photo.jpeg" width="500" alt="Group phote">
  </p>


| NAME                  | EMAIl                 | ROLE |
| --------------------- | --------------------- | ---- |
| Xian Li               | yd25988@bristol.ac.uk |      |
| Yu-Han Sun            | qv25088@bristol.ac.uk |      |
| Yu-Chun Chen          | df25142@bristol.ac.uk |      |
| Yujing Shen           | pf25516@bristol.ac.uk |      |
| Panarin Thipboonthong | uk25559@bristol.ac.uk |      |
| Koki Fushiya          | bz25385@bristol.ac.uk |      |



## Project Report

### Introduction
---
**(Working Title TBD)** is a top-down 2.5D 1v1 tennis game inspired by genre classics like *Super Tennis* and *Mario Tennis*. As a team of tennis enthusiasts, we wanted to capture the sport's intensity into a fast-paced digital experience.

We have streamlined the traditional rules to keep the action fluid: players use simple movement controls alongside dedicated Serve and Skill buttons to outmaneuver their opponent. You score points by forcing a miss or driving the ball out of your opponent's reach, with the first player to hit the target game count declared the winner.

At the core of the game is a custom ball physics system built to balance realistic collisions with arcade-style gameplay. This engine powers both local multiplayer and single-player modes against a custom AI. To ensure no two matches feel the same, we've introduced two key twists:

1. **Skill System:** Each character comes with unique abilities. Players can trigger supernatural effects such as instant teleportation, or manipulate the ball itself - forcing it to enlarge, shrink, or accelerate unpredictably mid-flight.  
   
    <p align="center">
      <b>Figure 1:</b>
      <i>Demonstration of skill system</i>
      <br>
    ([GIF placeholder])
    </p>

1. **Dynamic Environments:** Each map features its own hazards, from the freezing mechanics in Antarctica to visibility-reducing sandstorms in the Desert stage. These elements force players to adapt their positioning and strategy on the fly.
   
   
    <p align="center">
      <b>Figure 2:</b>
      <i>Demonstration of dynamic environments</i>
      <br>
      ([GIF placeholder])
    </p>
    

### Requirements 
---
#### Ideation Process
During our initial brainstorming session, our team generated a wide range of creative concepts. However, due to our limited familiarity with p5.js, there were concerns regarding the technical feasibility of these ideas. To address this, we conducted independent research before the subsequent meeting. Each member proposed one or two game concepts in a shared [Google Doc](https://docs.google.com/document/d/1nrocSGf6uqzb97ttsJxpVtYdhJrd-7BKs9r7RD0a1_Y/edit?usp=sharing), ensuring that each proposal included two challenges and a "twist" for gameplay depth.

Interestingly, three members proposed similar ball-sports games. After an in-person discussion and a voting process, the Tennis Game and a Vampire Survivors-style game emerged as the top two candidates.
#### Early Stages Design
We conducted market research through Google and the Steam store to analyze existing games within similar genres, using them as references for visual aesthetics and gameplay mechanics. This research informed our development during the Week 3 workshop and a subsequent offline session, where we developed paper prototypes for both candidate games.

During the workshop, we engaged with other teams for feedback and discovered that the tennis game received a significantly more positive response. Furthermore, our team members shared a collective passion for sports games, and we found our creative ideas for the tennis project to be more comprehensive during the prototyping phase. Based on these three factors, namely user feedback, team interest, and conceptual depth, we officially selected the tennis game as our project.

The paper prototyping process also prompted deeper discussions regarding game mechanics and user flow, such as the requirement for character and map selection. Moreover, it helped us identify potential conflicts, such as differing opinions on the degree of adherence to real-world tennis rules. To resolve these ambiguities, we subsequently employed User Stories and Use Case modeling to formally define and establish our system requirements.
    <p align="center">
      <b>Figure 3:</b>
      <i>Tennis Game Paper Prototype </i><br>
      <a href="https://www.youtube.com/watch?v=qdplPSo7CMk" target="_blank">Watch it on YT</a><br>
      <video src="https://github.com/UoB-COMSM0166/2026-group-21/blob/main/weekly-homeworks/assets/week-03-tennisgame-prototype1.mp4?raw=true" controls width="640" height="360"></video>
    </p>
    <p align="center">
      <b>Figure 4:</b>
      <i>Vampire Survival Paper Prototype </i><br>
      <a href="https://www.youtube.com/watch?v=HRUYlSV_QAU" target="_blank">Watch it on YT</a><br>
      <video src="https://github.com/UoB-COMSM0166/2026-group-21/blob/main/weekly-homeworks/assets/week-03-vampiresurvival-prototype.mp4?raw=true" controls width="640" height="360"></video>
    </p>

#### Stakeholders
During the current development lifecycle, the Development Team acts as the primary operator, while Gamers represent the intended beneficiaries whose needs guide our requirements. Moreover, Markers/Assessors act as functional operators during the evaluation phase, interacting with the system to verify that all software requirements are met. Specifically, Markers fulfill a Surrogate Role, representing the high-standard expectations of a polished product. Consequently, we have categorized both Gamers and Markers within the Containing System, as their roles are essential to the operational success and validation of the project.

<p align="center">
      <b>Figure 5:</b>
      <i>Onion Model for Stakeholders </i><br>
      <img src="weekly-homeworks/assets/week-04-onionmodel.png" controls width="640" height="640">
      </img>
    </p>

#### User Stories
We initially generated a wide range of [User Story ideas](https://docs.google.com/document/d/1LYooThDOOa3G9zB3lg5oMovLOXHKsaj8kRKYu5YS_vA/edit?usp=sharing) to define our game's features. To manage our project scope effectively, we employed the MoSCoW method to prioritise these requirements and conducted Planning Poker sessions to estimate the development effort for each task. This structured approach enabled us to make critical trade-offs within our limited timeframe. 

By focusing on high-value requirements, we finalised the following set of User Stories for implementation:
<p align="center">
      <b>Table 6:</b>
      <i>User Stories </i>
    </p>

| Epics | User Stories | Acceptance Criteria (AC) |
| :--- | :---- | :--- |
| Core Gameplay System | As a competitive player, I want the game to support dual-input mode on a single computer so that I can engage in real-time 1v1 matches with my friends. | Given two players are on the same computer, when they press their respective movement keys simultaneously, then both characters must move independently without input interference. |
|  |As a casual player, I want to play against an AI opponent so that I can practice and enjoy the game even when a teammate is unavailable. | Given the player is at the main menu, when they select the "Single Player vs. AI" option, then the game should initialize a match with a computer-controlled opponent.|
|  | As a casual player, I want to trigger unique skills via specific keys so that the match becomes more dynamic and engaging. | Given a skill has just been used, when the player attempts to trigger it again immediately, then the system should prevent the action until the cooldown period has ended. |
|  | As a sports enthusiast, I want the ball to exhibit realistic collision, so that the trajectory feels authentic. |Given the ball strikes a surface, when it bounces, then its velocity and reflection angle must reflect realistic energy loss.|
| Score System | As a competitive player, I want the screen to display real-time scores and the current set so that I can track match progress and determine the winner. | Given a match is in progress, when a player scores a point, then the UI must immediately update the corresponding score display area.|
|  | As a sports enthusiast, I want the game to follow traditional tennis scoring logic so that I can experience the authentic rhythm of a tennis match. | Given a player has 30 points, when they win the next rally, then their score must advance to 40 instead of 31.|
| User Onboarding System | As a beginner player, I want to see control icons on the start screen so that I can quickly understand how to move, swing, and use skills. | Given the player is on the start screen, when they view the instructions, then they should see clear icons mapping keys to movement, serving, and skills for both players.|
| | As a beginner player, I want an interactive tutorial level to guide me through movement, hitting, and skill usage so that I can become familiar with the controls before a real match. |Given the player is in the tutorial mode, when they successfully return three balls, then the system must display a "Tutorial Complete" prompt and allow them to exit.|

#### Use-Case Diagram
Following the analysis of our User Stories, we developed a Use Case Diagram to translate these requirements into specific system behaviors. This process allowed us to define the functional boundaries of the game more precisely. For instance, we established an << include >> relationship between the "Hit Ball" and "Calculate Ball Physics" use cases. This structural decision clarified a critical technical dependency before implementation: physics calculations are not an optional feature but an indispensable component of the core gameplay loop. 

<p align="center">
      <b>Figure 7:</b>
      <i>User Diagram </i>
      <br>
      <img src="weekly-homeworks/assets/week-04-userdiagram.png" controls width="640" height="640">
      </img>
    </p>

#### Refletion
We recognized early on that Use Case Diagrams and User Stories are not static documents but evolving tools that helped define our core architecture and unified our team vision. However, as we transitioned into the implementation phase, our deepening technical understanding of the game system led us to constantly update these requirements to ensure they served as a robust baseline for testing.

This internal evolution took a significant turn during the workshop. The real eye-opener came when we were observing other teams' demos; we quickly realized how frustrating it was to have no idea how the mechanics worked or what the buttons did just by watching. This firsthand frustration made us look back at our own design with fresh eyes, realizing we had fallen into the 'Expert Bias' trap: because we built the game, the controls felt intuitive to us, but they would likely be a mystery to a new player. This realization convinced us to prioritize the User Onboarding System, showing us that no matter how fun the core gameplay is, it is wasted if the player gets 'stuck at the front door'.

Ultimately, prioritizing these essential user needs led to the hardest decision of the project: scrapping the online multiplayer mode. While we were excited about the idea, Planning Poker gave us a cold, hard look at the numbers, revealing that forcing a complex network feature into our limited timeframe would likely result in a buggy mess. By choosing to "let go" of that ambition, we were able to protect the quality of our Must-haves, such as the local 1v1 experience and the physics engine, a strategic trade-off that allowed us to focus on what truly mattered for the final product.
### Design
---
#### System Architecture
Our game is architected using a Scene-Based Finite State Machine (FSM) pattern implemented within the p5.js framework.

*   **Game Loop & State Management:** The entry point, `sketch.js`, maintains a global `currentState` variable. The main `draw()` loop manages the control flow by delegating rendering and logic updates to specific Scene objects (e.g., `Scene_Menu`, `Scene_Game`) based on the current state. This design ensures that logic for the menu, character selection, and gameplay remains decoupled。
*   **Entity Coordination:** Game entities like `Player` and `Ball` encapsulate their own rendering and logic. The `Scene_Game` coordinates these entities and bridges them with global managers such as the `ScoreManager`, ensuring smooth interaction during gameplay。
*   **Manager Pattern:** We utilize specialized manager classes (`ScoreManager`, `LayoutManager`) to handle global responsibilities such as game rules, scoring, and responsive screen layout calculations, keeping the core entity classes focused on their specific behaviors.

#### Class Diagrams
Our system design underwent several iterations to balance functional requirements with code maintainability. Initially, as shown in Figure 8, our class diagram focused on establishing a clear inheritance hierarchy for game entities. We defined an abstract `Player` class to encapsulate shared movement and swinging logic, while delegating character-specific abilities to the `Cat` and `Dog` subclasses.

<p align="center">
  <b>Figure 8:</b>
  <i>Early Class Diagram</i><br>
  <img src="weekly-homeworks/assets/week-05-earlyclassdiagram.png"></img>
</p>

However, as we began adding more features and the game mechanics grew in complexity, we transitioned to a more modular architecture to avoid code duplication and improve maintainability. The final system, as illustrated in figure 9, shifts toward Composition and Separation of Concerns:

*   **`Player` & `Ball`:** These core classes encapsulate their own physical states and interactions. We made a strategic decision to consolidate the original `Cat` and `Dog` character subclasses back into the `Player` class, using internal state variables like `characterType` to differentiate them. This data-driven approach prevents "Class Explosion" and allows for adding new characters via configuration rather than new source files.
*   **`AI` (Controller):** Instead of subclassing `Player`, the `AI` class uses Composition. It holds a reference to a `Player` instance (has-a relationship) and manipulates its inputs. This allows the same `Player` class to be controlled by either a human or an algorithm without code duplication.
*   **`SkillManager`:** Implemented as a static utility, this class encapsulates the logic for different special abilities. The `Player` class delegates skill execution to this manager, allowing for easy expansion of new skills (e.g., `SHADOW_TELEPORT`, `GIGA_BALL`) without modifying the player class.
*   **`Scene_Game`:** Acts as the composite root for the gameplay session, aggregating `Player`, `Ball`, and `ScoreManager`.

By employing Composition for core entities and Dependency for behavioral interactions, the system ensures that physics logic, scoring rules, and scene transitions remain independent and easily maintainable.

<p align="center">
  <b>Figure 9:</b>
  <i>Final Class Diagram</i><br>
  <img src="weekly-homeworks/assets/week-05-finalclassdiagram.png"></img>
</p>

#### Behavioural Diagrams
To illustrate the game's logic flow, we analyzed the "Ball Hit Detection" scenario, which is critical for the gameplay feel.
- **Input & Physics Update:** `Scene_Game` processes player inputs via `swing()` and independently advances the ball's physics using `update()`.
- **State Validation:** Triggered by `checkHit()`, the system first verifies the player's swingTimer and the 3D hit window (Z-axis). If the player is idle, the check safely aborts to optimize performance.
- **Spatial Check:** Once validated, the ball retrieves the player's 2D coordinates and size to confirm bounding box intersection (`hitX` and `hitY`).
- **Physics Resolution:** Upon a confirmed collision, the ball calculates new velocity vectors (`vx`, `vy`, `vz`), updates the match state via `recordHit()`, and resets the player's `swingTimer` to complete the interaction.

<p align="center">
  <b>Figure 10:</b>
  <i>Sequence Diagram: Ball Hit Logic</i>
  <br>
  <img src="weekly-homeworks/assets/week-05-behaviourdiagram.png"controls height="640"></img>
</p>

Employing object-oriented design and UML diagrams was essential for organizing our ideas and establishing a shared understanding of the game's architecture. However, manually updating detailed UML is time-consuming. To keep our documentation agile, our workflow evolved from hand-drawn sketches to Draw.io, and ultimately to Mermaid. Adopting this text-based tool significantly accelerated the process, allowing our diagrams to evolve as "living tools" alongside the codebase. These finalized models now serve as vital documentation for future system maintenance.

### Implementation

- 15% ~750 words

- Describe implementation of your game, in particular highlighting the TWO areas of *technical challenge* in developing your game. 

### Evaluation

Think Aloud Session Workshop (feedback)

  As we let the other group members take a look at our game project, we realized there are still plenty of things we need to work on. Whether we missed them, skipped some parts, or are still progressing on them, here are some ideas based on the feedback they gave us and what our team is currently thinking about the game.

    - Our gameplay buttons feel uncomfortable to use because they are too close together, which we will work on fixing.
    - Our characters were too slow when moving from one direction to another, which sometimes meant they couldn't chase the ball as well as we expected. As a result, we need to make the characters accelerate faster and move more accurately so players can catch the ball more easily.
    - The score or scoreboard is currently hard to see. We need to improve it by making it clearer and more visible throughout the game.
    - The text on our game UI isn't clear and makes it difficult for others to read, which we will also improve.
    - We haven't done the rules and regulations yet, so we need to add them so players can understand the gameplay. We might need documentation to clearly explain how the game works for someone who has never played it before.
    - We also need to add key prompts so that first-time players know which buttons they should press.
    - The easy mode was too easy. We should make it a bit more competitive. For example, right now the difficulty is around 1-2, but we should change it to 3-4 so that it feels more engaging, even for first-timers.
    - When choosing maps, some people also said it is hard to see our fonts or text, so we might need to change that as well.
    - The UI needs to be clearer to understand. For example, we need something like a score pop-up to clearly show who won the point or the game.
    - Additionally, we might make the audience cheer every time a person scores, or give each tennis court its own unique visual effects.


- 15% ~750 words
- One qualitative evaluation (of your choice) 
- One quantitative evaluation (of your choice) 
- Description of how code was tested. 

### Heuristic Evaluation

**Process**

Our team conducted an expert heuristic evaluation of the game prototype, assessing the interface against the 10 Nielsen design heuristics. We also incorporated informal playtesting feedback to identify key usability issues. We assigned them a severity rating based on a 0–4 scale for Impact, Frequency, and Persistence. The overall severity was calculated as an average of these three factors, helping us prioritize which issues to fix before release. 

**Table: Heuristic violations identified in our game, their severity ratings, and solutions**

| Heuristic Violated                                          | Issue Description                                            | Impact (0–4) | Frequency (0–4) | Persistence (0–4) | Overall Severity | Solution                                                     |
| :---------------------------------------------------------- | :----------------------------------------------------------- | :----------- | :-------------- | :---------------- | :--------------- | :----------------------------------------------------------- |
| **Visibility of system status**                             | When a player scores a point or hits a great shot, the game lacks immediate feedback, making the match feel unresponsive. | 3            | 4               | 3                 | 3.33             | Add audience reaction sound effects (e.g., applause, cheering) and visual text pop-ups to celebrate points won. |
| **Match between system and the real world**                 | The out-of-bounds lines on the tennis court are not clearly or consistently marked, making it hard to judge if a ball is "in" or "out". | 3            | 4               | 4                 | 3.67             | Redraw the court boundaries with sharp, high-contrast white lines that mimic a real-world tennis court. |
| **User control and freedom**                                | Players can move to intercept the ball but cannot control the shot's direction, angle, or power, making them feel like passive participants. | 4            | 4               | 4                 | 4.00             | Introduce directional aiming (using movement keys during the swing) and a charge-up mechanic to let players dictate shot power and angle. |
| **Consistency and standards**                               | The "Play Again" button on the Game Over screen uses a different style, color, or interaction logic compared to the main menu buttons. | 2            | 1               | 2                 | 1.67             | Standardize UI elements by applying consistent styling and hover effects across all interactive buttons in the canvas. |
| **Error prevention**                                        | Because players lack control over hit power, normal returns frequently and inevitably go out of bounds, forcing errors. | 4            | 4               | 3                 | 3.67             | Implement a slight aim-assist or cap the maximum power for standard shots to keep them in bounds, reserving high-risk out-of-bounds shots for special skills. |
| **Recognition rather than recall**                          | The "Skills" category UI is too small. Players have to squint to recognize which skills are available or on cooldown. | 3            | 4               | 4                 | 3.67             | Enlarge the skills UI panel, use clear icons, and add noticeable visual cooldown indicators. |
| **Flexibility and efficiency of use**                       | Local multiplayer demands too much from a single keyboard. Using the Numpad or playing close together creates physical crowding and potential hardware key-ghosting. | 4            | 4               | 4                 | 4.00             | Optimize the default key bindings (e.g., Player 1 on far-left WASD, Player 2 on far-right Arrows) and allow custom keymapping to maximize physical space between players. |
| **Aesthetic and minimalist design**                         | While players praised the cute interface design, the bright and colorful court sometimes camouflages the yellow tennis ball. | 3            | 4               | 3                 | 3.33             | Maintain the cute aesthetic but add a subtle drop shadow or glowing outline to the tennis ball to improve visual contrast. |
| **Help users recognize, diagnose, and recover from errors** | When a ball is missed (hit out or into the net), the game doesn't explicitly state why the point was lost. | 2            | 3               | 3                 | 2.67             | Add clear visual text like "OUT!" or "NET!" exactly where the error occurred so the player understands their mistake. |
| **Help and documentation**                                  | New players are unsure of the key bindings for different shot types or how to activate skills before starting the match. | 3            | 2               | 4                 | 3.00             | Add an accessible "How to Play / Controls" screen in the main menu before the match begins. |



### Process 

- 15% ~750 words

- Teamwork. How did you work together, what tools and methods did you use? Did you define team roles? Reflection on how you worked together. Be honest, we want to hear about what didn't work as well as what did work, and importantly how your team adapted throughout the project.

### Conclusion

- 10% ~500 words

- Reflect on the project as a whole. Lessons learnt. Reflect on challenges. Future work, describe both immediate next steps for your current game and also what you would potentially do if you had chance to develop a sequel.

### Contribution Statement

- Provide a table of everyone's contribution, which *may* be used to weight individual grades. We expect that the contribution will be split evenly across team-members in most cases. Please let us know as soon as possible if there are any issues with teamwork as soon as they are apparent and we will do our best to help your team work harmoniously together.

### Additional Marks

You can delete this section in your own repo, it's just here for information. in addition to the marks above, we will be marking you on the following two points:

- **Quality** of report writing, presentation, use of figures and visual material (5% of report grade) 
  - Please write in a clear concise manner suitable for an interested layperson. Write as if this repo was publicly available.
- **Documentation** of code (5% of report grade)
  - Organise your code so that it could easily be picked up by another team in the future and developed further.
  - Is your repo clearly organised? Is code well commented throughout?
