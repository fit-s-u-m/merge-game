import * as PIXI from "pixi.js";
import { ELEMENT, SPRITE, TEXTURE } from "../types.ts";
import { Crop } from "./crops";
import { resizeable } from "./utils/resizeable.ts";


export class Renderer implements resizeable {
	app: PIXI.Application;
	dragger: any
	background: SPRITE
	backgroundOverlay: PIXI.Graphics

	constructor() {
		this.app = new PIXI.Application();
	}

	async init() {
		await this.app.init({ resizeTo: window, background: 0x000000 });
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
		this.background = new PIXI.Sprite(backgroundTexture);
		this.background.zIndex = -10;
		this.background.width = this.app.screen.width;
		this.background.height = this.app.screen.height;
		this.stage(this.background);

		// Create and add a black overlay
		this.addOverlay();
	}

	addOverlay() {
		this.backgroundOverlay = new PIXI.Graphics();
		this.backgroundOverlay.fill({ color: 0x000000, alpha: 0.6 });
		this.backgroundOverlay.rect(0, 0, this.app.screen.width, this.app.screen.height).fill()
		this.backgroundOverlay.zIndex = -9;
		this.stage(this.backgroundOverlay);
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

	makeDraggable(crop: Crop, sprite: SPRITE) {
		sprite.interactive = true;
		sprite
			.on("pointerdown", (event) => crop.startDrag(sprite, event))
	}
	resize(width: number, height: number, scale: number): void {
		// resize bg
		this.background.height = height
		this.background.width = width
		this.backgroundOverlay.height = height
		this.backgroundOverlay.width = width

	}
}
