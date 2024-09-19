import { GRIDINFO, RENDERER, SPRITE } from "../types";

export class Crop {
	renderer: RENDERER;
	cropTypes: { [key: string]: string };
	dragTarget: any
	gridInfo?: GRIDINFO
	constructor(renderer: RENDERER) {
		this.renderer = renderer;
		this.cropTypes = {
			apple: "/assets/ui/apple.png",
			orange: "/assets/ui/orange2.png",
			lemon: "/assets/ui/lemon5.png",
		};
	}
	setGridInfo(gridInfo: GRIDINFO) {
		this.gridInfo = gridInfo
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
	getFirstCropType(): string {
		const cropKeys = Object.keys(this.cropTypes);
		return cropKeys[0];
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

		const returnToOriginal = () => {
			if (this.dragTarget.originalPosition) {
				this.dragTarget.position.set(
					this.dragTarget.originalPosition.x,
					this.dragTarget.originalPosition.y
				);
			}
			return
		}

		this.dragTarget.dragging = false;
		this.dragTarget.data = undefined;
		this.dragTarget.alpha = 1;
		this.dragTarget.zindex = 0;

		if (!this.gridInfo) return

		const localPosX = this.gridInfo[0][0].x - this.dragTarget.position.x
		const localPosY = this.gridInfo[0][0].y - this.dragTarget.position.y
		const numRow = this.gridInfo[0].length
		const cellSize = this.gridInfo[0][0].x - this.gridInfo[0][1].x
		const gridBorder = cellSize * numRow
		// console.log(this.gridInfo[0][0].y)
		if (localPosX < 0 || localPosY < 0 || localPosY > gridBorder || localPosX > gridBorder) // out of grid
			returnToOriginal()

		const targetRow = localPosX / cellSize
		const targetCol = localPosY / cellSize
		console.log(targetRow, targetCol)


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
