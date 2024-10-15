import { RENDERER, SPRITE } from "../types";
import gsap from "gsap";
import { Grid } from "./grid";
import { resizeable } from "./utils/resizeable";

export class HomePage implements resizeable {
	renderer: RENDERER;
	backgroundSprite?: SPRITE;
	playExitSprite?: SPRITE;
	playButtonSprite?: any;
	exitButtonSprite?: any;
	grid?: Grid

	constructor(renderer: RENDERER) {
		this.renderer = renderer;
	}

	async init() {
		// Load background and play/exit image using the renderer
		const backgroundTexture = await this.renderer.loadAsset(
			"/merge-game/assets/ui/home-text.png"
		);
		const playExitTexture = await this.renderer.loadAsset(
			"/merge-game/assets/ui/home-page play button-2.png"
		);
		this.backgroundSprite = this.renderer.createSprite(backgroundTexture);
		this.playExitSprite = this.renderer.createSprite(playExitTexture);

		const maxWidth = 4000
		const scale = this.renderer.app.screen.width / maxWidth
		const backgroundSpriteMultiplier = 0.4
		const playSpriteMultiplier = 2
		const width = this.renderer.app.screen.width
		const height = this.renderer.app.screen.height

		this.backgroundSprite.scale.set(scale * backgroundSpriteMultiplier)
		this.playExitSprite.scale.set(scale * playSpriteMultiplier);
		// Position background and play/exit image
		this.backgroundSprite.position.set(width / 2, height / 4);
		this.backgroundSprite.anchor.set(0.5, 0.5);
		// postion the play button on the center bottom
		this.playExitSprite.anchor.set(0.5, 1);
		this.playExitSprite.position.set(width / 2, height);

		this.playExitSprite.interactive = true;
		this.playExitSprite.buttonMode = true;

		this.renderer.stage(this.backgroundSprite, this.playExitSprite);

		// WARN: numbers are got by try and error
		const playSpritePositionX = this.playExitSprite.position.x - this.playExitSprite.width * 0.38
		const playSpritePositionY = this.playExitSprite.position.y - this.playExitSprite.width * 0.95
		const exitSpritePositionX = this.playExitSprite.position.x - this.playExitSprite.width * 0.28
		const exitSpritePositionY = this.playExitSprite.position.y - this.playExitSprite.width * 0.6
		const playButtonWidth = this.playExitSprite.width * 0.7
		const playButtonHeight = this.playExitSprite.width * 0.2
		const exitButtonWidth = this.playExitSprite.width * 0.5
		const exitButtonHeight = this.playExitSprite.height * 0.15

		this.playButtonSprite = this.renderer.createButton(playSpritePositionX, playSpritePositionY, playButtonWidth, playButtonHeight, () =>
			this.onPlayClick()
		);
		this.exitButtonSprite = this.renderer.createButton(exitSpritePositionX, exitSpritePositionY, exitButtonWidth, exitButtonHeight, () =>
			this.onExitClick()
		);

		this.renderer.stage(this.playButtonSprite, this.exitButtonSprite);
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
		this.grid = grid
		grid.init();
	}
	resize(width: number, height: number): void {
		if (!this.backgroundSprite || !this.playExitSprite) return
		const maxWidth = 4000
		const scale = width / maxWidth
		const backgroundSpriteMultiplier = 0.4
		const playSpriteMultiplier = 2


		this.backgroundSprite.scale.set(scale * backgroundSpriteMultiplier)
		this.playExitSprite.scale.set(scale * playSpriteMultiplier);
		// Position background and play/exit image
		this.backgroundSprite.position.set(width / 2, height / 4);
		this.backgroundSprite.anchor.set(0.5, 0.5);
		// postion the play button on the center bottom
		this.playExitSprite.anchor.set(0.5, 1);
		this.playExitSprite.position.set(width / 2, height);

		// the individual buttons postions and width
		// WARN: numbers are got by try and error
		const playSpritePositionX = this.playExitSprite.position.x - this.playExitSprite.width * 0.38
		const playSpritePositionY = this.playExitSprite.position.y - this.playExitSprite.width * 0.95
		const exitSpritePositionX = this.playExitSprite.position.x - this.playExitSprite.width * 0.28
		const exitSpritePositionY = this.playExitSprite.position.y - this.playExitSprite.width * 0.6
		const playButtonWidth = this.playExitSprite.width * 0.7
		const playButtonHeight = this.playExitSprite.width * 0.2
		const exitButtonWidth = this.playExitSprite.width * 0.5
		const exitButtonHeight = this.playExitSprite.height * 0.15

		this.playButtonSprite.position.set(playSpritePositionX, playSpritePositionY)
		this.exitButtonSprite.position.set(exitSpritePositionX, exitSpritePositionY)
		this.exitButtonSprite.width = exitButtonWidth
		this.exitButtonSprite.height = exitButtonHeight
		this.playButtonSprite.width = playButtonWidth
		this.playButtonSprite.height = playButtonHeight


		if (!this.grid) return
		this.grid.resize(width, height)

	}
}
