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

LINK. Add a link here to your deployed game, you can also make the image above link to your game if you wish. Your game lives in the [/docs](/docs) folder, and is published using Github pages. 

VIDEO. Include a demo video of your game here (you don't have to wait until the end, you can insert a work in progress video)

## Your Group

<img src="weekly-homeworks/assets/week-01-photo.jpeg" width="500" alt="Group phote">

| MEMBER | NAME        | EMAIl                 | ROLE |
| ------ | ----------- | --------------------- | ---- |
| 1      | Xian Li     | yd25988@bristol.ac.uk |      |
| 2      |             |                       |      |
| 3      |             |                       |      |
| 4      | Yujing Shen | pf25516@bristol.ac.uk |      |
| 5      | Panarin Thipboonthong | uk25559@bristol.ac.uk |      |
| 6      | Koki Fushiya            | bz25385@bristol.ac.uk                      |      |



## Project Report

### Introduction

**Shuttle Smash** is a 2D physics-based sports game developed in p5.js. It combines the rules of badminton and tennis with Action-RPG combat elements. The project focuses on two key technical pillars: a custom physics simulation and a modular ability system.

**Core Mechanics:** The gameplay is driven by a rigorous physics engine that handles gravity, drag, and collision detection. We designed a "Dynamic Hitting System" where input timing determines the shot's outcome, moving away from random chance. Players must also manage stamina, adding a layer of resource management to the twitch-based gameplay.

**The Novelty:** What distinguishes this project is the integration of "Modular Supernatural Combat." Unlike standard sports games, our architecture supports dynamic environmental modifiers (e.g., wind vectors, friction changes) and active player skills like "Time-Slow." We achieved this through a modular class structure, ensuring that adding new environmental effects or special moves does not disrupt the core physics loop.

### Requirements 

- 15% ~750 words
- Early stages design. Ideation process. How did you decide as a team what to develop? Use case diagrams, user stories. 

### Design

- 15% ~750 words 
- System architecture. Class diagrams, behavioural diagrams. 

### Implementation

- 15% ~750 words

- Describe implementation of your game, in particular highlighting the TWO areas of *technical challenge* in developing your game. 

### Evaluation

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
