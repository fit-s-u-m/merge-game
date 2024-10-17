import gsap from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";
import { randomRange } from './random';
import * as PIXI from "pixi.js";
import { SPRITE } from '../../types';

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin)

export async function resolveAndKillTweens(targets: gsap.TweenTarget) {
    const tweens = gsap.getTweensOf(targets);
    for (const tween of tweens) {
        // Force resolve tween promise, if exists
        if ((tween as any)['_prom']) (tween as any)['_prom']();
    }
    gsap.killTweensOf(targets);
}

export function pauseTweens(targets: gsap.TweenTarget) {
    const tweens = gsap.getTweensOf(targets);
    for (const tween of tweens) tween.pause();
}

export function resumeTweens(targets: gsap.TweenTarget) {
    const tweens = gsap.getTweensOf(targets);
    for (const tween of tweens) tween.resume();
}
export async function scaleAnimation(target: any, scale: number) {
    await gsap.to(target, {
        duration: 0.1,
        ease: "power4.out",
        pixi: { scale },
        yoyo: true,
        repeat: 1
    })
}
export async function spreadAnimation(targets: any[], arrIndex: number, size: number) { // 2d Arr put in one arr
    await gsap.from(targets, {
        duration: 0.1,
        ease: "power1.out",
        pixi: { alpha: 0.68 },
        stagger: { from: arrIndex, each: 0.1, grid: [size, size] },
    })
}

export async function earthquake(target: { x: number; y: number }, power = 8, duration = 0.5) {
    const shake = { power };
    await gsap.to(shake, {
        power: 0,
        duration,
        ease: 'linear',
        onUpdate: () => {
            if (!target) return;
            target.x = randomRange(-shake.power, shake.power);
            target.y = randomRange(-shake.power, shake.power);
        },
    });
}
export async function Spawn(target: SPRITE, xPos: number, yPos: number) {
    gsap.to(target.position, { duration: 2, x: xPos, y: yPos })
}
export async function SpawnStagger(target: SPRITE[], yPos: number, size = 5) {
    gsap.to(target, { duration: 2, pixi: { positionX: "+=i", positionY: yPos }, stagger: { grid: [size, size], each: 0.1 } })
}


