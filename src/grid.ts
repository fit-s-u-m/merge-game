import { GRIDINFO, RENDERER, SPRITE } from "../types";
import { Crop } from "./crops";
import gsap from "gsap";

export class Grid {
	renderer: RENDERER;
	gridSize: number;
	cellSize: number;
	margin: number; // Space between cells
	crop: Crop;
	startX: number
	startY: number
	private GridInfo: GRIDINFO = Array(5).fill(Array(5).fill(0)) // create a five by five array of zeros

	constructor(renderer: RENDERER, gridSize: number = 5) {
		this.renderer = renderer;
		this.gridSize = gridSize;
		this.cellSize = 200;
		this.margin = 15;
		const totalGridWidth = this.gridSize * this.cellSize;
		const totalGridHeight = this.gridSize * this.cellSize;

		this.startX = (this.renderer.app.screen.width - totalGridWidth) / 2;
		this.startY = (this.renderer.app.screen.height - totalGridHeight) / 2;
		this.crop = new Crop(renderer);
	}

	async init() {

		for (let row = 0; row < this.gridSize; row++) {
			for (let col = 0; col < this.gridSize; col++) {
				await this.createGridCell(row, col, this.startX, this.startY);
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
		this.GridInfo[row][col] = {
			x: xPos,
			y: yPos,
			cellSize: this.cellSize,
			fruit: cellSprite,
			fruitId: -1
		}
		console.log(this.GridInfo[row][col], row, col)
		console.log(this.GridInfo[0][0], "00 grid")
		console.log(this.GridInfo[0][1], "01 grid")
		// console.log(this.GridInfo[0][0], row, col)



		if (Math.random() > 0.5) { // random
			await this.placeRandomCrop(row, col);
		}

		return cellSprite;
	}

	async placeRandomCrop(row: number, col: number) {
		const cropType = this.crop.getFirstCropType();
		this.GridInfo[row][col].fruitId = Object.keys(this.crop.cropTypes).indexOf(cropType)
		await this.placeCrop(row, col, "lemon");
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
		gsap.to(cropSprite, { duration: 2, pixi: { positionX: xPos, positionY: yPos } })

		this.GridInfo[row][col].fruit = cropSprite
		this.crop.gridInfo = this.GridInfo // send the info to crop

		// cropSprite.position.set(xPos, yPos);
		this.renderer.makeDraggable(this.crop, cropSprite);
		this.renderer.stage(cropSprite);
	}
}
