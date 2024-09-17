import { RENDERER, SPRITE } from "../types";

export class Crop {
	renderer: RENDERER;
	cropTypes: { [key: string]: string };

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

		sprite.originalPosition = { x: sprite.x, y: sprite.y };

		const newPosition = sprite.data.getLocalPosition(sprite.parent);
		sprite.dragOffset = {
			x: sprite.x - newPosition.x,
			y: sprite.y - newPosition.y,
		};
	}

	endDrag(sprite: SPRITE) {
		sprite.dragging = false;
		sprite.data = undefined;
		sprite.alpha = 1;

		if (sprite.originalPosition) {
			sprite.position.set(
				sprite.originalPosition.x,
				sprite.originalPosition.y
			);
		}
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
