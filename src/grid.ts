import { RENDERER, SPRITE } from "../types";
import { Crop } from "./crops";
export class Grid {
	renderer: RENDERER;
	gridSize: number;
	cellSize: number;
	margin: number; // Space between cells
	crop: Crop;

	constructor(renderer: RENDERER, gridSize: number = 5) {
		this.renderer = renderer;
		this.gridSize = gridSize;
		this.cellSize = 200;
		this.margin = 15;
		this.crop = new Crop(renderer);
	}

	async init() {
		const totalGridWidth = this.gridSize * this.cellSize;
		const totalGridHeight = this.gridSize * this.cellSize;

		const startX = (this.renderer.app.screen.width - totalGridWidth) / 2;
		const startY = (this.renderer.app.screen.height - totalGridHeight) / 2;

		for (let row = 0; row < this.gridSize; row++) {
			for (let col = 0; col < this.gridSize; col++) {
				await this.createGridCell(row, col, startX, startY);
			}
		}
	}
	async createGridCell(
		row: number,
		col: number,
		startX: number,
		startY: number
	): Promise<SPRITE> {
		const texturePath = "/assets/ui/cell-bg-2.png";
		const texture = await this.renderer.loadAsset(texturePath);
		const cellSprite = this.renderer.createSprite(texture);

		cellSprite.width = this.cellSize;
		cellSprite.height = this.cellSize;

		const xPos = startX + col * (this.cellSize + this.margin);
		const yPos = startY + row * (this.cellSize + this.margin);

		cellSprite.position.set(xPos, yPos);
		this.renderer.stage(cellSprite);

		await this.placeRandomCrop(row, col);

		return cellSprite;
	}

	async placeRandomCrop(row: number, col: number) {
		const cropType = this.crop.getRandomCropType();
		await this.placeCrop(row, col, cropType);
	}

	async placeCrop(row: number, col: number, cropType: string) {
		const cropSprite = await this.renderer.createCropSprite(
			this.crop,
			cropType,
			this.cellSize
		);
		const xPos =
			(this.renderer.app.screen.width - this.gridSize * this.cellSize) / 2 +
			col * (this.cellSize + this.margin) +
			this.cellSize / 2;
		const yPos =
			(this.renderer.app.screen.height - this.gridSize * this.cellSize) / 2 +
			row * (this.cellSize + this.margin) +
			this.cellSize / 2;

		cropSprite.position.set(xPos, yPos);
		this.renderer.makeDraggable(this.crop, cropSprite);
		this.renderer.stage(cropSprite);
	}
}
