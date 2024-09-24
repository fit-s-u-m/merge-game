import * as PIXI from "pixi.js";
import { ELEMENT, SPRITE, TEXTURE } from "../types.ts";
import { Crop } from "./crops";
import { PixiPlugin } from "gsap/PixiPlugin";
import gsap from "gsap";

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin)

export class Renderer {
	app: PIXI.Application;
	dragger: any
	playButtonSprite?: PIXI.Graphics;
    exitButtonSprite?: PIXI.Graphics;

	constructor() {
		this.app = new PIXI.Application();
	}

	async init() {
		await this.app.init({
			width: window.innerWidth,
			height: window.innerHeight,
		});
		this.app.stage.eventMode = "static";
		this.app.stage.hitArea = this.app.screen;

		this.app.stage.on("pointerup", () => {
			if (this.dragger) this.dragger.endDrag();
		});
		this.app.stage.on("pointerupoutside", () => {
			if (this.dragger) this.dragger.endDrag();
		});

		document.body.appendChild(this.app.canvas);

		// Load and set the background
		const bgPath = "/assets/ui/Background.jpeg";
		const backgroundTexture = await this.loadAsset(bgPath);
		const backgroundSprite = new PIXI.Sprite(backgroundTexture);
		backgroundSprite.zIndex = -10;
		backgroundSprite.width = this.app.screen.width;
		backgroundSprite.height = this.app.screen.height;
		this.stage(backgroundSprite);

		// Create and add a black overlay
		this.addOverlay();
	}

	addOverlay() {
		const overlay = new PIXI.Graphics();
		overlay.fill({ color: 0x000000, alpha: 0.6 });
		overlay.rect(0, 0, this.app.screen.width, this.app.screen.height);
		overlay.fill();
		overlay.zIndex = -9;
		this.stage(overlay);
	}
	createContainer() {
		return new PIXI.Container()
	}

	async loadAsset(path: string): Promise<PIXI.Texture> {
		return await PIXI.Assets.load(path);
	}

	createTexture(path: string): PIXI.Texture {
		return PIXI.Texture.from(path);
	}

	createSprite(texture: PIXI.Texture): PIXI.Sprite {
		return new PIXI.Sprite(texture);
	}
	    // Set up the home screen and return the sprites for positioning in HomePage.ts
		async createHomeScreenAssets(
			backgroundPath: string,
			playExitImagePath: string
		): Promise<{ backgroundSprite: PIXI.Sprite, playExitSprite: PIXI.Sprite }> {
			const backgroundTexture = await this.loadAsset(backgroundPath);
			const playExitTexture = await this.loadAsset(playExitImagePath);
	
			const backgroundSprite = this.createSprite(backgroundTexture);
			const playExitSprite = this.createSprite(playExitTexture);
	
			this.stage(backgroundSprite, playExitSprite);
			return { backgroundSprite, playExitSprite };
		}

		
    // Create an invisible button sprite on top of a target area
	createButton(x: number, y: number, width: number, height: number, callback: () => void): PIXI.Graphics {
		const buttonSprite = new PIXI.Graphics();
		buttonSprite.fill({color:0xFF0000, alpha:10}); // Transparent fill
		buttonSprite.rect(0, 0, width, height); // Create button based on width and height
		buttonSprite.fill();
	
		buttonSprite.position.set(x, y); // Set position of the button
		buttonSprite.interactive = true; // Make it interactive
	
		// Set the cursor style to "pointer" to simulate button behavior
		buttonSprite.cursor = 'pointer';
	
		// Attach the click event
		buttonSprite.on('pointerdown', callback);
	
		return buttonSprite;
	}

	stage(...element: ELEMENT[]) {
		element.forEach((element) => this.app.stage.addChild(element));
	}
	loadAssets(...params: string[]): Promise<any>[] {
		return params.map(async (x) => await PIXI.Assets.load(x))
	}

	createCropSprite(
		crop: Crop,
		texture: TEXTURE,
	) {
		const sprite = this.createSprite(texture);

		sprite.scale.set(0.6)
		sprite.anchor.set(0.5, 0.5);

		this.makeDraggable(crop, sprite);
		return sprite;
	}

	// Method to make a sprite draggable
	makeDraggable(crop: Crop, sprite: SPRITE) {
		sprite.interactive = true;

		sprite
			.on("pointerdown", (event) => crop.startDrag(sprite, event))
	}
}
