import { GRIDINFO, RENDERER, SPRITE, TEXTURE } from "../types";
import { Crop } from "./crops";
import { Spawn } from "./utils/animation";
import { resizeable } from "./utils/resizeable";

export class Grid implements resizeable {
	renderer: RENDERER;
	gridNumRow: number;
	cellSize: number;
	margin: number; // Space between cells
	crop: Crop;
	startX: number
	startY: number
	private grid: (size: number) => GRIDINFO = (size: number) => Array.from({ length: size }, () => Array(size).fill(0));
	gridInfo: GRIDINFO
	cropCells: SPRITE[] = []
	miniCellSize = 30
	spawnAnimation: any
	resizeCalled = false

	constructor(renderer: RENDERER, gridSize: number = 5) {
		this.renderer = renderer;
		this.gridNumRow = gridSize;
		const width = this.renderer.app.screen.width
		const height = this.renderer.app.screen.height
		const minSize = Math.min(width, height)
		const totalGridWidth = minSize / 2
		const totalGridHeight = minSize / 2
		this.cellSize = 6 * (totalGridHeight / this.gridNumRow) / 7
		this.margin = (totalGridHeight / this.gridNumRow) / 7
		const frac = 2 / 3
		this.startX = (width - totalGridWidth) / 2;
		this.startY = frac * height - (totalGridHeight) / 2;
		this.crop = new Crop(renderer, this);
		this.gridInfo = this.grid(gridSize);
	}

	async init() {
		const cropAssets = await this.crop.initAssets();
		this.crop.cropTypes = cropAssets;
		const texturePath = "/merge-game/assets/ui/cell-bg-2.png";
		const textureCellBg = await this.renderer.loadAsset(texturePath);

		for (let row = 0; row < this.gridNumRow; row++) {
			for (let col = 0; col < this.gridNumRow; col++) {
				this.createGridCell(
					row,
					col,
					this.startX,
					this.startY,
					textureCellBg
				);
			}
		}
	}
	createGridCell(
		row: number,
		col: number,
		startX: number,
		startY: number,
		texture: TEXTURE
	) {
		const cellSprite = this.renderer.createSprite(texture);

		cellSprite.width = this.cellSize;
		cellSprite.height = this.cellSize;

		const xPos = startX + col * (this.cellSize + this.margin);
		const yPos = startY + row * (this.cellSize + this.margin);

		cellSprite.position.set(xPos, yPos);
		this.cropCells.push(cellSprite);
		this.renderer.stage(cellSprite);
		this.gridInfo[row][col] = {
			x: xPos,
			y: yPos,
			cellSize: this.cellSize,
			fruit: cellSprite,
			fruitId: -1,
		};

		if (Math.random() > 0.5) {
			// random
			this.placeCrop(row, col, 0);
		}
	}


	async placeCrop(row: number, col: number, cropType: number) {
		if (!this.crop.cropTypes) return
		const texture = this.crop.cropTypes[cropType]
		const cropSprite = this.renderer.createCropSprite(this.crop, texture)
		cropSprite.zIndex = 100

		const xPos = this.gridInfo[row][col].x + this.cellSize / 2
		const yPos = this.gridInfo[row][col].y + this.cellSize / 2

		this.renderer.makeDraggable(this.crop, cropSprite);
		this.renderer.stage(cropSprite);

		this.gridInfo[row][col].fruit = cropSprite;
		this.gridInfo[row][col].fruitId = cropType;
		const sixtyPercent = 0.6
		cropSprite.width = this.cellSize * sixtyPercent
		cropSprite.height = this.cellSize * sixtyPercent

		await Spawn(cropSprite, xPos, yPos)

	}
	resize(width: number, height: number): void {

		for (let row = 0; row < this.gridNumRow; row++) {
			for (let col = 0; col < this.gridNumRow; col++) {
				const minSize = Math.min(width, height)
				const totalGridWidth = minSize / 2
				const totalGridHeight = minSize / 2
				this.cellSize = 6 * (totalGridHeight / this.gridNumRow) / 7
				this.margin = (totalGridHeight / this.gridNumRow) / 7

				const frac = 2 / 3

				const startX = (width - totalGridWidth) / 2;
				const startY = frac * height - (totalGridHeight) / 2;

				const xPos = startX + col * (this.cellSize + this.margin);
				const yPos = startY + row * (this.cellSize + this.margin);

				const xCropPos = xPos + this.cellSize / 2
				const yCropPos = yPos + this.cellSize / 2
				this.gridInfo[row][col].x = xPos
				this.gridInfo[row][col].y = yPos
				this.gridInfo[row][col].cellSize = this.cellSize
				const fruit = this.gridInfo[row][col].fruit
				const fruitId = this.gridInfo[row][col].fruitId
				const arrIndex = row * this.gridNumRow + col
				const cell = this.cropCells[arrIndex]
				const sixtyPercent = 0.6

				if (fruit) {
					if (fruitId != -1) {
						Spawn(fruit, xCropPos, yCropPos)
						fruit.width = this.cellSize * sixtyPercent
						fruit.height = this.cellSize * sixtyPercent

					}
					Spawn(cell, xPos, yPos)
					cell.width = this.cellSize
					cell.height = this.cellSize
				}

			}
		}
	}
}
