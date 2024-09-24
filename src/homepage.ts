import { RENDERER, SPRITE } from "../types";
import gsap from "gsap";
import { Grid } from "./grid";

export class HomePage {
    renderer: RENDERER;
    backgroundSprite?: SPRITE;
    playExitSprite?: SPRITE;
    playButtonSprite?: any;
    exitButtonSprite?: any;
    
    constructor(renderer: RENDERER) {
        this.renderer = renderer;
    }

    async init() {
        // Load background and play/exit image using the renderer
        const backgroundTexture = await this.renderer.loadAsset("/assets/ui/home-text.png");
        const playExitTexture = await this.renderer.loadAsset("/assets/ui/home-page play button.png");
        this.backgroundSprite = this.renderer.createSprite(backgroundTexture);
        this.playExitSprite = this.renderer.createSprite(playExitTexture);

        // Set sizes for background and play/exit image
        this.backgroundSprite.width = this.renderer.app.screen.width * 0.5;
        this.backgroundSprite.height = this.renderer.app.screen.height * 0.5;

        this.playExitSprite.scale.set(1.2);
        this.backgroundSprite.scale.set(0.3);

        // Position background and play/exit image
        this.backgroundSprite.position.set(this.renderer.app.screen.width / 2, this.renderer.app.screen.height / 4);
        this.backgroundSprite.anchor.set(0.5, 0.85);

        this.playExitSprite.position.set(this.renderer.app.screen.width / 2, this.renderer.app.screen.height / 2);
        this.playExitSprite.anchor.set(0.5, 0.2);

        // Make the play/exit image interactive
        this.playExitSprite.interactive = true;
        this.playExitSprite.buttonMode = true;

        // Stage background and play/exit image
        this.renderer.stage(this.backgroundSprite, this.playExitSprite);

        // Create Play and Exit buttons using the renderer
        this.playButtonSprite = this.renderer.createButton(0, 0, 400, 150, () => this.onPlayClick());
        this.exitButtonSprite = this.renderer.createButton(0, 0, 250, 80, () => this.onExitClick());

        // Add buttons to the stage
        this.renderer.stage(this.playButtonSprite, this.exitButtonSprite);

        // Initial update of button positions based on the play/exit image
        this.updateButtonPositions();

        // Recalculate positions on window resize
        window.addEventListener('resize', () => this.updateButtonPositions());
    }

    // Dynamically update button positions based on play/exit image
    updateButtonPositions() {
        if (!this.playExitSprite || !this.playButtonSprite || !this.exitButtonSprite) return;

        // Align the buttons based on the play/exit image's current position and size
        const playButtonX = this.playExitSprite.position.x - (this.playExitSprite.width / 2) + 120; // Adjust as needed
        const playButtonY = this.playExitSprite.position.y + 80; // Adjust as needed

        const exitButtonX = this.playExitSprite.position.x - (this.playExitSprite.width / 2) + 190; // Adjust as needed
        const exitButtonY = this.playExitSprite.position.y + 320; // Adjust as needed

        // Set the position of the buttons to follow the play/exit image
        this.playButtonSprite.position.set(playButtonX, playButtonY);
        this.exitButtonSprite.position.set(exitButtonX, exitButtonY);
    }

    onPlayClick() {
        console.log("Play button clicked");
     this.renderer.app.stage.removeChild(this.playButtonSprite);
     this.renderer.app.stage.removeChild(this.exitButtonSprite);
        if (this.playExitSprite) {
            gsap.to(this.playExitSprite, { duration: 1, alpha: 0, onComplete: () => this.startGame() });
        } else {
            console.error("playExitSprite is undefined");
        }
    }

    onExitClick() {
        console.log("Exit button clicked");
    }

    startGame() {
        console.log("Starting the game...");
        gsap.set(this.renderer.app.stage, { alpha: 1 });
        const grid = new Grid(this.renderer);
        grid.init();
    }
}
