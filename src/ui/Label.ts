import { TextStyleOptions, Text, TextStyle } from 'pixi.js';

const defaultLabelStyle: Partial<TextStyleOptions> = {
	fontFamily: 'Arial Rounded MT Bold',
	align: 'center',
};

export type LabelOptions = typeof defaultLabelStyle;

export class Label extends Text {
	constructor(text?: string | number, style?: Partial<TextStyleOptions> | TextStyle) {
		style = { ...defaultLabelStyle, ...style };
		super({ text, style });
		// Label is always centered, but this can be changed in instance afterwards
		this.anchor.set(0.5);
	}
}
