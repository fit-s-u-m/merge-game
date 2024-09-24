import { Renderer } from "./renderer";
// import { Grid } from "./grid";

import { HomePage } from "./homepage";

async function main() {
    const renderer = new Renderer();
    await renderer.init();
    // const grid = new Grid(renderer);
    // await grid.init();
    const homePage = new HomePage(renderer);
    await homePage.init();
}
main();
