# Project Development Guidelines #
To maintain code quality and collaboration efficiency, all team members should follow these guidelines.
## Commit Message Conventions ##

All commit messages must be in English and include a specific prefix. A brief summary is fine, there is no need for excessive detail.

|Prefix|Usage|Example|
| :--- | :--- | :--- |
|feat:|A new feature|feat: add skill power bar|
|fix:|A bug fix|fix: correct AI movement logic|
|docs:|Documentation only changes(README, etc.)|docs: update evaluation feedback|
|ui:|Visual/UI adjustments|ui: implement character animations|
|refactor:|Code changes that neither fix a bug nor add a feature|refactor: adjust hitting angles|
|chore:|Miscellaneous (Config, moving files, etc.)|chore: rename asset folders|

## Naming Conventions ##

#### Files & Folders ####

- **JavaScript Files:** Use **PascalCase** (Capitalize the first letter of each word).

    - Example: SkillManager.js, Player.js, Ball.js

- **Assets:** Use **lowercase_with_underscores**.

    - Example: player_hit_01.png, background_court.mp4

Note on Legacy Files:
I know that several existing files do not yet align with these standards. I will perform a collective refactor to update these filenames at a later stage.

#### In-code Naming ####

- Variables & Functions: Use **camelCase** (First word lowercase, subsequent words capitalized).

    - Example: skillCooldown, updateScore()

## Branching Strategy ##
- **No Direct Commits to main:** Please avoid developing directly on the `main` branch.

- **Branch Naming:** Use the format **prefix/description** (e.g., feat/skill-logic or fix/ai-bug) is recommended but not mandatory.

- **Syncing:** Keep your branch up to date with `main` to avoid large merge conflicts.

## Recommended Setup ##
- **Editor**: Use **Visual Studio Code**.

- **Live Testing**: Install the **Live Server** extension.

- **Execution**: Open `index.html` and click the **"Go Live"** button in the bottom-right corner to view the game in your local browser.

## GitHub Workflow
To keep the `main` branch stable, please follow this process:

1. **Sync with Main**:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create a Task Branch:**
    ```bash
    git checkout -b prefix/your-task-name
    ```
3. **Commit Your Changes:**  
    Ensure you use the correct prefix:
    ```bash
    git add .
    git commit -m "feat: add your short message here"
    ```
4. **Push & Pull Request:**
    ```bash
    git push origin prefix/your-task-name
    ```
5. Open a PR on GitHub and assign @fatxian for review. 

6. **Post-Merge Cleanup:**  
    Once your PR is merged, you can delete the branch directly on GitHub by clicking the "Delete branch" button. To clean up your local machine, run:
    ```bash
    git checkout main
    git pull origin main
    git branch -d prefix/your-task-name
    ```
### Handling Merge Conflicts ###
If you encounter a conflict, try to merge `main` into your branch first to resolve it locally.

1. **Update your local main:**
    ```bash
    git checkout main
    git pull origin main
    ```
2. **Switch back to your task branch:**
    ```bash
    git checkout prefix/your-task-name
    ```
3. **Merge main into your branch:**
    ```bash
    git merge main
    ```
4. **Fix the conflicts:**  
VS Code will highlight the conflicting lines in Red/Blue.  
Choose which change to keep (Accept Incoming, Accept Current, or Accept Both).

5. **Finalize the merge:**
    ```bash
    git add .
    git commit -m "chore: resolve merge conflicts with main"
    git push origin prefix/your-task-name
    ```
**Important:** If you are unsure how to resolve a conflict, do not use `git push --force`. Ask for help in the group chat, and we can go through it together.