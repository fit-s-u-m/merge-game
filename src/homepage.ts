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
		const backgroundTexture = await this.renderer.loadAsset(
			"/assets/ui/home-text.png"
		);
		const playExitTexture = await this.renderer.loadAsset(
			"/assets/ui/home-page play button-2.png"
		);
		this.backgroundSprite = this.renderer.createSprite(backgroundTexture);
		this.playExitSprite = this.renderer.createSprite(playExitTexture);

		this.backgroundSprite.width = this.renderer.app.screen.width * 0.5;
		this.backgroundSprite.height = this.renderer.app.screen.height * 0.5;

		this.playExitSprite.scale.set(1.2);
		this.backgroundSprite.scale.set(0.3);

		// Position background and play/exit image
		this.backgroundSprite.position.set(
			this.renderer.app.screen.width / 2,
			this.renderer.app.screen.height / 4
		);
		this.backgroundSprite.anchor.set(0.5, 0.85);

		this.playExitSprite.position.set(
			this.renderer.app.screen.width / 2,
			this.renderer.app.screen.height / 2
		);
		this.playExitSprite.anchor.set(0.5, 0.2);

		this.playExitSprite.interactive = true;
		this.playExitSprite.buttonMode = true;

		this.renderer.stage(this.backgroundSprite, this.playExitSprite);

		this.playButtonSprite = this.renderer.createButton(0, 0, 400, 150, () =>
			this.onPlayClick()
		);
		this.exitButtonSprite = this.renderer.createButton(0, 0, 250, 80, () =>
			this.onExitClick()
		);

		this.renderer.stage(this.playButtonSprite, this.exitButtonSprite);

		this.updateButtonPositions();

		window.addEventListener("resize", () => this.updateButtonPositions());
	}

	updateButtonPositions() {
		if (
			!this.playExitSprite ||
			!this.playButtonSprite ||
			!this.exitButtonSprite
		)
			return;

		const playButtonX =
			this.playExitSprite.position.x - this.playExitSprite.width / 2 + 120;
		const playButtonY = this.playExitSprite.position.y + 80;

		const exitButtonX =
			this.playExitSprite.position.x - this.playExitSprite.width / 2 + 190;
		const exitButtonY = this.playExitSprite.position.y + 320;

		this.playButtonSprite.position.set(playButtonX, playButtonY);
		this.exitButtonSprite.position.set(exitButtonX, exitButtonY);
	}

	onPlayClick() {
		console.log("Play button clicked");
		this.renderer.app.stage.removeChild(this.playButtonSprite);
		this.renderer.app.stage.removeChild(this.exitButtonSprite);
		if (this.playExitSprite) {
			gsap.to(this.playExitSprite, {
				duration: 1,
				alpha: 0,
				onComplete: () => this.startGame(),
			});
		} else {
			console.error("playExitSprite is undefined");
		}
	}

	onExitClick() {
		console.log("Exit button clicked");
		
		if (confirm("Are you sure you want to exit the game?")) {
			window.close();  // May not work in most browsers
			window.location.href = 'https://your-homepage.com';  
		}
	}
	
	startGame() {
		console.log("Starting the game...");
		gsap.set(this.renderer.app.stage, { alpha: 1 });
		const grid = new Grid(this.renderer);
		grid.init();
	}
}
