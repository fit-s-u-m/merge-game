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
		this.cellSize = 180; // Set cell size
		this.margin = 10; // Set margin between cells
        this.crop = new Crop(renderer); 
	}

	async init() {
		const totalGridWidth = this.gridSize * this.cellSize;
		const totalGridHeight = this.gridSize * this.cellSize;

		// Calculate the starting x and y positions to center the grid
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
		// Set position with offset to center the grid and add margin for spacing
		const xPos = startX + col * (this.cellSize + this.margin);
		const yPos = startY + row * (this.cellSize + this.margin);

		cellSprite.position.set(xPos, yPos);
		this.renderer.stage(cellSprite);


             // Randomly place crops on the grid
             await this.placeRandomCrop(row, col);


		return cellSprite;
	}

    // Method to place a random crop on the grid
    async placeRandomCrop(row: number, col: number) {
        const cropType = this.crop.getRandomCropType();
        await this.placeCrop(row, col, cropType);
    }
     // Method to place a specific crop on the grid
     async placeCrop(row: number, col: number, cropType: string) {
        // Use the cellSize to ensure all crops are the same size
        const cropSprite = await this.crop.createCrop(cropType, this.cellSize);
        const xPos = (this.renderer.app.screen.width - this.gridSize * this.cellSize) / 2 + col * (this.cellSize + this.margin) + this.cellSize / 2;
        const yPos = (this.renderer.app.screen.height - this.gridSize * this.cellSize) / 2 + row * (this.cellSize + this.margin) + this.cellSize / 2;
        
        cropSprite.position.set(xPos, yPos);
        
        this.renderer.stage(cropSprite);
    }
}
