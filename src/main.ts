import { Application } from 'pixi.js';
import { navigation } from './utils/navigation';
import { initAssets } from './utils/assets';
import { HomeScreen } from './screens/HomeScreen';
export const app = new Application();

function resize() {
	const windowWidth = window.innerWidth;
	const windowHeight = window.innerHeight;
	const minWidth = 375;
	const minHeight = 700;

	// Calculate renderer and canvas sizes based on current dimensions
	const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
	const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;
	const scale = scaleX > scaleY ? scaleX : scaleY;
	const width = windowWidth * scale;
	const height = windowHeight * scale;

	// Update canvas style dimensions and scroll window up to avoid issues on mobile resize
	app.renderer.canvas.style.width = `${windowWidth}px`;
	app.renderer.canvas.style.height = `${windowHeight}px`;
	window.scrollTo(0, 0);

	// Update renderer  and navigation screens dimensions
	app.renderer.resize(width, height);
	navigation.resize(width, height);
}


/** Fire when document visibility changes - lose or regain focus */
function visibilityChange() {
	if (document.hidden) {
		// sound.pauseAll();
		navigation.blur();
	} else {
		// sound.resumeAll();
		navigation.focus();
	}
}

async function init() {
	// Initialize app
	await app.init({
		resolution: Math.max(window.devicePixelRatio, 2),
		backgroundColor: 0xffffff,
	});
	console.log("hit ")

	// Add pixi canvas element (app.canvas) to the document's body
	document.body.appendChild(app.canvas);

	// Whenever the window resizes, call the 'resize' function
	window.addEventListener('resize', resize);

	console.log("before resize")
	// Trigger the first resize
	resize();
	console.log("after resize")

	// Add a visibility listener, so the app can pause sounds and screens
	document.addEventListener('visibilitychange', visibilityChange);

	console.log("loading assets ")
	// Setup assets bundles (see assets.ts) and start up loading everything in background
	await initAssets();
	console.log("finished loading assets ")

	// Add a persisting background shared by all screens
	// navigation.setBackground(TiledBackground);

	// Show initial loading screen
	// await navigation.showScreen(LoadScreen);

	await navigation.showScreen(HomeScreen);
	// Init everything
	// Go to one of the screens if a shortcut is present in url params, otherwise go to home screen
	// 	if (getUrlParam('game') !== null) {
	// 		await navigation.showScreen(GameScreen);
	// 	} else if (getUrlParam('load') !== null) {
	// 		await navigation.showScreen(LoadScreen);
	// 	} else if (getUrlParam('result') !== null) {
	// 		await navigation.showScreen(ResultScreen);
	// 	} else {
	// 		await navigation.showScreen(HomeScreen);
	// 	}
	// }
	//
}
// Init everything
init();

