import { Renderer } from "./renderer";
import { resizeable } from "./utils/resizeable";
let resizeables: resizeable[] = []

function resize() {
	const windowWidth = window.innerWidth;
	const windowHeight = window.innerHeight;
	const minWidth = 375;
	const minHeight = 700;

	// Calculate renderer and canvas sizes based on current dimensions
	const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
	const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;
	const scale = scaleX > scaleY ? scaleX : scaleY;
	const width = windowWidth;
	const height = windowHeight;

	window.scrollTo(0, 0);
	resizeables.forEach(x => x.resize(width, height))
}

// import { Grid } from "./grid";

import { HomePage } from "./homepage";

async function main() {
	const renderer = new Renderer();
	await renderer.init();
	resizeables.push(renderer)
	window.addEventListener("resize", resize)
	const homePage = new HomePage(renderer);
	await homePage.init();
	resizeables.push(homePage)
}
main();
