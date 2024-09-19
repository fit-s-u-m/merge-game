import { RENDERER, SPRITE } from "../types";

export class Crop {
	renderer: RENDERER;
	cropTypes: { [key: string]: string };
	dragTarget: any

	constructor(renderer: RENDERER) {
		this.renderer = renderer;
		this.cropTypes = {
			apple: "/assets/ui/apple.png",
			orange: "/assets/ui/orange2.png",
			lemon: "/assets/ui/lemon5.png",
		};
	}

	getCropTexturePath(type: string): string {
		const texturePath = this.cropTypes[type];
		if (!texturePath) throw new Error(`Crop type ${type} not found.`);
		return texturePath;
	}

	// Get a random crop type
	getRandomCropType(): string {
		const cropKeys = Object.keys(this.cropTypes);
		const randomIndex = Math.floor(Math.random() * cropKeys.length);
		return cropKeys[randomIndex];
	}

	//  starting the drag
	startDrag(sprite: SPRITE, event: any) {
		sprite.data = event.data;
		sprite.dragging = true;
		sprite.alpha = 0.5;
		sprite.zIndex = 50;
		this.renderer.dragger = this
		this.dragTarget = sprite

		sprite.originalPosition = { x: sprite.x, y: sprite.y };
		if (!sprite.data) return

		const newPosition = sprite.data.getLocalPosition(sprite.parent);
		sprite.dragOffset = {
			x: sprite.x - newPosition.x,
			y: sprite.y - newPosition.y,
		};
		this.renderer.app.stage.on("pointermove", () => { this.moveDrag(sprite) })
	}

	endDrag() {
		if (!this.dragTarget) return
		this.dragTarget.dragging = false;
		this.dragTarget.data = undefined;
		this.dragTarget.alpha = 1;
		this.dragTarget.zindex = 0;

		// if (this.dragTarget.originalPosition) {
		// 	this.dragTarget.position.set(
		// 		this.dragTarget.originalPosition.x,
		// 		this.dragTarget.originalPosition.y
		// 	);
		// }
		this.dragTarget = null
		this.renderer.app.stage.off("pointermove", () => { this.moveDrag(this.dragTarget) })
	}

	moveDrag(sprite: SPRITE) {
		if (sprite.dragging && sprite.data) {
			const newPosition = sprite.data.getLocalPosition(sprite.parent);
			if (newPosition && sprite.dragOffset) {
				sprite.position.set(
					newPosition.x + sprite.dragOffset.x,
					newPosition.y + sprite.dragOffset.y
				);
			}
		}
	}
}
