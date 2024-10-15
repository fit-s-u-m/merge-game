import { CELLPOS, RENDERER, SPRITE, TEXTURE, VECTOR } from "../types";
import { Grid } from "./grid";
import { randomEmptyCell } from "./utils/random";
import { scaleAnimation, spreadAnimation } from "./utils/animation";

export class Crop {
	renderer: RENDERER;
	cropTypes?: TEXTURE[];
	dragTarget: any;
	grid: Grid;
	constructor(renderer: RENDERER, grid: Grid) {
		this.renderer = renderer;
		this.grid = grid;
	}
	initAssets() {
		return Promise.all(
			this.renderer.loadAssets(
				"/merge-game/assets/ui/crops/apple.png",
				"/merge-game/assets/ui/crops/orange2.png",
				"/merge-game/assets/ui/crops/lemon5.png",
				"/merge-game/assets/ui/crops/capsicum.png",
				"/merge-game/assets/ui/crops/carrot.png",
				"/merge-game/assets/ui/crops/egg-plant.png",
				"/merge-game/assets/ui/crops/mango.png",
				"/merge-game/assets/ui/crops/strawberry.png"
			)
		);
	}

	//  starting the drag
	startDrag(sprite: SPRITE, event: any) {
		sprite.data = event.data;
		sprite.dragging = true;
		sprite.alpha = 0.5;
		sprite.zIndex = 50;
		this.renderer.dragger = this;
		this.dragTarget = sprite;

		sprite.originalPosition = { x: sprite.x, y: sprite.y };
		if (!sprite.data) return;

		const newPosition = sprite.data.getLocalPosition(sprite.parent);
		sprite.dragOffset = {
			x: sprite.x - newPosition.x,
			y: sprite.y - newPosition.y,
		};
		this.renderer.app.stage.on("pointermove", () => {
			this.moveDrag(sprite);
		});
	}
	returnToOriginal(target: SPRITE) {
		return () => {
			if (target.originalPosition)
				target.position.set(
					target.originalPosition.x,
					target.originalPosition.y
				)
		}

	}
	getGridRelativePosition(position: VECTOR) {
		const gridTopLeftCell = this.grid.gridInfo[0][0]
		const cellSize = this.grid.cellSize
		const margin = this.grid.margin
		const totalSeparation = cellSize + margin
		const x = position.x - gridTopLeftCell.x
		const y = position.y - gridTopLeftCell.y
		return {
			x,
			y,
			row: Math.floor(y / totalSeparation),
			col: Math.floor(x / totalSeparation)
		}

	}
	checkOutOfBounds(Xposition: number, Yposition: number, gridBorder: number) {
		return Xposition < 0 || Yposition < 0 || Yposition > gridBorder || Xposition > gridBorder
	}
	getGridInfo(row: number, col: number) {
		if (row >= this.grid.gridNumRow || col >= this.grid.gridNumRow)
			throw ("row and col excedes the grids row and col number")
		return this.grid.gridInfo[row][col]
	}
	isValidMove() {
		const numRow = this.grid.gridInfo[0].length
		const cellSize = this.grid.cellSize
		const margin = this.grid.margin
		const totalSeparation = cellSize + margin
		const gridEndPos = totalSeparation * numRow

		const currentPos = this.getGridRelativePosition(this.dragTarget.position)
		const prevPos = this.getGridRelativePosition(this.dragTarget.originalPosition)
		const outOfBound = this.checkOutOfBounds(currentPos.x, currentPos.y, gridEndPos)
		if (outOfBound) return false
		if (currentPos.row >= numRow || currentPos.col >= numRow) return false


		const targetIndex = this.getGridInfo(currentPos.row, currentPos.col).fruitId
		const dragIndex = this.getGridInfo(prevPos.row, prevPos.col).fruitId

		const inSamePos = currentPos.row == prevPos.row && currentPos.col == prevPos.col
		const areDifferentFruits = dragIndex != targetIndex || targetIndex == -1
		return !(inSamePos || areDifferentFruits)
	}

	merge(prevPos: CELLPOS, currPos: CELLPOS) {
		const target = this.getGridInfo(currPos.row, currPos.col)
		const targetFruit = target.fruit
		if (!targetFruit || !this.cropTypes) return
		scaleAnimation(targetFruit, 0.8)

		const targets = this.grid.cropCells
		if (!targets) return
		const arrIndex = (currPos.row * this.grid.gridNumRow) + currPos.col
		const targetIndex = target.fruitId
		const texture = this.cropTypes[targetIndex]

		spreadAnimation(targets, arrIndex, this.grid.gridNumRow)

		targetFruit.texture = texture // swap texture
		this.getGridInfo(prevPos.row, prevPos.col).fruitId = -1
	}
	async endDrag() {
		if (!this.dragTarget) return
		if (!this.grid.gridInfo || !this.cropTypes) return

		// default values
		this.dragTarget.dragging = false;
		this.dragTarget.data = undefined;
		this.dragTarget.alpha = 1;
		this.dragTarget.zindex = 0;

		const returnToOriginal = this.returnToOriginal(this.dragTarget)

		const currentPos = this.getGridRelativePosition(this.dragTarget.position)
		const prevPos = this.getGridRelativePosition(this.dragTarget.originalPosition)
		if (!this.isValidMove())
			return returnToOriginal()
		console.log(currentPos.row, currentPos.col, "current")
		console.log(prevPos.row, prevPos.col, "prev")
		const targetRow = currentPos.row
		const targetCol = currentPos.col


		const currIndex = this.getGridInfo(prevPos.row, prevPos.col).fruitId
		const targetIndex = this.getGridInfo(targetRow, targetCol).fruitId

		// game logic
		if (targetIndex + currIndex < this.cropTypes.length)
			this.getGridInfo(targetRow, targetCol).fruitId += 1
		this.dragTarget.destroy()
		this.merge(prevPos, currentPos)

		const randomEmptyCells = randomEmptyCell(this.grid.gridInfo, "fruitId")
		this.grid.placeCrop(randomEmptyCells.row, randomEmptyCells.col, 0)

		// remove dragging
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
