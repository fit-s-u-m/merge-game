import { Renderer } from "./renderer";
import { Grid } from "./grid";

async function main() {
    const renderer = new Renderer();
    await renderer.init();
    const grid = new Grid(renderer);
    await grid.init();

}
main();
