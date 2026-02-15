## **Stakeholders**

* **Internal:** Development Team, Producer, Project Manager, Balance Designers, Artists, Programmers, CEO / Product Owner.
* **External:** Players (Competitive & Casual), Publishers, Investors, Media & Influencers.

## **User Stories & Acceptance Criteria**

* **User Story:**  **As a** player who appreciates real tennis, **I want** the ball to behave according to real-world physics and the game to provide immediate hitting feedback **so that** I can feel the impact of each shot and hit the ball with accuracy.


* **Acceptance Criteria:**
    
    - **Given** a standard rally, **when** the ball interacts with the court or racket, **then** the bounce and friction must follow professional tennis principles.

    - **Given** the ball is inside the hitting area, **when** the player presses the hit button, **then** the system must provide immediate visual or sound feedback to ensure a satisfying game feel.

    - **Given** a specific court location, **when** the ball bounces, **then** the physics must adjust based on environmental factors like temperature or surface type.

* **User Story:** 
**As a** competitive player, **I want** to follow standard tennis scoring logic but with a faster "Best of Three Games" win condition, **so that** matches are intense, fair, and suitable for quick play sessions.

* **Acceptance Criteria:**
    - **Given** the game is in progress, **when** scoring occurs, **then** the system must follow the 0, 15, 30, 40, Deuce, and Advantage logic.
    
    - **Given** a match starts, **when** a player wins their 3rd game, **then** that player is declared the winner of the match.
    
    - **Given** the game is in 'Serve Mode', **when** the player prepares to serve, **then** movement must be constrained between the center mark and the sideline.

    - **Given** a serve is executed, **when** the ball lands, **then** it must land within the designated service box to be considered 'In'.
    
    - **Given** the ball lands, **when** it is outside the official court boundaries, **then** it must be called "Out".

* **User Story:** **As a** gamer, **I want** different characters to have unique active skills (e.g., Teleport, Enlarge, or Time-Slow), **so that** I can choose a character that fits my playstyle and use strategy to win.

* **Acceptance Criteria:**
    * **Given** the character’s skill gauge is full, **when** the player activates a skill, **then** the specific effect must be triggered.
    
    * **Given** a skill has been activated, **when** the action is completed, **then** the skill must enter a "Cooldown" or "Disabled" state to prevent infinite usage.

* **User Story:** **As a** beginner player, **I want** a guided tutorial and clear hitting feedback, **so that** I can master the basic movement and timing required for professional-level play.

* **Acceptance Criteria:**
    * **Given** the tutorial mode is active, **when** the player completes movement and shooting tasks, **then** they are granted access to the main game.
    
    *  **Given** a player hits the ball, **when** the timing is "Perfect," **then** the UI must display green text and trigger crowd cheers.

    *  **Given** the timing is "Bad/Miss," **when** the player fails the shot, **then** the UI must display red text ("Miss") and trigger a disappointed crowd sound.

* **User Story:** **As a** player, **I want** low-latency multiplayer and a smart AI for single-player mode, **so that** I can practice alone or have a fair match with friends without lag.

* **Acceptance Criteria:**
    * **Given** a multiplayer match, **when** data is synchronized between players, **then** there must be no noticeable lag or synchronization errors.
    
    * **Given** 'Single Player Mode' is selected, **when** the game loads, **then** the system must generate an AI opponent with adjustable difficulty.
    
    * **Given** a match ends, **when** the application is closed, **then** match history and skill points must be saved and restored automatically.


[Original Requirements Collection](https://docs.google.com/document/d/1LYooThDOOa3G9zB3lg5oMovLOXHKsaj8kRKYu5YS_vA/edit?usp=sharing)