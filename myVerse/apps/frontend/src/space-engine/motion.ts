import { COL, TILE_SIZE } from "@/utils/constants.utils";

import type {Direction} from "./utils/constants";
import type { TPosition } from "./types/engineType";
import layerUnavailable from "./utils/collison";

const moveTowards = (currPos: number, targetPos: number, maxStep:number) => {
    console.log("Move toward");

    const valueAfterCalculation = currPos + Math.sign(targetPos - currPos)*Math.min(Math.abs(targetPos-currPos), maxStep);
    return valueAfterCalculation;
}

const continueMovement = (currPos: TPosition, targetPos: TPosition, step: number): TPosition => {
    console.log("Continue Movemnt");
    console.log("currPos:", currPos);
    console.log("targetPos:", targetPos);
    console.log("step:", step);
    const x = moveTowards(currPos.x, targetPos.x, step);
    const y = moveTowards(currPos.y, targetPos.y, step);

    console.log(x);
    return {
        x,
        y
    }
}

export const calculateNewTarget = (x: number, y: number, dir: Direction):TPosition => {
    console.log("Calculate New target");
    return {
        x: (x/TILE_SIZE)*TILE_SIZE + (dir === "LEFT" ? (-1 * TILE_SIZE) : (dir === "RIGHT" ? TILE_SIZE : 0)),
        y: (y/TILE_SIZE)*TILE_SIZE + (dir === "UP" ? (-1 * TILE_SIZE) : (dir === "DOWN" ? TILE_SIZE : 0))
    }
}

export const checkCanMove = (target: TPosition):boolean => {
    console.log("Check can Move");

    const x = Math.floor(target.x/TILE_SIZE);
    const y = Math.floor(target.y/TILE_SIZE);

    if(layerUnavailable[x*COL + y - 1] > 0) return false;
    return true;
}

export const handleMovemnt = (currentPos: TPosition, targetPos: TPosition, moveSpeed: number, delta: number) => {
    console.log("Handle Movement");
    console.log("movespeed: ", moveSpeed);
    console.log("delta: ", delta);
    const step = moveSpeed * TILE_SIZE * 1;
    
    const distance = Math.hypot(targetPos.x - currentPos.x, targetPos.y - currentPos.y);


    if(distance <= step){
        return {
            position: targetPos,
            completed: true
        }
    }

    return {
        position: continueMovement(currentPos, targetPos, step),
        completed: false
    }
}

