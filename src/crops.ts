import { RENDERER, SPRITE, TEXTURE } from "../types";
import { Grid } from "./grid";
import gsap from "gsap";

export class Crop {
	renderer: RENDERER;
	cropTypes?: TEXTURE[]
	dragTarget: any
	grid: Grid
	constructor(renderer: RENDERER, grid: Grid) {
		this.renderer = renderer;
		this.grid = grid
	}
	initAssets() {
		return Promise.all(this.renderer.loadAssets(
			"/assets/ui/crops/apple.png",
			"/assets/ui/crops/orange2.png",
			"/assets/ui/crops/lemon5.png",
			"/assets/ui/crops/capsicum.png",
			"/assets/ui/crops/carrot.png",
			"/assets/ui/crops/egg-plant.png",
			"/assets/ui/crops/mango.png",
			"/assets/ui/crops/strawberry.png",
		))
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

	async endDrag() {
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

		if (!this.grid.gridInfo || !this.cropTypes) return

		const localPosX = this.dragTarget.position.x - this.grid.gridInfo[0][0].x
		const localPosY = this.dragTarget.position.y - this.grid.gridInfo[0][0].y
		const prevLocalPosX = this.dragTarget.originalPosition.x - this.grid.gridInfo[0][0].x
		const prevLocalPosY = this.dragTarget.originalPosition.y - this.grid.gridInfo[0][0].y
		const numRow = this.grid.gridInfo[0].length
		const cellSize = this.grid.gridInfo[0][0].cellSize
		const gridBorder = cellSize * numRow
		if (localPosX < 0 || localPosY < 0 || localPosY > gridBorder || localPosX > gridBorder) // out of grid
			return returnToOriginal()

		// calculate row and col for target and current
		const targetRow = Math.floor(localPosY / cellSize)
		const targetCol = Math.floor(localPosX / cellSize)
		const row = Math.floor(prevLocalPosY / cellSize)
		const col = Math.floor(prevLocalPosX / cellSize)
		if (targetRow == row && col == targetCol) return returnToOriginal() // if it is in the same grid cell
		console.log(targetRow, targetCol)

		const targetIndex = this.grid.gridInfo[targetRow][targetCol].fruitId
		const currIndex = this.grid.gridInfo[row][col].fruitId

		if (currIndex != targetIndex || targetIndex == -1) return returnToOriginal()
		if (targetIndex + currIndex < this.cropTypes.length)
			this.grid.gridInfo[targetRow][targetCol].fruitId += 1

		const newTargetIndex = this.grid.gridInfo[targetRow][targetCol].fruitId
		const newTexture = this.cropTypes[newTargetIndex]

		if (this.grid.gridInfo[targetRow][targetCol].fruit) {
			const tl = gsap.timeline({ ease: "power2.out" })
			tl.to(this.grid.gridInfo[targetRow][targetCol].fruit, { duration: 0.8, pixi: { scale: 0.7 } }) // animation
			this.grid.gridInfo[targetRow][targetCol].fruit.texture = newTexture // swap texture
			tl.to(this.grid.gridInfo[targetRow][targetCol].fruit, { duration: 0.8, pixi: { scale: 0.6 } }) // animation
		}


		this.dragTarget.destroy()
		this.grid.gridInfo[row][col].fruitId = -1
		const randomEmptyCell = this.randomEmptyCell()
		this.grid.placeCrop(randomEmptyCell.row, randomEmptyCell.col, 0)


		this.dragTarget = null
		this.renderer.app.stage.off("pointermove", () => { this.moveDrag(this.dragTarget) })
	}
	randomEmptyCell() {
		const gridSize = this.grid.gridSize
		let emptyCells: { row: number, col: number }[] = []
		for (let row = 0; row < gridSize; row++) {
			for (let col = 0; col < gridSize; col++) {
				if (this.grid.gridInfo[row][col].fruitId == -1)
					emptyCells.push({ row, col })
			}
		}
		const randomChoose = Math.floor(Math.random() * emptyCells.length)
		return emptyCells[randomChoose]
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
