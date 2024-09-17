import * as PIXI from "pixi.js";
import { Renderer } from "./src/renderer";
import { Grid } from "./src/grid";

// Extend PIXI.Sprite to include custom properties
export interface ExtendedSprite extends PIXI.Sprite {   
    data?: PIXI.FederatedPointerEvent | null; // Include nullability
	dragging?: boolean;
	originalPosition?: { x: number; y: number }; // Add originalPosition property
	dragOffset?: { x: number; y: number }; // Add dragOffset property
}

export type ELEMENT = PIXI.Sprite | PIXI.Text | PIXI.Container | PIXI.Graphics;
export type RENDERER = Renderer;
export type SPRITE = ExtendedSprite;
export type TEXTURE = PIXI.Texture;
export type TEXT = PIXI.Text;
export type EVENT = any; // TODO: find the correct type for event
export type CANDYINFO = {
	x: number;
	y: number;
	cellSize: number;
	candyId: number;
	candy?: SPRITE;
};
export type SPRITESHEET = PIXI.Spritesheet;
export type GRIDINFO = CANDYINFO[][];
export type GRID = Grid;
export type DIRECTION = "vertical" | "horizontal";
export type MATCH = {
	startIndex: { r: number; c: number };
	count: number;
	direction: DIRECTION;
	candyId: number;
};
export type VECTOR = PIXI.Point;
export type CONTAINER = PIXI.Container;
