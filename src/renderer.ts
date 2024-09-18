import * as PIXI from "pixi.js";
import { ELEMENT, SPRITE } from "../types.ts";
import { Crop } from "./crops";

export class Renderer {
	app: PIXI.Application;
	dragger: any

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

	async loadAsset(path: string): Promise<PIXI.Texture> {
		return await PIXI.Assets.load(path);
	}

	createTexture(path: string): PIXI.Texture {
		return PIXI.Texture.from(path);
	}

	createSprite(texture: PIXI.Texture): PIXI.Sprite {
		return new PIXI.Sprite(texture);
	}

	stage(...element: ELEMENT[]) {
		element.forEach((element) => this.app.stage.addChild(element));
	}

	async createCropSprite(
		crop: Crop,
		type: string,
		size: number
	): Promise<SPRITE> {
		const texturePath = crop.getCropTexturePath(type);
		const texture = await this.loadAsset(texturePath);
		const sprite = this.createSprite(texture);

		sprite.width = size * 0.6;
		sprite.height = size * 0.6;
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
