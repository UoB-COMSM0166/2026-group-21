<p align="center">
  <img src="weekly-homeworks/assets/report-banner.png" width="800" alt="Game Banner">
  <br>
  <a href="https://uob-comsm0166.github.io/2026-group-21/" target="_blank">CLICK HERE TO PLAY FUR-HAND SMASH</a><br>
</p>

# Video Demonstration

# Table of Contents
- [1. Development Team](https://github.com/UoB-COMSM0166/2026-group-21?tab=readme-ov-file#1-development-team)
- [2. Introduction](https://github.com/UoB-COMSM0166/2026-group-21?tab=readme-ov-file#2-introduction)
- [3. Requirements](https://github.com/UoB-COMSM0166/2026-group-21?tab=readme-ov-file#3-requirements)
- [4. Design](https://github.com/UoB-COMSM0166/2026-group-21?tab=readme-ov-file#4-design)
- [5. Implementation](https://github.com/UoB-COMSM0166/2026-group-21?tab=readme-ov-file#5-implementation)
- [6. Evaluation](https://github.com/UoB-COMSM0166/2026-group-21?tab=readme-ov-file#6-evaluation)
- [7. Process](https://github.com/UoB-COMSM0166/2026-group-21?tab=readme-ov-file#7-process)
- [8. Sustainability, ethics and accessibility](https://github.com/UoB-COMSM0166/2026-group-21?tab=readme-ov-file#8-sustainability,-ethics-and-accessibility)
- [9. Conclusion](https://github.com/UoB-COMSM0166/2026-group-21?tab=readme-ov-file#9-conclusion)
- [10. AI statement](https://github.com/UoB-COMSM0166/2026-group-21?tab=readme-ov-file#10-ai-statement)
- [11. Contribution Statement](https://github.com/UoB-COMSM0166/2026-group-21?tab=readme-ov-file#11-contribution-statement)

# 1. Development Team
<p align="center">
  <b>Figure 1:</b>
  <i>Development Team</i>
  <br>
  <img src="weekly-homeworks/assets/week-01-photo.jpeg" width="500" alt="Group photo">
</p>

<div align="center">
  <b>Table 2:</b>
  <i>Team Member Description</i>
  <br>

| NAME                  | EMAIl                 | ROLE                 |
| --------------------- | --------------------- | -------------------- |
| Xian Li               | yd25988@bristol.ac.uk |Core Developer        |
| Yu-Han Sun            | qv25088@bristol.ac.uk |Art & Sound Developer |
| Yu-Chun Chen          | df25142@bristol.ac.uk |UI/UX Developer       |
| Yujing Shen           | pf25516@bristol.ac.uk |Gameplay Developer    |
| Panarin Thipboonthong | uk25559@bristol.ac.uk |Gameplay Developer    |
| Koki Fushiya          | bz25385@bristol.ac.uk |AI Developer & Testing|

</div>

# 2. Introduction
Fur-hand Smash is a top-down 2.5D 1v1 tennis game inspired by genre classics like *Super Tennis* and *Mario Tennis*. As a team of fans who love the sport, we wanted to take the competitive spirit of real-world tennis and pack it into a arcade-style format.

We kept the mechanics simple to ensure matches stay fast-paced. Instead of wrestling with complex inputs, players just need to focus on positioning and the timing of their hits, serves, and special skills. Winning a point is all about catching your opponent off-guard or driving the ball past them, and the first player to reach the target score wins the match.

Everything runs on a custom physics system we built to find a "sweet spot" between realistic ball movement and arcade fun. This logic handles everything in our local multiplayer and single-player modes. To keep things interesting, we added two main gameplay twists:

- **Skill System:** Each character has a unique ability to add a layer of strategy to the 1v1 matches. These active skills allow for tactical advantages, ranging from instant movement to ball manipulation:

<p align="center">
  <b>Table 3:</b>
  <i>Character Skill Sets Overview</i>
</p>

|Character|Image|Skill|Description|
|:-|:-|:-|:-|
|**Cat**|<img src="docs/assets/images/player_cat_front.png" width="80">|Shadow Teleport|Instantly teleports the character directly in front of the ball.|
|**Dog**|<img src="docs/assets/images/player_dog_front.png" width="80">|Giga Ball|Hits a massive ball that increases the hit area and stuns the opponent.|
|**Deer**|<img src="docs/assets/images/player_deer_front.png" width="80">|Forest Zen|Launches a slow-speed ball to disrupt the opponent's timing.|
|**Bird**|<img src="docs/assets/images/player_bird_front.png" width="80">|Feather Storm|Shrinks the ball while significantly increasing its velocity.|

<p align="center">
  <b>Figure 4:</b>
  <i>Demonstration of Dog's 'Giga Ball' skill</i>
  <br>
  <img src="weekly-homeworks/assets/report-skill.gif" alt="Demonstration of skill system" width="200">
</p>

- **Dynamic Environments:** We designed different courts with unique environmental hazards. The court itself acts as a variable, forcing players to change how they move and time their shots based on the map's mechanics:

<p align="center">
  <b>Table 5:</b>
  <i>Maps Overview</i>
</p>

|Map|Image|Map Effect|
|:-|:-|:-|
|**Polar**|<img src="docs/assets/images/preview_polar_bg.png" width="200">|Features a frozen court that significantly reduces friction.|
|**Egypt**|<img src="docs/assets/images/preview_eygpt_bg.png" width="200">|Triggers random sandstorms. These wind gusts apply force to the ball's trajectory.|
|**Wimbledon**|<img src="docs/assets/images/preview_wimbledon_bg.png" width="200">|A classic grass court with no environmental hazards.|

<p align="center">
  <b>Figure 6:</b>
  <i>Demonstration of Wind Affecting Ball Trajectory</i>
  <br>
  <img src="weekly-homeworks/assets/report-mapeffect.gif" alt="Demonstration of Skill System" width="200">
</p>
    

# 3. Requirements 
## Ideation Process
Our first brainstorming produced many ideas, but we were concerned about what we could realistically build with p5.js. After researching independently, we shared concepts in a [Google Doc](https://docs.google.com/document/d/1nrocSGf6uqzb97ttsJxpVtYdhJrd-7BKs9r7RD0a1_Y/edit?usp=sharing), each including potential challenges and a unique 'twist'. Interestingly, three of us proposed similar ball-sports games. After a group vote, we narrowed the candidates down to two: the Tennis game and a Vampire Survivors-style project.

## Early Stages Design
We researched similar games on Google and Steam to benchmark visuals and mechanics. These insights informed our Week 3 workshop and follow-up sessions, where we built paper prototypes for our top two concepts to compare their viability.

Workshop feedback confirmed the tennis game as the crowd favorite. Since our team shares a passion for sports, we found the tennis project more intuitive and fleshed-out during the prototyping stage. This external feedback, combined with our own enthusiasm, made it an easy choice to officially move forward with the tennis game.

Prototyping also forced us to address game flow and revealed disagreements regarding how realistic the rules should be. To resolve these, we turned to User Stories and Use Case modeling, which helped us formalize system requirements and ensure the entire team shared the same vision.

<p align="center">
  <b>Figure 7:</b>
  <i>Tennis Game Paper Prototype </i><br>
  <a href="https://www.youtube.com/watch?v=qdplPSo7CMk" target="_blank">Watch it on YT for full audio-visual feedback</a><br>
  <img src="weekly-homeworks/assets/week-03-tennisgame-prototype.gif" alt="Tennis Game Paper Prototype ">
</p>
<p align="center">
  <b>Figure 8:</b>
  <i>Vampire Survival Paper Prototype </i><br>
  <a href="https://www.youtube.com/watch?v=HRUYlSV_QAU" target="_blank">Watch it on YT for full audio-visual feedback</a><br>
  <img src="weekly-homeworks/assets/week-03-vampiresurvival-prototype.gif" alt="Vampire Survival Paper Prototype ">
</p>

## Stakeholders
To better understand our project's scope, we mapped our stakeholders using Ian Alexander’s onion model(2004). As illustrated in Figure 9, our team acts as the primary operators, while the gamers are our core 'beneficiaries' - it’s their needs that ultimately drive our requirements. We also recognize our markers as functional operators during the evaluation phase. They play a 'surrogate role' by representing the high professional standards we aim to meet. Because both players and markers are essential to the game's operational success and final validation, we’ve categorized them within the 'containing system' of the project.

<p align="center">
  <b>Figure 9:</b>
  <i>Onion Model for Stakeholders(Adapted from Alexander, 2004) </i><br>
  <img src="weekly-homeworks/assets/week-04-onionmodel-1.svg" controls width="640" height="640">
  </img>
</p>

## User Stories
We started with plenty of [User Story ideas](https://docs.google.com/document/d/1LYooThDOOa3G9zB3lg5oMovLOXHKsaj8kRKYu5YS_vA/edit?usp=sharing), but we knew we couldn't build everything in the time we had. To stay on track, we applied MoSCoW framework (DSDM Consortium, 2014) to rank our requirements and used Planning Poker (Cohn, 2005) to estimate how long each part would take to develop. This structured approach made it much easier to see where our time was going and allowed us to cut back on lower-priority features. The following User Stories represent the final set we chose for implementation:

<p align="center">
  <b>Table 10:</b>
  <i>User Stories</i>
  <br>
  <img src="weekly-homeworks/assets/week-04-userstory.svg" controls width="640" height="640">
  </img>
</p>

## Use-Case Diagram
After defining our User Stories, we developed a Use Case Diagram to help us visualise how these requirements would actually function within the system. This process was a great way to map out the game's functional boundaries more clearly. For example, by establishing an << include >> relationship between 'Hit Ball' and 'Calculate Ball Physics', we explicitly acknowledged a key technical dependency. It made the team realise that the physics engine wasn't just a feature to be added later, but the very foundation of the core gameplay loop that had to be prioritized from the start.

<p align="center">
      <b>Figure 11:</b>
      <i>User Diagram </i>
      <br>
      <img src="weekly-homeworks/assets/week-04-userdiagram.png" controls width="640" height="640">
      </img>
    </p>

## Refletion
We quickly found that our Use Case Diagrams and User Stories weren't just things we finished at the start and set aside. Instead, they became living documents that we kept coming back to. As we moved into the implementation phase, our hands-on experience with the code gave us a much sharper technical understanding of the game. This meant we were constantly refining our requirements to make sure they stayed accurate and provided a reliable baseline for our testing.

The workshop was a huge turning point for us. The real eye-opener came when we were watching other teams demo their projects, we realized how frustrating it was to watch a game and have no clue how it worked or what the buttons did. This made us look back at our own design with fresh eyes. We realized we’d fallen into the 'Expert Bias' trap: because we were the ones building the game, the controls felt obvious to us, but they would be a total mystery to a new player. This convinced us to move the User Onboarding System to the top of our list.

Prioritizing the player experience led to our toughest decision: scrapping the online multiplayer. While we were excited about the feature, our Planning Poker session provided a necessary reality check. The estimates showed that forcing complex networking into our limited timeframe would risk project stability. We chose to drop this ambition to protect our 'Must-haves', specifically the physics engine and the local 1v1 mode. This trade-off allowed us to stop overextending and focus on perfecting the core gameplay.

# 4. Design (PENDING)
## System Architecture
Our game is architected using a Scene-Based Finite State Machine (FSM) pattern implemented within the p5.js framework.

*   **Game Loop & State Management:** The entry point, `sketch.js`, maintains a global `currentState` variable. The main `draw()` loop manages the control flow by delegating rendering and logic updates to specific Scene objects (e.g., `Scene_Menu`, `Scene_Game`) based on the current state. This design ensures that logic for the menu, character selection, and gameplay remains decoupled。
*   **Entity Coordination:** Game entities like `Player` and `Ball` encapsulate their own rendering and logic. The `Scene_Game` coordinates these entities and bridges them with global managers such as the `ScoreManager`, ensuring smooth interaction during gameplay。
*   **Manager Pattern:** We utilize specialized manager classes (`ScoreManager`, `LayoutManager`) to handle global responsibilities such as game rules, scoring, and responsive screen layout calculations, keeping the core entity classes focused on their specific behaviors.

## Class Diagrams
Our system design underwent several iterations to balance functional requirements with code maintainability. Initially, as shown in Figure 8, our class diagram focused on establishing a clear inheritance hierarchy for game entities. We defined an abstract `Player` class to encapsulate shared movement and swinging logic, while delegating character-specific abilities to the `Cat` and `Dog` subclasses.

<p align="center">
  <b>Figure 12:</b>
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
  <b>Figure 13:</b>
  <i>Final Class Diagram</i><br>
  <img src="weekly-homeworks/assets/week-05-finalclassdiagram.png"></img>
</p>

## Behavioural Diagrams
To illustrate the game's logic flow, we analyzed the "Ball Hit Detection" scenario, which is critical for the gameplay feel.
- **Input & Physics Update:** `Scene_Game` processes player inputs via `swing()` and independently advances the ball's physics using `update()`.
- **State Validation:** Triggered by `checkHit()`, the system first verifies the player's swingTimer and the 3D hit window (Z-axis). If the player is idle, the check safely aborts to optimize performance.
- **Spatial Check:** Once validated, the ball retrieves the player's 2D coordinates and size to confirm bounding box intersection (`hitX` and `hitY`).
- **Physics Resolution:** Upon a confirmed collision, the ball calculates new velocity vectors (`vx`, `vy`, `vz`), updates the match state via `recordHit()`, and resets the player's `swingTimer` to complete the interaction.

<p align="center">
  <b>Figure 14:</b>
  <i>Sequence Diagram: Ball Hit Logic</i>
  <br>
  <img src="weekly-homeworks/assets/week-05-behaviourdiagram.png"controls height="640"></img>
</p>

Employing object-oriented design and UML diagrams was essential for organizing our ideas and establishing a shared understanding of the game's architecture. However, manually updating detailed UML is time-consuming. To keep our documentation agile, our workflow evolved from hand-drawn sketches to Draw.io, and ultimately to Mermaid. Adopting this text-based tool significantly accelerated the process, allowing our diagrams to evolve as "living tools" alongside the codebase. These finalized models now serve as vital documentation for future system maintenance.

# Implementation
## **Technical Challenge 1: Pseudo-3D Ball Physics and Responsive Hitting**

The first major challenge was making a 2D game feel like a 3D tennis match. If we only moved the ball on the X and Y axes, the game would feel very flat. We needed to simulate height and make the hitting mechanics feel natural when the ball interacts with the court surface.

### **1. Simulating Ball Height and Trajectory**
To create a 3D effect on a 2D canvas, we introduced a $z$ variable to represent the ball's height. Instead of just moving the ball, we calculate its vertical position using gravity ($g$) in every frame:

$$z_{t+\Delta t} = z_t + v_{z,t} \cdot \Delta t$$

$$v_{z,t+\Delta t} = v_{z,t} - g \cdot \Delta t$$

To render this properly on a 2D screen, we mapped our internal 3D coordinates to 2D screen coordinates $(x', y')$ using a height-offset projection:

$$\begin{cases} x' = x \\ y' = y - z \end{cases}$$

This simple math creates the visual illusion of the ball "rising" and "falling" while it moves. We also implemented a shadow that changes size depending on the ball's height:

$$R_s(z) = \max(R_{base} - \alpha \cdot z, R_{min})$$

This detail is very important because it helps the player judge where the ball is going to land, making the gameplay much more intuitive.

### **2. Responsive Hitting and Direction Control**
Another challenge was giving players control over their shots. In many simple games, the ball just bounces back at a fixed angle. To make it more realistic, we calculated the "hit offset"—the distance between the ball and the center of the player’s racket when they collide:

$$v_{x, out} = (B_x - P_x) \cdot \lambda$$

Where $B_x$ is the ball's X position, $P_x$ is the player’s center, and $\lambda$ is a multiplier for the angle. This allows players to perform "angled shots" by hitting the ball with the edges of the racket. Furthermore, to adhere to professional tennis rules, we constrained the ball's horizontal velocity $v_x$ during serves. By using the $\text{sgn}$ (sign) function, we ensure the ball is always forced toward the correct diagonal quadrant:

$$v_{x, serve} \in [V_{min}, V_{max}] \cdot \text{sgn}(\text{TargetSide})$$

This mathematical constraint prevents illegal serves and ensures the scoring logic stays consistent with the target court half.

### **3. Handling High-Speed Collisions**
When the ball moves at high speed, it can sometimes pass through a player between frames. To prevent this, we used AABB (Axis-Aligned Bounding Box) detection. An AABB is a rectangular boundary that remains aligned with the X and Y axes of the coordinate system. We determine a collision by checking if the ball and the player's boxes overlap on both axes:

- X-axis Check: $|B_x - P_x| < (B_{width} + P_{width}) / 2 $
- Y-axis Check: $|B_y - P_y| < (B_{height} + P_{height}) / 2 $

By combining this with a high-frequency update loop and Safety Checks (tracking `bounceCount` and `isTossing`), the game correctly identifies hits even at top speed, ensuring the match is fair and free of "tunneling" bugs.

## **Technical Challenge 2: Strategic AI Behavior and Predictive Movement** (Pending)

## Additional System Implementation
Beyond the technical challenges discussed previously, and the character skills and map effects mentioned in the Introduction, we implemented several supporting systems to ensure a polished and functional user experience:

-  **Step-by-Step Tutorial:** We created an interactive onboarding mode that guides new players through the core controls and physics before they start a real match.
-  **Animation:** We synchronized our state-driven sprite sheets with the character's actions to make the visual feedback feel smooth.
-  **Responsive Layout:** We made every interface in the game fully responsive by using relative coordinate mapping instead of fixed pixels. This ensures the game adapts perfectly to any screen size, preventing the court from being cut off or obscured on smaller displays. By doing this, we guaranteed that the game remains fully playable and fair for everyone, regardless of their monitor resolution or window size.
-  **Audio Management:** We put extra care into the auditory experience by implementing fade-in and fade-out transitions for all background music. This prevents sudden, jarring volume changes when switching between game scenes or music tracks. Additionally, we developed a settings menu that allows players to independently adjust the volume levels of both BGM and SFX, ensuring a more comfortable and customizable user experience.
-  **Unified UI Controls & Feedback:** To make the game more accessible, we ensured that every menu and interface is fully controllable using both the mouse and keyboard. Regardless of the input method, we focused on providing immediate audio-visual feedback. For instance, distinct sound effects are triggered whenever a player hovers over a button with the mouse or changes their selection using the keyboard, making the UI feel more responsive and intuitive to navigate.

<p align="center">
      <b>Figure XX:</b>
      <i>Demonstration of Responsive UI Design</i>
      <br>
      <img src="weekly-homeworks/assets/report-resize.gif" width="600" alt="Demonstration of Responsive UI Design">
</p>

<p align="center">
      <b>Figure XX:</b>
      <i>Demonstration of Interactive Onboarding</i>
      <br>
      <img src="weekly-homeworks/assets/report-tutorial.gif" width="600" alt="Demonstration of Interactive Onboarding">
</p>

# 6. Evaluation
Understanding user feedback is a cornerstone of our development process. Our goal is to provide an experience that is both engaging and accessible. We leverage both qualitative evaluation and quantitative analysis to gain a deeper insight into user needs, allowing us to define a clear roadmap for game improvements.
## Qualitative Evaluation

### Think Aloud
During the workshop, we ran usability tests with three participants to see how they interacted with our prototype. We asked them to navigate the menu and play through two single-player sessions at different difficulty levels. By using the 'Think Aloud' method (Lewis, 1982), we were able to capture their immediate reactions and frustrations as they played. We then mapped these insights onto a Prioritization Quadrant Diagram (Figure 17), which gave us a clear way to decide which improvements were most urgent for the next stage of development.

<p align="center">
  <b>Figure 17:</b>
  <i>Quadrant Diagram: Think Aloud</i>
  <br>
  <img src="weekly-homeworks/assets/week-07-thinkaloud.svg"controls height="640"></img>
</p>

### Heuristic Evaluation
To complement the feedback we gathered from players, we also performed a Heuristic Evaluation based on Jakob Nielsen’s principles (1994). While 'Think Aloud' sessions showed us where players struggled, this structured audit helped us identify deeper interface flaws that might have been overlooked. By assigning severity ratings to each issue, we were able to turn our observations into a practical plan. This ensured we weren't just guessing what to fix next, but were instead tackling the most critical usability gaps first.

<p align="center">
  <b>Table 18:</b>
  <i>Heuristic Evaluation</i>
  <br>
  <img src="weekly-homeworks/assets/week-07-heuristic.svg"controls height="800"></img>
</p>

### Improvements and Implementation
Based on the feedback from our 'Think Aloud' sessions and Heuristic Evaluation, we focused on several key updates to bridge the gap between our design and the player’s needs:

- **Integrated Control Hints:** To lower the cognitive load for new players, we added a control reference guide within the pause menu. This uses clear icons to remind players of the key mappings for movement, hitting, and skills, ensuring they don't have to rely purely on memory during a match.
- **Enhanced User Control:** We implemented a functional pause menu, giving players the flexibility to restart the match or return to the main menu at any time.
- **Visual & Accessibility Optimization:** All UI components were redesigned with larger fonts and high-contrast colors. This was a direct response to feedback regarding clarity and ensures the game is accessible across different screens.
- **Game Feel & Feedback:** To make the gameplay more responsive, we added visual pop-ups (like "Miss" or "Perfect") and integrated auditory cues, such as audience cheering, to provide immediate feedback on the player's actions.
- **AI & Match Flow:** We upgraded the AI logic with diverse serving patterns and difficulty scaling to keep the challenge engaging. Additionally, we added dedicated screens for scoring and "side-changes" to make the match progress easier to follow.

<p align="center">
  <b>Figure 19:</b>
  <i>Visual Improvements for the Difficulty Menu</i>
</p>

<div style="display: flex; align-items: center; justify-content: center; gap: 20px; text-align: center;">
  
  <div>
    <img src="weekly-homeworks/assets/report-old-difficulty.png" alt="Old Version" height="200">
    <br>
    <b>Figure 19a:</b> <i>Old Version</i>
  </div>

  <div style="font-size: 20px;">
    ➔
  </div>

  <div>
    <img src="weekly-homeworks/assets/report-new-difficulty.png" alt="New Version" height="200">
    <br>
    <b>Figure 19b:</b> <i>New Version</i>
  </div>

</div>

## Quantitative Analysis
After our iterative updates, we wanted to ensure the difficulty levels were properly balanced. We recruited ten participants to test both the 'Easy' and 'Difficult' settings in our single-player mode. To get an objective measure of the user experience and mental effort required, we used the System Usability Scale (SUS) (Brooke, 1996) and the NASA Task Load Index (NASA-TLX) (Hart and Staveland, 1988). These metrics allowed us to analyze the cognitive workload across different stages, helping us fine-tune the gameplay so it feels challenging but fair.

### System Usability Scale

<p align="center">
  <b>Table 20:</b>
  <i>System Usability Scale</i>
  <br>
  <img src="weekly-homeworks/assets/week-08-sus.svg"controls height="400"></img>
</p>


### NASA Task Load Index

<p align="center">
  <b>Table 21:</b>
  <i>NASA Task Load Index</i>
  <br>
  <img src="weekly-homeworks/assets/week-08-nasa.svg"controls height="400"></img>
</p>

### Quantitative Findings
The quantitative evaluation demonstrates that the game successfully balances challenge with user experience:

**System Usability (SUS):** The average scores for both difficulty levels (78.25 and 78.50) are well above the industry average of 68. Statistical testing indicates no significant difference in usability between levels ($W=14 > 2$), suggesting that increasing the game's difficulty did not negatively impact the system's intuitiveness or ease of use.

**Perceived Workload(NASA TLX):** There is a statistically significant increase in workload from the Easy to the Hard level ($W=2 \leq 8$). This confirms that our difficulty design was effective, as players experienced a measurably higher level of mental and physical demand, effort, and challenge in the harder mode.

In summary, the results show that while the Hard level significantly increased the perceived challenge for players, the game maintained a consistently high standard of usability across both modes.

### Testing
To maintain a stable and playable experience, we established a multi-layered testing workflow throughout the development lifecycle. This began with a strict pre-merge process where every update required a Pull Request to be peer-reviewed, and fully tested. The specifics of this collaborative review process are detailed in the Process section. To further accelerate our cycle, we built a custom debug interface (Figure 22) that allowed for the instant toggling of difficulty, characters, and maps, making it much easier to isolate edge cases without playing through entire matches. Finally, we integrated automated unit testing with Jest to verify our scoring and collision logic. By decoupling these mathematical calculations from the p5.js rendering engine, we were able to ensure the game’s core rules remained accurate and functional, completely independent of the visuals.

<p align="center">
  <b>Figure 22:</b>
  <i>Demonstration of Debug Mode</i>
  <br>
  <img src="weekly-homeworks/assets/report-debug.png" width="300"></img>
</p>

# 7. Process 
Our team dynamic focused on clear roles and consistent communication. While we worked as a flat organization, we divided responsibilities based on our individual strengths, such as core physics, AI logic, and UI design. To keep the project on track, we broke down our goals into specific weekly deliverables, ensuring everyone knew exactly what they were responsible for each week.

We combined weekly in-person meetings with daily digital communication to stay organized. Our weekly sessions were reserved for deep-dive technical discussions and long-term planning, while **WhatsApp** (Figure 24) served as our hub for rapid decision-making and continuous updates. We also utilized **GitHub Issues** and **Pull Requests** to host more detailed technical conversations (Figure 25). Posting test results and logs directly on the platform allowed us to discuss changes in context and keep a clear record of why specific implementation choices were made. This multi-layered approach ensured that major blockers were resolved together while daily progress never stalled.

<p align="center">
  <b>Figure 23:</b>
  <i>Weekly Team Meeting</i>
  <br>
  <img src="weekly-homeworks/assets/report-meeting.JPG" width="600"></img>
</p>
<p align="center">
  <b>Figure 24:</b>
  <i>Whatsapp Communication</i>
  <br>
  <img src="weekly-homeworks/assets/report-whatsapp.PNG"controls height="400"></img>
</p>
<p align="center">
  <b>Figure 25:</b>
  <i>Peer review and technical discussion within a Pull Request</i>
  <br>
  <img src="weekly-homeworks/assets/report-pullrequest-discussion.png"controls height="400"></img>
</p>

To keep our development on track, we used [**GitHub Projects**](https://github.com/orgs/UoB-COMSM0166/projects/165) (Figure 26) as our centralized Kanban board. We created specific issues for every feature, bug fix, and documentation task, tracking them through a clear pipeline from `Ready` to `Done`. This visual workflow was crucial for managing our weekly progress and ensuring no critical tasks fell through the cracks. For writing and report drafting, we relied on **Google Docs** (Figure 27) as our primary space for real-time collaborative editing.

<p align="center">
  <b>Figure 26:</b>
  <i>GitHub Projects</i>
  <br>
  <img src="weekly-homeworks/assets/report-githubproject.png" width="800"></img>
</p>

<p align="center">
  <b>Figure 27:</b>
  <i>Goolge Docs</i>
  <br>
  <img src="weekly-homeworks/assets/report-googledoc.png" width="800"></img>
</p>

### **Workflow and Standardization**
Managing a shared codebase with six contributors required clear standards to avoid integration issues. We established a technical workflow within a [**`CONTRIBUTING.md`**](https://github.com/UoB-COMSM0166/2026-group-21/blob/main/docs/CONTRIBUTING.md) file, which served as our primary guide for the team. This document outlined our core standards, such as using CamelCase for consistent naming and ensuring commit messages were descriptive enough to keep our version history readable. We strictly followed a 'Feature Branching' strategy (Figure 28), where development was restricted to dedicated branches. To protect our `main` branch, the cornerstone of our workflow was the mandatory Pull Request (PR) and Peer Review process (Figure 29). No code was merged until it had been reviewed and tested by another teammate, a practice that not only caught bugs early but also ensured that technical knowledge was shared across the entire group.

<p align="center">
  <b>Figure 28:</b>
  <i>Branch</i>
  <br>
  <img src="weekly-homeworks/assets/report-branch.png" width="600"></img>
</p>

<p align="center">
  <b>Figure 29:</b>
  <i>GitHub Pull Request</i>
  <br>
  <img src="weekly-homeworks/assets/report-pullrequest.png"controls height="400"></img>
</p>

### **Reflection**
Implementing our workflow in practice wasn't always smooth, and our ability to adapt was key to our success. In the beginning, the team struggled with Git collaboration; while merge conflicts were expected, we initially lacked the confidence to resolve them effectively. This uncertainty often slowed us down and resulted in messy commit histories. We fixed this by centralizing our procedures in a `CONTRIBUTING.md` file. This guide acted as a roadmap for the team, providing clear instructions for Git operations. Once these guidelines were in place, members could resolve technical friction on their own, allowing us to move much faster and maintain a higher standard for our shared code.

A major challenge we faced was the varying levels of familiarity with p5.js among team members, which naturally affected our individual coding speeds. Initially, this led to an uneven workload in core development. While we tried to balance weekly tasks, the reality was that members with more technical experience often contributed a larger volume of code. We managed this gap by assigning each person clear, distinct deliverables that matched their strengths. This strategy ensured that everyone remained productive and motivated, keeping our progress consistent throughout the project.

Balancing development with academic breaks like Reading Week and Easter proved to be a challenge. To ensure everyone could fully recharge, we paused our meeting schedule during these holidays. While this was important for morale, it did cause our momentum to stall. We found that getting everyone back on the same page and merging individual updates post-holiday required a significant 'catch-up' period. Moving forward, we realized that setting clearer milestones before major breaks would have made the re-integration process much smoother.

## **Game Assets and Production Tools**
Due to the lack of a specialized artist in our group, we leveraged various Generative AI tools to create our game assets, which was essential to achieving our desired aesthetic within the limited time. We utilized **Gemini** and **Banana Pro** for generating core visual assets. Following a process of manual refinement, we used [**EZGIF**](https://ezgif.com/) to convert video animations into individual image frames, which were then imported into [**PISKEL**](https://www.piskelapp.com/) to be compiled into functional Sprite Sheets. Background music was produced using [**Suno**](https://suno.com/), while sound effects were created via [**Adobe Firefly**](https://firefly.adobe.com/). For system architecture documentation, we utilized [**drawio**](https://www.drawio.com/) and [**mermaid**](https://mermaid.ai/).

# 8. Sustainability, ethics and accessibility

# 9. Conclusion
This project was a great practical exercise in managing the intersection of software engineering and game design. We learned firsthand that a working game requires much more than just clean code, it requires constant communication and alignment. By engaging in the early workshop exercises, we were able to set clear objectives for our game from the very beginning. This preparation was key in helping us integrate our separate contributions into a stable system, even as the game logic grew more complex over the term.

### Challenges and Reflection  
During the early stages of the project, we encountered minor Git merge conflicts due to overlapping edits in core modules. To keep our workflow smooth, we sequenced our tasks so that foundational logic was finalized before we moved on to dependent features.
Reflecting on this experience, we realized that these overlaps were a result of our code structure having too much interdependency between game logic and rendering. While managing our task sequencing served as a helpful workflow adjustment, a more robust technical solution for future projects would be to implement design patterns such as Entity-Component-System (ECS) or Model-View-Controller (MVC) separation. By keeping the logic and graphics separate, we could have worked on different features at the same time without overlapping, which would have made the development process much smoother and less errors.

Another significant learning point involves our testing strategy. While we successfully integrated the Jest framework to verify core mechanics like the ScoreManager and Ball physics, this was implemented during the final stages of development. Looking back, we realized that starting with a Test-Driven Development (TDD) approach would have made the code much more reliable and saved us a lot of time by catching bugs much earlier in the process.

### Future Work  
One of the things we struggled with was adding a fourth AI type called the 'Attacker'. We really wanted to make a personality that would play aggressively and put pressure on the player. However, we realized that since our current physics model uses a constant speed for the ball, we couldn't actually control how hard the ball was hit. This made it almost impossible to balance the Attacker's playstyle. In the end, we decided not to include it in the main game, but you can still try it out by pressing '9' in the Debug Panel.
That’s why our next big goal is to replace the fixed-power system with a more dynamic 'Hit Force' mechanic. We want hit power to be determined by charge duration, requiring players to time their button press and hold it to unleash a stronger shot. This would add a lot more depth to the game’s strategy. Fixing this core physics part is the first step we need to take before we can finally get the Attacker AI working the way we originally imagined.

If we were to take this project even further, our focus would be on adding a lot more variety and bringing the game online. We’d love to introduce a diverse roster of characters, each with their own unique stats, along with themed maps where surface friction, like grass or clay, actually changes how the ball behaves. The biggest goal, however, would be moving beyond local play. By implementing a client-server architecture with WebSockets, we could open the game up to global competition and real-time matchmaking.

# 10. AI statement
We declare that Generative AI tools were utilized for technical and creative support during this project. Specifically, AI was used to generate base assets for character sprites, court backgrounds, and audio samples. These assets underwent further refinement by the team to ensure their seamless integration into our game project. During the early design phase, AI also served as a consultative tool for brainstorming our project structure and class hierarchy, which helped establish the foundation for our physics and state-driven systems. Additionally, we used AI to help troubleshoot specific logic errors and identify edge cases in our core gameplay logic and physics calculations. Overall, the final implementation was manually reviewed and verified by the team to ensure that all technical and academic requirements were met.

# 11. Contribution Statement
<p align="center">
  <b>Table 30:</b>
  <i>Contributions for Game Project</i>
</p>

<div align="center">

| Contributor           | Contribution  | 
| --------------------- | ------------- |
| Xian Li               | 1.00          |
| Yu-Han Sun            | 1.00          |
| Yu-Chun Chen          | 1.00          |
| Yujing Shen           | 1.00          |
| Panarin Thipboonthong | 1.00          |
| Koki Fushiya          | 1.00          |

</div>

# 12. References (pending)
Alexander, I. (2005). A Taxonomy of Stakeholders: Human Roles in System Development. International Journal of Technology and Human Interaction, 1(1), pp. 23-59.
Agile Business Consortium (2014). The DSDM Agile Project Framework. [online] Available at: https://www.agilebusiness.org.
Cohn, M. (2005). Agile Estimating and Planning. Upper Saddle River, NJ: Prentice Hall.
Lewis, C.H. (1982). Using the "Think Aloud" Method in Cognitive Interface Design. IBM.
Nielsen (1994)
Brooke, J. (1996). SUS: A 'quick and dirty' usability scale. In: Jordan, P.W., Thomas, B., McClelland, I.L. and Weerdmeester, B. (eds.) Usability Evaluation in Industry. London: Taylor & Francis, pp. 189–194.
Hart, S.G. and Staveland, L.E. (1988). Development of NASA-TLX (Task Load Index): Results of empirical and theoretical research. Advances in Psychology, 52, pp. 139–183.