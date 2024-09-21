import { GRIDINFO, RENDERER, TEXTURE } from "../types";
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
	private grid: (size: number) => GRIDINFO = (size: number) => Array.from({ length: size }, () => Array(size).fill(0));
	gridInfo: GRIDINFO

	constructor(renderer: RENDERER, gridSize: number = 5) {
		this.renderer = renderer;
		this.gridSize = gridSize;
		this.cellSize = 150;
		this.margin = 15;
		const totalGridWidth = this.gridSize * this.cellSize;
		const totalGridHeight = this.gridSize * this.cellSize;

		this.startX = (this.renderer.app.screen.width - totalGridWidth) / 2;
		this.startY = (this.renderer.app.screen.height - totalGridHeight) / 2;
		this.crop = new Crop(renderer, this);
		this.gridInfo = this.grid(gridSize)
	}

	async init() {
		const cropAssets = await this.crop.initAssets()
		this.crop.cropTypes = cropAssets
		const texturePath = "/assets/ui/cell-bg-2.png";
		const textureCellBg = await this.renderer.loadAsset(texturePath);

		for (let row = 0; row < this.gridSize; row++) {
			for (let col = 0; col < this.gridSize; col++) {
				this.createGridCell(row, col, this.startX, this.startY, textureCellBg);
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
		this.renderer.stage(cellSprite);
		this.gridInfo[row][col] = {
			x: xPos,
			y: yPos,
			cellSize: this.cellSize,
			fruit: cellSprite,
			fruitId: -1
		}

		if (Math.random() > 0.5) { // random
			this.placeCrop(row, col, 0)
		}
	}


	placeCrop(row: number, col: number, cropType: number) {
		if (!this.crop.cropTypes) return
		const texture = this.crop.cropTypes[cropType]
		const cropSprite = this.renderer.createCropSprite(this.crop, texture, this.cellSize)

		const xPos = this.gridInfo[row][col].x + this.cellSize / 2
		const yPos = this.gridInfo[row][col].y + this.cellSize / 2
		gsap.to(cropSprite, { duration: 2, pixi: { positionX: xPos, positionY: yPos } })

		this.gridInfo[row][col].fruit = cropSprite
		this.gridInfo[row][col].fruitId = cropType

		this.renderer.makeDraggable(this.crop, cropSprite);
		this.renderer.stage(cropSprite);
	}
}
