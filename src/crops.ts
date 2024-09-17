import { RENDERER, SPRITE, TEXTURE } from "../types";

export class Crop {
    renderer: RENDERER;
    cropTypes: { [key: string]: string };

    constructor(renderer: RENDERER) {
        this.renderer = renderer;
        this.cropTypes = {
            apple: "/assets/ui/apple.png",
            orange : "/assets/ui/orange.png",
            lemon : "/assets/ui/lemon.png",
            // Add more crop types here
        };
    }

    // Load crop texture
    async loadCropTexture(type: string): Promise<TEXTURE> {
        const texturePath = this.cropTypes[type];
        if (!texturePath) throw new Error(`Crop type ${type} not found.`);
        return await this.renderer.loadAsset(texturePath);
    }

    // Create crop sprite
    async createCrop(type: string): Promise<SPRITE> {
        const texture = await this.loadCropTexture(type);
        const cropSprite = this.renderer.createSprite(texture);
        return cropSprite;
    }
        // Method to get a random crop type
        getRandomCropType(): string {
            const cropKeys = Object.keys(this.cropTypes);
            const randomIndex = Math.floor(Math.random() * cropKeys.length);
            return cropKeys[randomIndex];
        }

}
