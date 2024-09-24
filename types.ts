import * as PIXI from "pixi.js";
import { Renderer } from "./src/renderer";

// Extend PIXI.Sprite to include custom properties
export interface ExtendedSprite extends PIXI.Sprite {
	data?: PIXI.FederatedPointerEvent | null;
	dragging?: boolean;
	originalPosition?: { x: number; y: number };
	dragOffset?: { x: number; y: number };
	buttonMode?: boolean;
}

export type ELEMENT = PIXI.Sprite | PIXI.Text | PIXI.Container | PIXI.Graphics;
export type RENDERER = Renderer;
export type SPRITE = ExtendedSprite;
export type TEXTURE = PIXI.Texture;
export type TEXT = PIXI.Text;
export type EVENT = any;
export type FruitINFO = {
	x: number;
	y: number;
	cellSize: number;
	fruitId: number;
	fruit?: SPRITE;
};
export type SPRITESHEET = PIXI.Spritesheet;
export type GRIDINFO = FruitINFO[][];
export type VECTOR = PIXI.Point;
export type CONTAINER = PIXI.Container;
