export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT" | undefined;

export const DIRECTION_KEYS: Record<string, Direction> = {
    KeyW: "UP",
    KeyS: "DOWN",
    KeyA: "LEFT",
    KeyD: "RIGHT",
    ArrowUp: "UP",
    ArrowDown: "DOWN",
    ArrowLeft: "LEFT",
    ArrowRight: "RIGHT",
}

export const MOVESPEED = 0.03
export const ANIMATION_SPEED = 0.2;