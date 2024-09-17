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
			// Add more crop types here
		};
	}

	// Get the texture path for a given crop type
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

	// Logic for starting the drag
	startDrag(sprite: SPRITE, event: any) {
		sprite.data = event.data;
		sprite.dragging = true;
		sprite.alpha = 0.5; // Make the sprite semi-transparent while dragging

		// Store the original position
		sprite.originalPosition = { x: sprite.x, y: sprite.y };

		// Store the offset between the mouse pointer and the sprite's position
		const newPosition = sprite.data.getLocalPosition(sprite.parent);
		sprite.dragOffset = {
			x: sprite.x - newPosition.x,
			y: sprite.y - newPosition.y,
		};
	}

	// Logic for ending the drag
	endDrag(sprite: SPRITE) {
		sprite.dragging = false;
		sprite.data = undefined;
		sprite.alpha = 1; // Reset the alpha

		// Move back to the original position
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
